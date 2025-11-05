import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
    default: 1,
    comment: '状态, 0: 删除，1: 正常',
    nullable: false,
  })
  public status: number;

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
