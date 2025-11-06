import { guid } from '@/common/utils';
import { StatusEnum } from '@/config';
import { Result, ResultPage } from '@/models/common';
import {
  CreateRoleDto,
  QueryRoleDto,
  Role,
  UpdateRoleDto,
} from '@/models/role';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { Between, Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    // Check if role code already exists
    const existing = await this.roleRepository.findOne({
      where: { code: createRoleDto.code, deletedAt: null },
    });

    if (existing) {
      throw new BadRequestException(`角色编码 ${createRoleDto.code} 已存在`);
    }

    const result = await this.roleRepository.save({
      ...createRoleDto,
      id: guid(),
      status: createRoleDto.status ?? StatusEnum.ENABLED,
      sort: createRoleDto.sort ?? 0,
      isSystem: createRoleDto.isSystem ?? 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return Result.success(result, '角色创建成功');
  }

  async findPage(query: QueryRoleDto) {
    const {
      pageNum = 1,
      pageSize = 10,
      name,
      code,
      status,
      isSystem,
      startDate,
      endDate,
    } = query;
    const skip = (pageNum - 1) * pageSize;

    const queryBuilder = this.roleRepository
      .createQueryBuilder('role')
      .where('role.deletedAt IS NULL');

    if (name) {
      queryBuilder.andWhere('role.name LIKE :name', {
        name: `%${name}%`,
      });
    }
    if (code) {
      queryBuilder.andWhere('role.code LIKE :code', {
        code: `%${code}%`,
      });
    }
    if (status !== undefined) {
      queryBuilder.andWhere('role.status = :status', { status });
    }
    if (isSystem !== undefined) {
      queryBuilder.andWhere('role.isSystem = :isSystem', { isSystem });
    }
    if (startDate && endDate) {
      queryBuilder.andWhere('role.createdAt BETWEEN :startDate AND :endDate', {
        startDate: new Date(startDate),
        endDate: dayjs(endDate).endOf('day').toDate(),
      });
    }

    const [data, total] = await queryBuilder
      .orderBy('role.sort', 'ASC')
      .addOrderBy('role.createdAt', 'DESC')
      .skip(skip)
      .take(pageSize)
      .getManyAndCount();

    const resultPage = new ResultPage<Role>(total, pageNum, pageSize, data);

    return Result.page(resultPage, '查询成功');
  }

  async findById(id: string) {
    const role = await this.roleRepository.findOne({
      where: { id, deletedAt: null },
    });

    if (!role) {
      throw new NotFoundException(`角色 ID ${id} 不存在`);
    }

    return Result.success(role);
  }

  async findByCode(code: string) {
    const role = await this.roleRepository.findOne({
      where: { code, status: StatusEnum.ENABLED, deletedAt: null },
    });

    return role;
  }

  async updateById(updateRoleDto: UpdateRoleDto) {
    const { id, ...rest } = updateRoleDto;

    // Check if role exists
    const existing = await this.roleRepository.findOne({
      where: { id, deletedAt: null },
    });

    if (!existing) {
      throw new NotFoundException(`角色 ID ${updateRoleDto.id} 不存在`);
    }

    // Check if system role is being modified
    if (existing.isSystem === 1 && (rest.code || rest.name)) {
      throw new BadRequestException('系统角色的编码和名称不能修改');
    }

    // Check if updating code to an existing one
    if (updateRoleDto.code && updateRoleDto.code !== existing.code) {
      const duplicate = await this.roleRepository.findOne({
        where: { code: updateRoleDto.code, deletedAt: null },
      });
      if (duplicate) {
        throw new BadRequestException(`角色编码 ${updateRoleDto.code} 已存在`);
      }
    }

    await this.roleRepository.update(id, {
      ...rest,
      updatedAt: new Date(),
    });

    return Result.success(null, '角色更新成功');
  }

  async removeById(id: string) {
    // Check if role exists
    const role = await this.roleRepository.findOne({
      where: { id, deletedAt: null },
    });

    if (!role) {
      throw new NotFoundException(`角色 ID ${id} 不存在`);
    }

    // Check if it's a system role
    if (role.isSystem === 1) {
      throw new BadRequestException('系统角色不能删除');
    }

    // Soft delete
    await this.roleRepository.update(id, {
      deletedAt: new Date(),
    });

    return Result.success(undefined, '角色删除成功');
  }

  async findAllEnabled() {
    const roles = await this.roleRepository.find({
      where: {
        status: StatusEnum.ENABLED,
        deletedAt: null,
      },
      order: { sort: 'ASC', createdAt: 'DESC' },
    });

    return Result.success(roles);
  }

  async findByIds(ids: string[]) {
    const roles = await this.roleRepository
      .createQueryBuilder('role')
      .where('role.id IN (:...ids)', { ids })
      .andWhere('role.deletedAt IS NULL')
      .orderBy('role.sort', 'ASC')
      .addOrderBy('role.createdAt', 'DESC')
      .getMany();

    return roles;
  }

  async updateStatus(id: string, status: number) {
    const role = await this.roleRepository.findOne({
      where: { id, deletedAt: null },
    });

    if (!role) {
      throw new NotFoundException(`角色 ID ${id} 不存在`);
    }

    await this.roleRepository.update(id, {
      status,
      updatedAt: new Date(),
    });

    return Result.success(null, '角色状态更新成功');
  }
}
