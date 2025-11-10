import { BaseEntity } from '@/common/base-entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, Unique } from 'typeorm';

@Entity('role_permission')
@Unique(['roleId', 'permissionId'])
@Index('idx_role_permission_role_id', ['roleId'])
@Index('idx_role_permission_permission_id', ['permissionId'])
export class RolePermission extends BaseEntity {
  @ApiProperty({
    type: String,
    description: '角色ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Column({
    type: 'varchar',
    length: 50,
    comment: '角色ID',
    nullable: false,
  })
  roleId: string;

  @ApiProperty({
    type: String,
    description: '权限ID',
    example: '456e7890-e89b-12d3-a456-426614174001',
  })
  @Column({
    type: 'varchar',
    length: 50,
    comment: '权限ID',
    nullable: false,
  })
  permissionId: string;

  @ApiProperty({ type: String, description: '创建人ID', required: false })
  @Column({
    type: 'varchar',
    length: 50,
    comment: '创建人ID',
    nullable: true,
  })
  createdBy?: string;
}
