import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString, IsUUID, ValidateNested } from 'class-validator';

export class CreateRolePermissionDto {
  @ApiProperty({
    description: '角色ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID(4, { message: '角色ID格式不正确' })
  @IsString()
  roleId: string;

  @ApiProperty({
    description: '权限ID列表',
    type: [String],
    example: [
      '456e7890-e89b-12d3-a456-426614174001',
      '789e0123-e89b-12d3-a456-426614174002',
    ],
  })
  @IsArray()
  @IsString({ each: true })
  permissionIds: string[];

  @ApiProperty({
    description: '创建人ID',
    required: false,
    example: 'admin-user-id',
  })
  @IsUUID(4, { message: '创建人ID格式不正确' })
  @IsString()
  createdBy?: string;
}

export class BatchCreateRolePermissionDto {
  @ApiProperty({
    description: '角色权限关联列表',
    type: [CreateRolePermissionDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRolePermissionDto)
  rolePermissions: CreateRolePermissionDto[];
}
