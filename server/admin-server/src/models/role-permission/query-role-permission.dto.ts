import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsUUID } from 'class-validator';

export class QueryRolePermissionDto {
  @ApiPropertyOptional({ description: '页码', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  pageNum?: number = 1;

  @ApiPropertyOptional({ description: '每页数量', example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  pageSize?: number = 10;

  @ApiPropertyOptional({
    description: '角色ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID(4, { message: '角色ID格式不正确' })
  roleId?: string;

  @ApiPropertyOptional({
    description: '权限ID',
    example: '456e7890-e89b-12d3-a456-426614174001',
  })
  @IsOptional()
  @IsUUID(4, { message: '权限ID格式不正确' })
  permissionId?: string;

  @ApiPropertyOptional({ description: '角色名称', example: '管理员' })
  @IsOptional()
  @IsString()
  roleName?: string;

  @ApiPropertyOptional({ description: '权限名称', example: '用户管理' })
  @IsOptional()
  @IsString()
  permissionName?: string;

  @ApiPropertyOptional({ description: '权限编码', example: 'user:manage' })
  @IsOptional()
  @IsString()
  permissionCode?: string;

  @ApiPropertyOptional({ description: '开始日期', example: '2024-01-01' })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({ description: '结束日期', example: '2024-12-31' })
  @IsOptional()
  @IsString()
  endDate?: string;
}
