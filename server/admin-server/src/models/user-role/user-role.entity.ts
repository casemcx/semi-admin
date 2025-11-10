import { BaseEntity } from '@/common/base-entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, Unique } from 'typeorm';

@Entity('user_role')
@Unique(['userId', 'roleId'])
@Index('idx_user_role_user_id', ['userId'])
@Index('idx_user_role_role_id', ['roleId'])
export class UserRole extends BaseEntity {
  @ApiProperty({
    type: String,
    description: '用户ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Column({
    type: 'varchar',
    length: 50,
    comment: '用户ID',
    nullable: false,
  })
  userId: string;

  @ApiProperty({
    type: String,
    description: '角色ID',
    example: '456e7890-e89b-12d3-a456-426614174001',
  })
  @Column({
    type: 'varchar',
    length: 50,
    comment: '角色ID',
    nullable: false,
  })
  roleId: string;

  @ApiProperty({ type: String, description: '创建人ID', required: false })
  @Column({
    type: 'varchar',
    length: 50,
    comment: '创建人ID',
    nullable: true,
  })
  createdBy?: string;
}
