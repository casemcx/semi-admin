import { BaseEntity } from '@/common/base-entity';
import { UserRole } from '@/models/user-role/user-role.entity';
import { ApiProperty } from '@nestjs/swagger';
import { hash } from 'bcrypt';
import { omit } from 'lodash-es';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  OneToMany,
  Unique,
} from 'typeorm';

@Entity('user')
@Unique(['username'])
@Unique(['email'])
@Index('idx_user_status', ['status'])
@Index('idx_user_phone', ['phone'])
@Index('idx_user_created_at', ['createdAt'])
export class User extends BaseEntity {
  @ApiProperty({ type: String, description: '用户名', maxLength: 50 })
  @Column({
    type: 'varchar',
    length: 50,
    comment: '用户名',
    nullable: false,
  })
  username: string;

  @ApiProperty({ type: String, description: '密码', maxLength: 255 })
  @Column({
    type: 'varchar',
    length: 255,
    comment: '密码（加密存储）',
    nullable: false,
  })
  password: string;

  @ApiProperty({
    type: String,
    description: '邮箱',
    maxLength: 100,
    required: false,
  })
  @Column({
    type: 'varchar',
    length: 100,
    comment: '邮箱',
    nullable: true,
    unique: true,
  })
  email?: string;

  @ApiProperty({
    type: String,
    description: '手机号',
    maxLength: 20,
    required: false,
  })
  @Column({
    type: 'varchar',
    length: 20,
    comment: '手机号',
    nullable: true,
  })
  phone?: string;

  @ApiProperty({
    type: String,
    description: '昵称',
    maxLength: 50,
    required: false,
  })
  @Column({
    type: 'varchar',
    length: 50,
    comment: '昵称',
    nullable: true,
  })
  nickname?: string;

  @ApiProperty({
    type: String,
    description: '头像URL',
    maxLength: 255,
    required: false,
  })
  @Column({
    type: 'varchar',
    length: 255,
    comment: '头像URL',
    nullable: true,
  })
  avatar?: string;

  @ApiProperty({
    type: Date,
    description: '最后登录时间',
    required: false,
  })
  @Column({
    type: 'datetime',
    comment: '最后登录时间',
    nullable: true,
  })
  lastLoginTime?: Date;

  @ApiProperty({
    type: String,
    description: '最后登录IP',
    maxLength: 50,
    required: false,
  })
  @Column({
    type: 'varchar',
    length: 50,
    comment: '最后登录IP',
    nullable: true,
  })
  lastLoginIp?: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await hash(this.password, 10);
    }
  }

  // 关联用户角色
  @OneToMany(
    () => UserRole,
    userRole => userRole.user,
  )
  userRoles?: UserRole[];

  static transformSafeUser<T extends User | User[]>(user: T): T {
    if (Array.isArray(user)) {
      return user.map(u => omit(u, 'password')) as T;
    }

    return omit(user, 'password') as T;
  }
}
