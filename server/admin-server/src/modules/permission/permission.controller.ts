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
    return this.permissionService.create(createPermissionDto);
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
    return this.permissionService.findPage(query);
  }

  @Get('tree')
  @ApiOperation({ summary: '获取权限树' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: Result<Permission[]>,
  })
  async getTree() {
    return this.permissionService.getTree();
  }

  async findByCode(@Param('code') code: string) {
    return this.permissionService.findByCode(code);
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
    return this.permissionService.findById(id);
  }

  @Patch('/updateById')
  @ApiOperation({ summary: '更新权限' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 404, description: '权限不存在' })
  @ApiBody({ type: UpdatePermissionDto })
  async updateById(@Body() updatePermissionDto: UpdatePermissionDto) {
    return this.permissionService.updateById(updatePermissionDto);
  }

  @Delete('/deleteById/:id')
  @ApiOperation({ summary: '删除权限' })
  @ApiResponse({ status: 200, description: '删除成功', type: Result<void> })
  @ApiResponse({ status: 404, description: '权限不存在' })
  @ApiResponse({ status: 400, description: '存在子权限或系统权限无法删除' })
  @ApiParam({ name: 'id', description: '权限ID' })
  async removeById(@Param('id') id: string) {
    return this.permissionService.removeById(id);
  }
}
