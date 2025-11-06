import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: '用户ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID(4, { message: '用户ID格式不正确' })
  id: string;

  @ApiProperty({
    description: '用户名',
    maxLength: 50,
    required: false,
    example: 'admin',
  })
  @IsOptional()
  @IsString()
  @Length(2, 50, { message: '用户名长度需要在2-50个字符之间' })
  username?: string;

  @ApiProperty({
    description: '密码',
    maxLength: 255,
    required: false,
    example: '123456',
  })
  @IsOptional()
  @IsString()
  @Length(6, 255, { message: '密码长度需要在6-255个字符之间' })
  password?: string;

  @ApiProperty({
    description: '邮箱',
    maxLength: 100,
    required: false,
    example: 'admin@example.com',
  })
  @IsOptional()
  @IsEmail({}, { message: '邮箱格式不正确' })
  @MaxLength(100, { message: '邮箱长度不能超过100个字符' })
  email?: string;

  @ApiProperty({
    description: '手机号',
    maxLength: 20,
    required: false,
    example: '13800138000',
  })
  @IsOptional()
  @IsString()
  @Length(11, 20, { message: '手机号长度需要在11-20个字符之间' })
  phone?: string;

  @ApiProperty({
    description: '昵称',
    maxLength: 50,
    required: false,
    example: '管理员',
  })
  @IsOptional()
  @IsString()
  @Length(1, 50, { message: '昵称长度需要在1-50个字符之间' })
  nickname?: string;

  @ApiProperty({ description: '头像URL', maxLength: 255, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255, { message: '头像URL长度不能超过255个字符' })
  avatar?: string;

  @ApiProperty({
    description: '状态：0-禁用 1-启用',
    required: false,
    example: 1,
  })
  @IsOptional()
  @Min(0)
  status?: number;

  @ApiProperty({ description: '最后登录时间', required: false })
  @IsOptional()
  lastLoginTime?: Date;

  @ApiProperty({ description: '最后登录IP', maxLength: 50, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: '最后登录IP长度不能超过50个字符' })
  lastLoginIp?: string;
}
