import { guid } from '@/common/utils';
import { ResultPage } from '@/models/common';
import {
  CreateRolePermissionDto,
  QueryRolePermissionDto,
  RolePermission,
} from '@/models/role-permission';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { Repository } from 'typeorm';
import { PermissionService } from '../permission/permission.service';
import { RoleService } from '../role/role.service';

@Injectable()
export class RolePermissionService {
  constructor(
    @InjectRepository(RolePermission)
    private rolePermissionRepository: Repository<RolePermission>,
    @Inject(forwardRef(() => RoleService))
    private roleService: RoleService,
    @Inject(forwardRef(() => PermissionService))
    private permissionService: PermissionService,
  ) {}

  async create(createRolePermissionDto: CreateRolePermissionDto) {
    // Check if role exists and is enabled
    const role = await this.roleService.findById(
      createRolePermissionDto.roleId,
    );
    if (!role) {
      throw new NotFoundException(
        `角色 ID ${createRolePermissionDto.roleId} 不存在`,
      );
    }

    // Check if all permissions exist and are enabled
    const permissions = [];
    for (const permissionId of createRolePermissionDto.permissionIds) {
      const permission = await this.permissionService.findById(permissionId);
      if (!permission || permission.status !== 1) {
        throw new BadRequestException(`权限 ID ${permissionId} 不存在或已禁用`);
      }
      permissions.push(permission);
    }

    // Remove existing role permissions
    await this.rolePermissionRepository.delete({
      roleId: createRolePermissionDto.roleId,
    });

    // Create new role permissions
    const rolePermissions = createRolePermissionDto.permissionIds.map(
      permissionId => ({
        id: guid(),
        roleId: createRolePermissionDto.roleId,
        permissionId: permissionId,
        createdBy: createRolePermissionDto.createdBy,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );

    const result = await this.rolePermissionRepository.save(rolePermissions);

    return result;
  }

  async findPage(query: QueryRolePermissionDto) {
    const {
      pageNum = 1,
      pageSize = 10,
      roleId,
      permissionId,
      roleName,
      permissionName,
      permissionCode,
      startDate,
      endDate,
    } = query;
    const skip = (pageNum - 1) * pageSize;

    const queryBuilder = this.rolePermissionRepository
      .createQueryBuilder('rolePermission')
      .leftJoinAndSelect('rolePermission.role', 'role')
      .leftJoinAndSelect('rolePermission.permission', 'permission')
      .where('role.deletedAt IS NULL')
      .andWhere('permission.deletedAt IS NULL');

    if (roleId) {
      queryBuilder.andWhere('rolePermission.roleId = :roleId', { roleId });
    }
    if (permissionId) {
      queryBuilder.andWhere('rolePermission.permissionId = :permissionId', {
        permissionId,
      });
    }
    if (roleName) {
      queryBuilder.andWhere('role.name LIKE :roleName', {
        roleName: `%${roleName}%`,
      });
    }
    if (permissionName) {
      queryBuilder.andWhere('permission.name LIKE :permissionName', {
        permissionName: `%${permissionName}%`,
      });
    }
    if (permissionCode) {
      queryBuilder.andWhere('permission.code LIKE :permissionCode', {
        permissionCode: `%${permissionCode}%`,
      });
    }
    if (startDate && endDate) {
      queryBuilder.andWhere(
        'rolePermission.createdAt BETWEEN :startDate AND :endDate',
        {
          startDate: new Date(startDate),
          endDate: dayjs(endDate).endOf('day').toDate(),
        },
      );
    }

    const [data, total] = await queryBuilder
      .orderBy('permission.sort', 'ASC')
      .addOrderBy('rolePermission.createdAt', 'DESC')
      .skip(skip)
      .take(pageSize)
      .getManyAndCount();

    const resultPage = new ResultPage<RolePermission>(
      total,
      pageNum,
      pageSize,
      data,
    );

    return resultPage;
  }

  async findByRoleId(roleId: string) {
    const rolePermissions = await this.rolePermissionRepository
      .createQueryBuilder('rolePermission')
      .leftJoinAndSelect('rolePermission.permission', 'permission')
      .where('rolePermission.roleId = :roleId', { roleId })
      .andWhere(
        'permission.status = :status AND permission.deletedAt IS NULL',
        { status: 1 },
      )
      .orderBy('permission.sort', 'ASC')
      .addOrderBy('permission.createdAt', 'DESC')
      .getMany();

    return rolePermissions;
  }

  async findByPermissionId(permissionId: string) {
    const rolePermissions = await this.rolePermissionRepository
      .createQueryBuilder('rolePermission')
      .leftJoinAndSelect('rolePermission.role', 'role')
      .where('rolePermission.permissionId = :permissionId', { permissionId })
      .andWhere('role.status = :status AND role.deletedAt IS NULL', {
        status: 1,
      })
      .orderBy('role.sort', 'ASC')
      .addOrderBy('role.createdAt', 'DESC')
      .getMany();

    return rolePermissions;
  }

  async removeById(roleId: string, permissionId: string) {
    const rolePermission = await this.rolePermissionRepository.findOne({
      where: { roleId, permissionId },
    });

    if (!rolePermission) {
      throw new NotFoundException('角色权限关联不存在');
    }

    await this.rolePermissionRepository.delete({ roleId, permissionId });
  }

  async removeByRoleId(roleId: string) {
    const rolePermissions = await this.rolePermissionRepository.find({
      where: { roleId },
    });

    if (rolePermissions.length === 0) {
      throw new NotFoundException(`角色 ${roleId} 没有分配任何权限`);
    }

    await this.rolePermissionRepository.delete({ roleId });
  }

  async getRolePermissions(roleId: string) {
    const permissions = await this.rolePermissionRepository
      .createQueryBuilder('rolePermission')
      .leftJoinAndSelect('rolePermission.permission', 'permission')
      .where('rolePermission.roleId = :roleId', { roleId })
      .andWhere(
        'permission.status = :status AND permission.deletedAt IS NULL',
        { status: 1 },
      )
      .getMany();

    return permissions.map(rolePermission => rolePermission.permission);
  }

  async getPermissionRoles(permissionId: string) {
    const roles = await this.rolePermissionRepository
      .createQueryBuilder('rolePermission')
      .leftJoinAndSelect('rolePermission.role', 'role')
      .where('rolePermission.permissionId = :permissionId', { permissionId })
      .andWhere('role.status = :status AND role.deletedAt IS NULL', {
        status: 1,
      })
      .getMany();

    return roles.map(rolePermission => rolePermission.role);
  }

  async checkRoleHasPermission(
    roleId: string,
    permissionCode: string,
  ): Promise<boolean> {
    const permission = await this.permissionService.findByCode(permissionCode);

    if (!permission) {
      return false;
    }

    const rolePermission = await this.rolePermissionRepository.findOne({
      where: { roleId, permissionId: permission.id },
    });

    return !!rolePermission;
  }

  async assignPermissionsToRole(
    roleId: string,
    permissionIds: string[],
    createdBy?: string,
  ) {
    // Check if role exists
    const role = await this.roleService.findById(roleId);
    if (!role) {
      throw new NotFoundException(`角色 ID ${roleId} 不存在`);
    }

    // Check if all permissions exist and are enabled
    const permissions = [];
    for (const permissionId of permissionIds) {
      const permission = await this.permissionService.findById(permissionId);
      if (!permission || permission.status !== 1) {
        throw new BadRequestException(`权限 ID ${permissionId} 不存在或已禁用`);
      }
      permissions.push(permission);
    }

    // Remove existing role permissions
    await this.rolePermissionRepository.delete({ roleId });

    // Create new role permissions
    const rolePermissions = permissionIds.map(permissionId => ({
      id: guid(),
      roleId,
      permissionId,
      createdBy,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const result = await this.rolePermissionRepository.save(rolePermissions);

    return result;
  }
}
