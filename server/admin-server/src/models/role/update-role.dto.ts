import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateRoleDto {
  @ApiProperty({
    description: '角色ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID(4, { message: '角色ID格式不正确' })
  id: string;

  @ApiProperty({
    description: '角色名称',
    maxLength: 50,
    required: false,
    example: '管理员',
  })
  @IsOptional()
  @IsString()
  @Length(1, 50, { message: '角色名称长度需要在1-50个字符之间' })
  name?: string;

  @ApiProperty({
    description: '角色编码',
    maxLength: 50,
    required: false,
    example: 'ADMIN',
  })
  @IsOptional()
  @IsString()
  @Length(1, 50, { message: '角色编码长度需要在1-50个字符之间' })
  code?: string;

  @ApiProperty({
    description: '角色描述',
    maxLength: 255,
    required: false,
    example: '系统管理员角色',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255, { message: '角色描述长度不能超过255个字符' })
  description?: string;

  @ApiProperty({ description: '排序值', required: false, example: 1 })
  @IsOptional()
  @Min(0)
  @Max(999999)
  sort?: number;

  @ApiProperty({
    description: '状态：0-禁用 1-启用',
    required: false,
    example: 1,
  })
  @IsOptional()
  @Min(0)
  @Max(1)
  status?: number;
}
