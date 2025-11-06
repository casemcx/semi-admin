import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  Length,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ description: '角色名称', maxLength: 50, example: '管理员' })
  @IsString()
  @Length(1, 50, { message: '角色名称长度需要在1-50个字符之间' })
  name: string;

  @ApiProperty({ description: '角色编码', maxLength: 50, example: 'ADMIN' })
  @IsString()
  @Length(1, 50, { message: '角色编码长度需要在1-50个字符之间' })
  code: string;

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

  @ApiProperty({ description: '排序值', default: 0, example: 1 })
  @IsOptional()
  @Min(0)
  @Max(999999)
  sort?: number;

  @ApiProperty({ description: '状态：0-禁用 1-启用', default: 1, example: 1 })
  @IsOptional()
  @Min(0)
  @Max(1)
  status?: number;

  @ApiProperty({
    description: '是否系统角色：0-否 1-是',
    default: 0,
    example: 0,
  })
  @IsOptional()
  @Min(0)
  @Max(1)
  isSystem?: number;
}
