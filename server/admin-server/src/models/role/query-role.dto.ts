import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Length, Max, Min } from 'class-validator';

export class QueryRoleDto {
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

  @ApiPropertyOptional({ description: '角色名称', example: '管理员' })
  @IsOptional()
  @IsString()
  @Length(1, 50, { message: '角色名称长度需要在1-50个字符之间' })
  name?: string;

  @ApiPropertyOptional({ description: '角色编码', example: 'ADMIN' })
  @IsOptional()
  @IsString()
  @Length(1, 50, { message: '角色编码长度需要在1-50个字符之间' })
  code?: string;

  @ApiPropertyOptional({ description: '状态：0-禁用 1-启用', example: 1 })
  @IsOptional()
  @Min(0)
  @Max(1)
  status?: number;

  @ApiPropertyOptional({ description: '是否系统角色：0-否 1-是', example: 0 })
  @IsOptional()
  @Min(0)
  @Max(1)
  isSystem?: number;

  @ApiPropertyOptional({ description: '开始日期', example: '2024-01-01' })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({ description: '结束日期', example: '2024-12-31' })
  @IsOptional()
  @IsString()
  endDate?: string;
}
