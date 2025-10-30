import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export enum PermissionType {
  MENU = 1,
  BUTTON = 2,
  API = 3,
}

export enum PermissionStatus {
  DISABLED = 0,
  ENABLED = 1,
}

export class CreatePermissionDto {
  @ApiProperty({ description: '权限名称', example: '用户管理' })
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiProperty({ description: '权限编码', example: 'user:manage' })
  @IsString()
  @MaxLength(100)
  code: string;

  @ApiProperty({
    description: '权限类型',
    enum: PermissionType,
    example: PermissionType.MENU,
  })
  @IsEnum(PermissionType)
  type: PermissionType;

  @ApiPropertyOptional({ description: '父权限ID', example: 0 })
  @IsOptional()
  @IsInt()
  parentId?: bigint | null;

  @ApiPropertyOptional({ description: '路由路径', example: '/users' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  path?: string | null;

  @ApiPropertyOptional({ description: '组件路径', example: 'UserManage' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  component?: string | null;

  @ApiPropertyOptional({ description: '图标', example: 'user' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  icon?: string | null;

  @ApiPropertyOptional({ description: 'HTTP方法', example: 'GET' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  method?: string | null;

  @ApiPropertyOptional({ description: 'API路径', example: '/api/users' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  apiPath?: string | null;

  @ApiPropertyOptional({ description: '排序', example: 1 })
  @IsOptional()
  @IsInt()
  sort?: number;

  @ApiPropertyOptional({
    description: '状态',
    enum: PermissionStatus,
    example: PermissionStatus.ENABLED,
  })
  @IsOptional()
  @IsEnum(PermissionStatus)
  status?: PermissionStatus;

  @ApiPropertyOptional({ description: '权限描述', example: '用户管理模块' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string | null;
}
