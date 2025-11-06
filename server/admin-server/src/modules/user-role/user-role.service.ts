import { guid } from '@/common/utils';
import { Result, ResultPage } from '@/models/common';
import {
  CreateUserRoleDto,
  QueryUserRoleDto,
  UserRole,
} from '@/models/user-role';
import { User } from '@/models/user/user.entity';
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
import { RoleService } from '../role/role.service';
import { UserService } from '../user/user.service';

@Injectable()
export class UserRoleService {
  constructor(
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    @Inject(forwardRef(() => RoleService))
    private roleService: RoleService,
  ) {}

  async create(createUserRoleDto: CreateUserRoleDto) {
    // Check if user exists using UserService
    const userResult = await this.userService.findById(
      createUserRoleDto.userId,
    );
    if (!userResult.data) {
      throw new NotFoundException(`用户 ID ${createUserRoleDto.userId} 不存在`);
    }

    // Check if all roles exist and are enabled using RoleService
    const roles = [];
    for (const roleId of createUserRoleDto.roleIds) {
      const roleResult = await this.roleService.findById(roleId);
      if (!roleResult.data || roleResult.data.status !== 1) {
        throw new BadRequestException(`角色 ID ${roleId} 不存在或已禁用`);
      }
      roles.push(roleResult.data);
    }

    // Remove existing user roles
    await this.userRoleRepository.delete({ userId: createUserRoleDto.userId });

    // Create new user roles
    const userRoles = createUserRoleDto.roleIds.map(roleId => ({
      id: guid(),
      userId: createUserRoleDto.userId,
      roleId: roleId,
      createdBy: createUserRoleDto.createdBy,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const result = await this.userRoleRepository.save(userRoles);

    return Result.success(result, '用户角色分配成功');
  }

  async findPage(query: QueryUserRoleDto) {
    const {
      pageNum = 1,
      pageSize = 10,
      userId,
      roleId,
      username,
      roleName,
      startDate,
      endDate,
    } = query;
    const skip = (pageNum - 1) * pageSize;

    const queryBuilder = this.userRoleRepository
      .createQueryBuilder('userRole')
      .leftJoinAndSelect('userRole.user', 'user')
      .leftJoinAndSelect('userRole.role', 'role')
      .where('user.deletedAt IS NULL')
      .andWhere('role.deletedAt IS NULL');

    if (userId) {
      queryBuilder.andWhere('userRole.userId = :userId', { userId });
    }
    if (roleId) {
      queryBuilder.andWhere('userRole.roleId = :roleId', { roleId });
    }
    if (username) {
      queryBuilder.andWhere('user.username LIKE :username', {
        username: `%${username}%`,
      });
    }
    if (roleName) {
      queryBuilder.andWhere('role.name LIKE :roleName', {
        roleName: `%${roleName}%`,
      });
    }
    if (startDate && endDate) {
      queryBuilder.andWhere(
        'userRole.createdAt BETWEEN :startDate AND :endDate',
        {
          startDate: new Date(startDate),
          endDate: dayjs(endDate).endOf('day').toDate(),
        },
      );
    }

    const [data, total] = await queryBuilder
      .orderBy('userRole.createdAt', 'DESC')
      .skip(skip)
      .take(pageSize)
      .getManyAndCount();

    const records = data.map(userRole => ({
      ...userRole,
      user: User.transformSafeUser(userRole.user),
    }));

    const resultPage = new ResultPage<UserRole>(
      total,
      pageNum,
      pageSize,
      records,
    );

    return Result.page(resultPage, '查询成功');
  }

  async findByUserId(userId: string) {
    const userRoles = await this.userRoleRepository
      .createQueryBuilder('userRole')
      .leftJoinAndSelect('userRole.role', 'role')
      .where('userRole.userId = :userId', { userId })
      .andWhere('role.status = :status AND role.deletedAt IS NULL', {
        status: 1,
      })
      .orderBy('role.sort', 'ASC')
      .addOrderBy('role.createdAt', 'DESC')
      .getMany();

    return Result.success(userRoles);
  }

  async findByRoleId(roleId: string) {
    const userRoles = await this.userRoleRepository
      .createQueryBuilder('userRole')
      .leftJoinAndSelect('userRole.user', 'user')
      .where('userRole.roleId = :roleId', { roleId })
      .andWhere('user.status = :status AND user.deletedAt IS NULL', {
        status: 1,
      })
      .orderBy('user.createdAt', 'DESC')
      .getMany();

    const records = userRoles.map(userRole => ({
      ...userRole,
      user: User.transformSafeUser(userRole.user),
    }));

    return Result.success(records);
  }

  async removeById(userId: string, roleId: string) {
    const userRole = await this.userRoleRepository.findOne({
      where: { userId, roleId },
    });

    if (!userRole) {
      throw new NotFoundException('用户角色关联不存在');
    }

    await this.userRoleRepository.delete({ userId, roleId });

    return Result.success(undefined, '用户角色取消成功');
  }

  async removeByUserId(userId: string) {
    const userRoles = await this.userRoleRepository.find({
      where: { userId },
    });

    if (userRoles.length === 0) {
      throw new NotFoundException(`用户 ${userId} 没有分配任何角色`);
    }

    await this.userRoleRepository.delete({ userId });

    return Result.success(undefined, '用户所有角色取消成功');
  }

  async getUserRoles(userId: string) {
    const roles = await this.userRoleRepository
      .createQueryBuilder('userRole')
      .leftJoinAndSelect('userRole.role', 'role')
      .where('userRole.userId = :userId', { userId })
      .andWhere('role.status = :status AND role.deletedAt IS NULL', {
        status: 1,
      })
      .getMany();

    return roles.map(userRole => userRole.role);
  }

  async getRoleUsers(roleId: string) {
    const users = await this.userRoleRepository
      .createQueryBuilder('userRole')
      .leftJoinAndSelect('userRole.user', 'user')
      .where('userRole.roleId = :roleId', { roleId })
      .andWhere('user.status = :status AND user.deletedAt IS NULL', {
        status: 1,
      })
      .getMany();

    return users
      .filter(role => role.user)
      .map(role => User.transformSafeUser(role.user));
  }

  async checkUserHasRole(userId: string, roleCode: string): Promise<boolean> {
    const role = await this.roleService.findByCode(roleCode);

    if (!role) {
      return false;
    }

    const userRole = await this.userRoleRepository.findOne({
      where: { userId, roleId: role.id },
    });

    return !!userRole;
  }
}
