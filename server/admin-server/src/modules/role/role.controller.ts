import { Result, ResultPage } from '@/models/common';
import {
  CreateRoleDto,
  QueryRoleDto,
  Role,
  UpdateRoleDto,
} from '@/models/role';
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
import { RoleService } from './role.service';

@ApiTags('角色管理')
@Controller('role')
@UsePipes(new ValidationPipe({ transform: true }))
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('create')
  @ApiOperation({ summary: '创建角色' })
  @ApiResponse({ status: 201, description: '角色创建成功', type: Result })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  async create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Post('findPage')
  @ApiOperation({ summary: '获取角色列表' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: Result<ResultPage<Role>>,
  })
  @ApiBody({ type: QueryRoleDto })
  async findPage(@Body() query: QueryRoleDto) {
    return this.roleService.findPage(query);
  }

  @Get('enabled')
  @ApiOperation({ summary: '获取启用的角色列表' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: Result<Role[]>,
  })
  async findAllEnabled() {
    return this.roleService.findAllEnabled();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取角色详情' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: Result<Role>,
  })
  @ApiResponse({ status: 404, description: '角色不存在' })
  @ApiParam({ name: 'id', description: '角色ID' })
  async findById(@Param('id') id: string) {
    return this.roleService.findById(id);
  }

  @Post('updateById')
  @ApiOperation({ summary: '更新角色' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 404, description: '角色不存在' })
  @ApiBody({ type: UpdateRoleDto })
  async updateById(@Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.updateById(updateRoleDto);
  }

  @Delete('deleteById/:id')
  @ApiOperation({ summary: '删除角色' })
  @ApiResponse({ status: 200, description: '删除成功', type: Result<void> })
  @ApiResponse({ status: 404, description: '角色不存在' })
  @ApiResponse({ status: 400, description: '系统角色不能删除' })
  @ApiParam({ name: 'id', description: '角色ID' })
  async removeById(@Param('id') id: string) {
    return this.roleService.removeById(id);
  }

  @Patch('updateStatus/:id')
  @ApiOperation({ summary: '更新角色状态' })
  @ApiResponse({ status: 200, description: '状态更新成功' })
  @ApiResponse({ status: 404, description: '角色不存在' })
  @ApiParam({ name: 'id', description: '角色ID' })
  async updateStatus(@Param('id') id: string, @Query('status') status: number) {
    return this.roleService.updateStatus(id, status);
  }
}
