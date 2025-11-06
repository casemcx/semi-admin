import { StatusEnum } from '@/config';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    type: 'int',
    default: StatusEnum.ENABLED,
    comment: '状态, 0: 禁用，1: 启用',
    nullable: true,
  })
  public status: StatusEnum;

  @CreateDateColumn({
    comment: '创建时间',
    name: 'created_at',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    comment: '更新时间',
    name: 'updated_at',
  })
  public updatedAt: Date;

  @DeleteDateColumn({
    comment: '删除时间',
    name: 'deleted_at',
    nullable: true,
  })
  public deletedAt?: Date;
}
