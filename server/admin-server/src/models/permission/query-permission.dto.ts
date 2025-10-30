import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { PermissionStatus, PermissionType } from './create-permission.dto';

export class QueryPermissionDto {
  @ApiPropertyOptional({ description: '页码', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number = 1;

  @ApiPropertyOptional({ description: '每页数量', example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number = 10;

  @ApiPropertyOptional({ description: '权限名称', example: '用户' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: '权限编码', example: 'user' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({
    description: '权限类型',
    enum: PermissionType,
  })
  @IsOptional()
  @IsEnum(PermissionType)
  type?: PermissionType;

  @ApiPropertyOptional({
    description: '状态',
    enum: PermissionStatus,
  })
  @IsOptional()
  @IsEnum(PermissionStatus)
  status?: PermissionStatus;

  @ApiPropertyOptional({ description: '父权限ID', example: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  parentId?: bigint | null;
}
