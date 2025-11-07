import { guid } from '@/common/utils';
import { StatusEnum } from '@/config';
import { ResultPage } from '@/models/common';
import {
  CreateUserDto,
  QueryUserDto,
  UpdateUserDto,
  User,
} from '@/models/user';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // Check if username already exists
    const existingUser = await this.userRepository.findOne({
      where: { username: createUserDto.username, deletedAt: null },
    });

    if (existingUser) {
      throw new BadRequestException(`用户名 ${createUserDto.username} 已存在`);
    }

    // Check if email already exists
    if (createUserDto.email) {
      const existingEmail = await this.userRepository.findOne({
        where: { email: createUserDto.email, deletedAt: null },
      });

      if (existingEmail) {
        throw new BadRequestException(`邮箱 ${createUserDto.email} 已存在`);
      }
    }

    // Check if phone already exists
    if (createUserDto.phone) {
      const existingPhone = await this.userRepository.findOne({
        where: { phone: createUserDto.phone, deletedAt: null },
      });

      if (existingPhone) {
        throw new BadRequestException(`手机号 ${createUserDto.phone} 已存在`);
      }
    }

    const result = await this.userRepository.save({
      ...createUserDto,
      id: guid(),
      status: createUserDto.status ?? StatusEnum.ENABLED,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return User.transformSafeUser(result);
  }

  async findPage(query: QueryUserDto) {
    const {
      pageNum = 1,
      pageSize = 10,
      username,
      email,
      phone,
      nickname,
      status,
      startDate,
      endDate,
    } = query;
    const skip = (pageNum - 1) * pageSize;

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .where('user.deletedAt IS NULL');

    if (username) {
      queryBuilder.andWhere('user.username LIKE :username', {
        username: `%${username}%`,
      });
    }
    if (email) {
      queryBuilder.andWhere('user.email LIKE :email', {
        email: `%${email}%`,
      });
    }
    if (phone) {
      queryBuilder.andWhere('user.phone LIKE :phone', {
        phone: `%${phone}%`,
      });
    }
    if (nickname) {
      queryBuilder.andWhere('user.nickname LIKE :nickname', {
        nickname: `%${nickname}%`,
      });
    }
    if (status !== undefined) {
      queryBuilder.andWhere('user.status = :status', { status });
    }
    if (startDate && endDate) {
      queryBuilder.andWhere('user.createdAt BETWEEN :startDate AND :endDate', {
        startDate: new Date(startDate),
        endDate: dayjs(endDate).endOf('day').toDate(),
      });
    }

    const [data, total] = await queryBuilder
      .orderBy('user.createdAt', 'DESC')
      .skip(skip)
      .take(pageSize)
      .getManyAndCount();

    return new ResultPage<User>(
      total,
      pageNum,
      pageSize,
      User.transformSafeUser(data),
    );
  }

  async findById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id, deletedAt: null },
    });

    if (!user) {
      throw new NotFoundException(`用户 ID ${id} 不存在`);
    }

    // Remove password from response
    return User.transformSafeUser(user);
  }

  async findByUsername(username: string) {
    const user = await this.userRepository.findOne({
      where: { username, deletedAt: null },
    });

    if (!user) {
      return null;
    }

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email, deletedAt: null },
    });

    if (!user) {
      return null;
    }

    return user;
  }

  async updateById(updateUserDto: UpdateUserDto) {
    const { id, ...rest } = updateUserDto;

    // Check if user exists
    const existing = await this.userRepository.findOne({
      where: { id, deletedAt: null },
    });

    if (!existing) {
      throw new NotFoundException(`用户 ID ${updateUserDto.id} 不存在`);
    }

    // Check if updating username to an existing one
    if (
      updateUserDto.username &&
      updateUserDto.username !== existing.username
    ) {
      const duplicate = await this.userRepository.findOne({
        where: { username: updateUserDto.username, deletedAt: null },
      });
      if (duplicate) {
        throw new BadRequestException(
          `用户名 ${updateUserDto.username} 已存在`,
        );
      }
    }

    // Check if updating email to an existing one
    if (updateUserDto.email && updateUserDto.email !== existing.email) {
      const duplicate = await this.userRepository.findOne({
        where: { email: updateUserDto.email, deletedAt: null },
      });
      if (duplicate) {
        throw new BadRequestException(`邮箱 ${updateUserDto.email} 已存在`);
      }
    }

    // Check if updating phone to an existing one
    if (updateUserDto.phone && updateUserDto.phone !== existing.phone) {
      const duplicate = await this.userRepository.findOne({
        where: { phone: updateUserDto.phone, deletedAt: null },
      });
      if (duplicate) {
        throw new BadRequestException(`手机号 ${updateUserDto.phone} 已存在`);
      }
    }

    await this.userRepository.update(id, {
      ...rest,
      updatedAt: new Date(),
    });
  }

  async removeById(id: string) {
    // Check if user exists
    const user = await this.userRepository.findOne({
      where: { id, deletedAt: null },
    });

    if (!user) {
      throw new NotFoundException(`用户 ID ${id} 不存在`);
    }

    // Soft delete
    await this.userRepository.update(id, {
      deletedAt: new Date(),
    });
  }

  async updateLoginInfo(id: string, ip: string) {
    await this.userRepository.update(id, {
      lastLoginTime: new Date(),
      lastLoginIp: ip,
    });
  }

  async findByIds(ids: string[]) {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id IN (:...ids)', { ids })
      .andWhere('user.deletedAt IS NULL')
      .orderBy('user.createdAt', 'DESC')
      .getMany();

    return User.transformSafeUser(users);
  }

  async updateStatus(id: string, status: number) {
    const user = await this.userRepository.findOne({
      where: { id, deletedAt: null },
    });

    if (!user) {
      throw new NotFoundException(`用户 ID ${id} 不存在`);
    }

    await this.userRepository.update(id, {
      status,
      updatedAt: new Date(),
    });
  }
}
