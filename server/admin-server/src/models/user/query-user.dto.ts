import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Length, Max, Min } from 'class-validator';

export class QueryUserDto {
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

  @ApiPropertyOptional({ description: '用户名', example: 'admin' })
  @IsOptional()
  @IsString()
  @Length(1, 50, { message: '用户名长度需要在1-50个字符之间' })
  username?: string;

  @ApiPropertyOptional({ description: '邮箱', example: 'admin@example.com' })
  @IsOptional()
  @IsString()
  @Length(1, 100, { message: '邮箱长度需要在1-100个字符之间' })
  email?: string;

  @ApiPropertyOptional({ description: '手机号', example: '13800138000' })
  @IsOptional()
  @IsString()
  @Length(1, 20, { message: '手机号长度需要在1-20个字符之间' })
  phone?: string;

  @ApiPropertyOptional({ description: '昵称', example: '管理员' })
  @IsOptional()
  @IsString()
  @Length(1, 50, { message: '昵称长度需要在1-50个字符之间' })
  nickname?: string;

  @ApiPropertyOptional({ description: '状态：0-禁用 1-启用', example: 1 })
  @IsOptional()
  @Min(0)
  @Max(1)
  status?: number;

  @ApiPropertyOptional({ description: '开始日期', example: '2024-01-01' })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({ description: '结束日期', example: '2024-12-31' })
  @IsOptional()
  @IsString()
  endDate?: string;
}
