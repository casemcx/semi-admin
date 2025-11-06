import { BaseEntity } from '@/common/base-entity';
import { RolePermission } from '@/models/role-permission/role-permission.entity';
import { UserRole } from '@/models/user-role/user-role.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, OneToMany, Unique } from 'typeorm';

@Entity('role')
@Unique(['code'])
@Index('idx_role_name', ['name'])
@Index('idx_role_status', ['status'])
@Index('idx_role_sort', ['sort'])
export class Role extends BaseEntity {
  @ApiProperty({ type: String, description: '角色名称', maxLength: 50 })
  @Column({
    type: 'varchar',
    length: 50,
    comment: '角色名称',
    nullable: false,
  })
  name: string;

  @ApiProperty({ type: String, description: '角色编码', maxLength: 50 })
  @Column({
    type: 'varchar',
    length: 50,
    comment: '角色编码',
    nullable: false,
  })
  code: string;

  @ApiProperty({
    type: String,
    description: '角色描述',
    maxLength: 255,
    required: false,
  })
  @Column({
    type: 'varchar',
    length: 255,
    comment: '角色描述',
    nullable: true,
  })
  description?: string;

  @ApiProperty({ type: Number, description: '排序值', default: 0 })
  @Column({
    type: 'int',
    default: 0,
    comment: '排序（数字越小越靠前）',
    nullable: false,
  })
  sort: number;

  @ApiProperty({
    type: Number,
    description: '状态：0-禁用 1-启用',
    default: 1,
  })
  @Column({
    type: 'tinyint',
    default: 1,
    comment: '状态：0-禁用 1-启用',
    nullable: false,
  })
  status: number;

  @ApiProperty({
    type: Number,
    description: '是否系统角色：0-否 1-是',
    default: 0,
  })
  @Column({
    type: 'tinyint',
    default: 0,
    comment: '是否系统角色：0-否 1-是（系统角色不可删除）',
    nullable: false,
  })
  isSystem: number;

  // 关联用户角色
  @OneToMany(
    () => UserRole,
    userRole => userRole.role,
  )
  userRoles?: UserRole[];

  // 关联角色权限
  @OneToMany(
    () => RolePermission,
    rolePermission => rolePermission.role,
  )
  rolePermissions?: RolePermission[];
}
