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
    const result = await this.roleService.create(createRoleDto);
    return Result.success(result, '角色创建成功');
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
    const result = await this.roleService.findPage(query);
    return Result.page(result, '查询成功');
  }

  @Get('enabled')
  @ApiOperation({ summary: '获取启用的角色列表' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: Result<Role[]>,
  })
  async findAllEnabled() {
    const result = await this.roleService.findAllEnabled();
    return Result.success(result, '查询成功');
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
    const result = await this.roleService.findById(id);
    return Result.success(result, '查询成功');
  }

  @Post('updateById')
  @ApiOperation({ summary: '更新角色' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 404, description: '角色不存在' })
  @ApiBody({ type: UpdateRoleDto })
  async updateById(@Body() updateRoleDto: UpdateRoleDto) {
    await this.roleService.updateById(updateRoleDto);
    return Result.success(null, '角色更新成功');
  }

  @Delete('deleteById/:id')
  @ApiOperation({ summary: '删除角色' })
  @ApiResponse({ status: 200, description: '删除成功', type: Result<void> })
  @ApiResponse({ status: 404, description: '角色不存在' })
  @ApiResponse({ status: 400, description: '系统角色不能删除' })
  @ApiParam({ name: 'id', description: '角色ID' })
  async removeById(@Param('id') id: string) {
    await this.roleService.removeById(id);
    return Result.success(null, '角色删除成功');
  }

  @Patch('updateStatus/:id')
  @ApiOperation({ summary: '更新角色状态' })
  @ApiResponse({ status: 200, description: '状态更新成功' })
  @ApiResponse({ status: 404, description: '角色不存在' })
  @ApiParam({ name: 'id', description: '角色ID' })
  async updateStatus(@Param('id') id: string, @Query('status') status: number) {
    await this.roleService.updateStatus(id, status);
    return Result.success(null, '角色状态更新成功');
  }
}
