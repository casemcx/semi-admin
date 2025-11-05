import { guid } from '@/common/utils';
import { Result, ResultPage } from '@/models/common';
import {
  CreatePermissionDto,
  QueryPermissionDto,
  UpdatePermissionDto,
} from '@/models/permission';
import { Permission } from '@/models/permission/permission.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto) {
    // Check if permission code already exists
    const existing = await this.permissionRepository.findOne({
      where: { code: createPermissionDto.code },
    });

    if (existing) {
      throw new BadRequestException(
        `权限编码 ${createPermissionDto.code} 已存在`,
      );
    }

    const permission = this.permissionRepository.create(createPermissionDto);
    const result = await this.permissionRepository.save(permission);

    return Result.success(result, '权限创建成功');
  }

  async findPage(query: QueryPermissionDto) {
    const { pageNum = 1, pageSize = 10, name, code, type, status } = query;
    const skip = (pageNum - 1) * pageSize;

    const queryBuilder = this.permissionRepository
      .createQueryBuilder('permission')
      .where('permission.deletedAt IS NULL');

    if (name) {
      queryBuilder.andWhere('permission.name LIKE :name', {
        name: `%${name}%`,
      });
    }
    if (code) {
      queryBuilder.andWhere('permission.code LIKE :code', {
        code: `%${code}%`,
      });
    }
    if (type !== undefined) {
      queryBuilder.andWhere('permission.type = :type', { type });
    }
    if (status !== undefined) {
      queryBuilder.andWhere('permission.status = :status', { status });
    }

    const [data, total] = await queryBuilder
      .orderBy('permission.sort', 'ASC')
      .addOrderBy('permission.createdAt', 'DESC')
      .skip(skip)
      .take(pageSize)
      .getManyAndCount();

    const resultPage = new ResultPage<Permission>(
      total,
      pageNum,
      pageSize,
      data,
    );

    return Result.page(resultPage, '查询成功');
  }

  async findOne(id: string) {
    const permission = await this.permissionRepository.findOne({
      where: { id: Number(id), deletedAt: null },
    });

    if (!permission) {
      throw new NotFoundException(`权限 ID ${id} 不存在`);
    }

    return Result.success(permission);
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto) {
    // Check if permission exists
    const existing = await this.permissionRepository.findOne({
      where: { id: Number(id), deletedAt: null },
    });

    if (!existing) {
      throw new NotFoundException(`权限 ID ${id} 不存在`);
    }

    // Check if updating code to an existing one
    if (
      updatePermissionDto.code &&
      updatePermissionDto.code !== existing.code
    ) {
      const duplicate = await this.permissionRepository.findOne({
        where: { code: updatePermissionDto.code },
      });
      if (duplicate) {
        throw new BadRequestException(
          `权限编码 ${updatePermissionDto.code} 已存在`,
        );
      }
    }

    await this.permissionRepository.update(Number(id), updatePermissionDto);

    const updatedPermission = await this.permissionRepository.findOne({
      where: { id: Number(id) },
    });

    return Result.success(updatedPermission, '权限更新成功');
  }

  async remove(id: string) {
    // Check if permission exists
    const permission = await this.permissionRepository.findOne({
      where: { id: Number(id), deletedAt: null },
    });

    if (!permission) {
      throw new NotFoundException(`权限 ID ${id} 不存在`);
    }

    // Soft delete
    await this.permissionRepository.update(Number(id), {
      deletedAt: new Date(),
    });

    return Result.success(undefined, '权限删除成功');
  }

  async getTree() {
    const permissions = await this.permissionRepository
      .createQueryBuilder('permission')
      .where('permission.deletedAt IS NULL')
      .orderBy('permission.sort', 'ASC')
      .addOrderBy('permission.createdAt', 'DESC')
      .getMany();

    // Since there's no parentId field, return flat list
    return Result.success(permissions);
  }

  async findByCode(code: string) {
    const permission = await this.permissionRepository.findOne({
      where: { code, deletedAt: null },
    });

    return permission;
  }

  async findByIds(ids: number[]) {
    const permissions = await this.permissionRepository
      .createQueryBuilder('permission')
      .where('permission.id IN (:...ids)', { ids })
      .andWhere('permission.deletedAt IS NULL')
      .orderBy('permission.sort', 'ASC')
      .addOrderBy('permission.createdAt', 'DESC')
      .getMany();

    return permissions;
  }
}
