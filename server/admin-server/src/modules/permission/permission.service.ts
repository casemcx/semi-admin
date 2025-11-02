import { guid } from '@/common/utils';
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

    const permission = await this.prisma.permission.create({
      data: {
        ...createPermissionDto,
        id: guid(),
      },
    });

    return Result.success(permission, '权限创建成功');
  }

  async findPage(query: QueryPermissionDto) {
    const { pageNum = 1, pageSize = 10, name, code, type, status } = query;
    const skip = (pageNum - 1) * pageSize;

    const where: Prisma.PermissionWhereInput = {
      deletedAt: null,
      name: name ? { contains: name } : undefined,
      code: code ? { contains: code } : undefined,
      type: type !== undefined ? type : undefined,
      status: status !== undefined ? status : undefined,
    };

    const [data, total] = await Promise.all([
      this.prisma.permission.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: [{ sort: 'asc' }, { createdAt: 'desc' }],
      }),
      this.prisma.permission.count({ where }),
    ]);

    const resultPage = new ResultPage<Permission>(
      total,
      pageNum,
      pageSize,
      data,
    );

    return Result.page(resultPage, '查询成功');
  }

  async findOne(id: string) {
    const permission = await this.prisma.permission.findUnique({
      where: { id: BigInt(id), deletedAt: null },
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

    const permission = await this.prisma.permission.update({
      where: { id: BigInt(id) },
      data: updatePermissionDto,
    });

    return Result.success(permission, '权限更新成功');
  }

  async remove(id: string) {
    // Check if permission exists
    const permission = await this.prisma.permission.findUnique({
      where: { id: BigInt(id), deletedAt: null },
    });

    if (!permission) {
      throw new NotFoundException(`权限 ID ${id} 不存在`);
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

    // Since there's no parentId field, return flat list
    return Result.success(permissions);
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
