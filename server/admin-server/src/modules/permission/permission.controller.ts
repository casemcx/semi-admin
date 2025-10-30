import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
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
import {
  CreatePermissionDto,
  QueryPermissionDto,
  UpdatePermissionDto,
} from '../../models/permission';
import { PermissionService } from './permission.service';

@ApiTags('权限管理')
@Controller('permission')
@UsePipes(new ValidationPipe({ transform: true }))
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post('create')
  @ApiOperation({ summary: '创建权限' })
  @ApiResponse({ status: 201, description: '权限创建成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  @Post('findPage')
  @ApiOperation({ summary: '获取权限列表' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiBody({ type: QueryPermissionDto })
  async findPage(@Body() query: QueryPermissionDto) {
    return this.permissionService.findPage(query);
  }

  @Get('tree')
  @ApiOperation({ summary: '获取权限树' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getTree() {
    return this.permissionService.getTree();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取权限详情' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 404, description: '权限不存在' })
  @ApiParam({ name: 'id', description: '权限ID' })
  async findOne(@Param('id') id: string) {
    return this.permissionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新权限' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 404, description: '权限不存在' })
  @ApiParam({ name: 'id', description: '权限ID' })
  async update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除权限' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '权限不存在' })
  @ApiResponse({ status: 400, description: '存在子权限或系统权限无法删除' })
  @ApiParam({ name: 'id', description: '权限ID' })
  async remove(@Param('id') id: string) {
    return this.permissionService.remove(id);
  }
}
