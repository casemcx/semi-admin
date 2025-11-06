import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString, IsUUID, ValidateNested } from 'class-validator';

export class CreateUserRoleDto {
  @ApiProperty({
    description: '用户ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID(4, { message: '用户ID格式不正确' })
  @IsString()
  userId: string;

  @ApiProperty({
    description: '角色ID列表',
    type: [String],
    example: [
      '456e7890-e89b-12d3-a456-426614174001',
      '789e0123-e89b-12d3-a456-426614174002',
    ],
  })
  @IsArray()
  @IsString({ each: true })
  roleIds: string[];

  @ApiProperty({
    description: '创建人ID',
    required: false,
    example: 'admin-user-id',
  })
  @IsUUID(4, { message: '创建人ID格式不正确' })
  @IsString()
  createdBy?: string;
}

export class BatchCreateUserRoleDto {
  @ApiProperty({
    description: '用户角色关联列表',
    type: [CreateUserRoleDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateUserRoleDto)
  userRoles: CreateUserRoleDto[];
}
