import { Result, ResultPage } from '@/models/common';
import {
  CreatePermissionDto,
  QueryPermissionDto,
  UpdatePermissionDto,
} from '@/models/permission';
import { PrismaService } from '@/services/prisma';
import { Permission, Prisma } from '@generated/client';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class PermissionService {
  constructor(private prisma: PrismaService) {}

  async create(createPermissionDto: CreatePermissionDto) {
    // Check if permission code already exists
    const existing = await this.prisma.permission.findUnique({
      where: { code: createPermissionDto.code },
    });

    if (existing) {
      throw new BadRequestException(
        `权限编码 ${createPermissionDto.code} 已存在`,
      );
    }

    // If parentId is provided, check if parent exists
    if (createPermissionDto.parentId && createPermissionDto.parentId !== 0n) {
      const parent = await this.prisma.permission.findUnique({
        where: { id: createPermissionDto.parentId },
      });
      if (!parent) {
        throw new BadRequestException(
          `父权限 ID ${createPermissionDto.parentId} 不存在`,
        );
      }
    }

    const permission = await this.prisma.permission.create({
      data: {
        ...createPermissionDto,
        parentId: createPermissionDto.parentId || 0n,
      },
    });

    return Result.success(permission, '权限创建成功');
  }

  async findPage(query: QueryPermissionDto) {
    const { page = 1, limit = 10, name, code, type, status, parentId } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.PermissionWhereInput = {
      deletedAt: null,
      name: name ? { contains: name } : undefined,
      code: code ? { contains: code } : undefined,
      type: type !== undefined ? type : undefined,
      status: status !== undefined ? status : undefined,
      parentId: parentId !== undefined ? parentId : undefined,
    };

    const [data, total] = await Promise.all([
      this.prisma.permission.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ sort: 'asc' }, { createdAt: 'desc' }],
        include: {
          parent: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
        },
      }),
      this.prisma.permission.count({ where }),
    ]);

    const resultPage = new ResultPage<Permission>(total, page, limit, data);

    return Result.page(resultPage, '查询成功');
  }

  async findOne(id: string) {
    const permission = await this.prisma.permission.findUnique({
      where: { id: BigInt(id), deletedAt: null },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        children: {
          where: { deletedAt: null },
          orderBy: { sort: 'asc' },
        },
      },
    });

    if (!permission) {
      throw new NotFoundException(`权限 ID ${id} 不存在`);
    }

    return Result.success(permission);
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto) {
    // Check if permission exists
    const existing = await this.prisma.permission.findUnique({
      where: { id: BigInt(id), deletedAt: null },
    });

    if (!existing) {
      throw new NotFoundException(`权限 ID ${BigInt(id)} 不存在`);
    }

    // Check if updating code to an existing one
    if (
      updatePermissionDto.code &&
      updatePermissionDto.code !== existing.code
    ) {
      const duplicate = await this.prisma.permission.findUnique({
        where: { code: updatePermissionDto.code },
      });
      if (duplicate) {
        throw new BadRequestException(
          `权限编码 ${updatePermissionDto.code} 已存在`,
        );
      }
    }

    // Check if new parent exists (and is not itself)
    if (updatePermissionDto.parentId !== undefined) {
      if (
        updatePermissionDto.parentId &&
        updatePermissionDto.parentId === BigInt(id)
      ) {
        throw new BadRequestException('不能将自己设为父权限');
      }

      if (updatePermissionDto.parentId && updatePermissionDto.parentId !== 0n) {
        const parent = await this.prisma.permission.findUnique({
          where: { id: updatePermissionDto.parentId, deletedAt: null },
        });
        if (!parent) {
          throw new BadRequestException(
            `父权限 ID ${updatePermissionDto.parentId} 不存在`,
          );
        }
      }
    }

    // Prevent updating system permission
    if (existing.isSystem === 1) {
      throw new BadRequestException('系统权限不能修改');
    }

    const permission = await this.prisma.permission.update({
      where: { id: BigInt(id) },
      data: updatePermissionDto,
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    return Result.success(permission, '权限更新成功');
  }

  async remove(id: string) {
    // Check if permission exists
    const permission = await this.prisma.permission.findUnique({
      where: { id: BigInt(id), deletedAt: null },
      include: {
        children: {
          where: { deletedAt: null },
        },
      },
    });

    if (!permission) {
      throw new NotFoundException(`权限 ID ${id} 不存在`);
    }

    // Check if has children
    if (permission.children.length > 0) {
      throw new BadRequestException('存在子权限，无法删除');
    }

    // Prevent deleting system permission
    if (permission.isSystem === 1) {
      throw new BadRequestException('系统权限不能删除');
    }

    // Soft delete
    await this.prisma.permission.update({
      where: { id: BigInt(id) },
      data: { deletedAt: new Date() },
    });

    return Result.success(undefined, '权限删除成功');
  }

  async getTree() {
    const permissions = await this.prisma.permission.findMany({
      where: { deletedAt: null },
      orderBy: [{ sort: 'asc' }, { createdAt: 'desc' }],
    });

    // Build tree structure
    const buildTree = (parentId = 0n): any[] => {
      return permissions
        .filter(p => p.parentId === parentId)
        .map(p => ({
          ...p,
          children: buildTree(p.id),
        }));
    };

    const tree = buildTree();

    return Result.success(tree);
  }

  async findByCode(code: string) {
    const permission = await this.prisma.permission.findUnique({
      where: { code, deletedAt: null },
    });

    return permission;
  }

  async findByIds(ids: bigint[]) {
    const permissions = await this.prisma.permission.findMany({
      where: {
        id: { in: ids },
        deletedAt: null,
      },
      orderBy: [{ sort: 'asc' }, { createdAt: 'desc' }],
    });

    return permissions;
  }
}
