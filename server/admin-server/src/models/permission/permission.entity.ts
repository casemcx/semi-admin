import { BaseEntity } from '@/common/base-entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, Unique } from 'typeorm';

@Entity('permission')
@Index('idx_permission_type', ['type'])
@Index('idx_permission_status', ['status'])
@Index('idx_permission_parent_id', ['parentId'])
export class Permission extends BaseEntity {
  @ApiProperty({ type: String, description: '权限名称', maxLength: 50 })
  @Column({
    type: 'varchar',
    length: 50,
    comment: '权限名称',
    nullable: false,
  })
  name: string;

  @ApiProperty({ type: String, description: '权限编码', maxLength: 100 })
  @Column({
    type: 'varchar',
    length: 100,
    comment: '权限编码',
    nullable: false,
  })
  code: string;

  @ApiProperty({ type: Number, description: '权限类型：1-菜单 2-按钮 3-接口' })
  @Column({
    type: 'int',
    comment: '权限类型：1-菜单 2-按钮 3-接口',
    nullable: false,
  })
  type: number;

  @ApiProperty({
    type: String,
    description: '路由路径',
    maxLength: 255,
    required: false,
  })
  @Column({
    type: 'varchar',
    length: 255,
    comment: '路由路径',
    nullable: true,
  })
  path?: string;

  @ApiProperty({
    type: String,
    description: '组件路径',
    maxLength: 255,
    required: false,
  })
  @Column({
    type: 'varchar',
    length: 255,
    comment: '组件路径',
    nullable: true,
  })
  component?: string;

  @ApiProperty({
    type: String,
    description: '图标',
    maxLength: 100,
    required: false,
  })
  @Column({
    type: 'varchar',
    length: 100,
    comment: '图标',
    nullable: true,
  })
  icon?: string;

  @ApiProperty({
    type: String,
    description: '请求方法',
    maxLength: 10,
    required: false,
  })
  @Column({
    type: 'varchar',
    length: 10,
    comment: '请求方法',
    nullable: true,
  })
  method?: string;

  @ApiProperty({
    type: String,
    description: 'API路径',
    maxLength: 255,
    required: false,
  })
  @Column({
    type: 'varchar',
    length: 255,
    comment: 'API路径',
    nullable: true,
  })
  apiPath?: string;

  @ApiProperty({ type: Number, description: '排序值', default: 0 })
  @Index('idx_permission_sort')
  @Column({
    type: 'int',
    default: 0,
    comment: '排序值',
    nullable: false,
  })
  sort: number;

  @ApiProperty({
    type: String,
    description: '权限描述',
    maxLength: 255,
    required: false,
  })
  @Column({
    type: 'varchar',
    length: 255,
    comment: '权限描述',
    nullable: true,
  })
  description?: string;

  @ApiProperty({ type: String, description: '父权限ID', default: '-1' })
  @Column({
    type: 'varchar',
    length: 20,
    default: '-1',
    comment: '父权限ID',
    nullable: false,
  })
  parentId: string;
}
