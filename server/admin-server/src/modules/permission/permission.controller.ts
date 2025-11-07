import { Result, ResultPage } from '@/models/common';
import {
  CreatePermissionDto,
  QueryPermissionDto,
  UpdatePermissionDto,
} from '@/models/permission';
import { Permission } from '@/models/permission/permission.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PermissionService } from './permission.service';

@ApiTags('权限管理')
@Controller('permission')
@UsePipes(new ValidationPipe({ transform: true }))
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post('create')
  @ApiOperation({ summary: '创建权限' })
  @ApiResponse({ status: 201, description: '权限创建成功', type: Result })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    const result = await this.permissionService.create(createPermissionDto);
    return Result.success(result, '权限创建成功');
  }

  @Post('findPage')
  @ApiOperation({ summary: '获取权限列表' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: Result<ResultPage<Permission>>,
  })
  @ApiBody({ type: QueryPermissionDto })
  async findPage(@Body() query: QueryPermissionDto) {
    const result = await this.permissionService.findPage(query);
    return Result.page(result, '查询成功');
  }

  @Get('tree')
  @ApiOperation({ summary: '获取权限树' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: Result<Permission[]>,
  })
  async getTree() {
    const result = await this.permissionService.getTree();
    return Result.success(result, '查询成功');
  }

  @Get('code/:code')
  @ApiOperation({ summary: '根据编码获取权限' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: Result<Permission>,
  })
  @ApiParam({ name: 'code', description: '权限编码' })
  async findByCode(@Param('code') code: string) {
    const result = await this.permissionService.findByCode(code);
    return Result.success(result, '查询成功');
  }

  @Get(':id')
  @ApiOperation({ summary: '获取权限详情' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: Result<Permission>,
  })
  @ApiResponse({ status: 404, description: '权限不存在' })
  @ApiParam({ name: 'id', description: '权限ID' })
  async findById(@Param('id') id: string) {
    const result = await this.permissionService.findById(id);
    return Result.success(result, '查询成功');
  }

  @Post('/updateById')
  @ApiOperation({ summary: '更新权限' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 404, description: '权限不存在' })
  @ApiBody({ type: UpdatePermissionDto })
  async updateById(@Body() updatePermissionDto: UpdatePermissionDto) {
    await this.permissionService.updateById(updatePermissionDto);
    return Result.success(null, '权限更新成功');
  }

  @Delete('/deleteById/:id')
  @ApiOperation({ summary: '删除权限' })
  @ApiResponse({ status: 200, description: '删除成功', type: Result<void> })
  @ApiResponse({ status: 404, description: '权限不存在' })
  @ApiResponse({ status: 400, description: '存在子权限或系统权限无法删除' })
  @ApiParam({ name: 'id', description: '权限ID' })
  async removeById(@Param('id') id: string) {
    await this.permissionService.removeById(id);
    return Result.success(null, '权限删除成功');
  }
}
