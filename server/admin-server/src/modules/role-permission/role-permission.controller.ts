import { Result, ResultPage } from '@/models/common';
import {
  CreateRolePermissionDto,
  QueryRolePermissionDto,
  RolePermission,
} from '@/models/role-permission';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
import { RolePermissionService } from './role-permission.service';

@ApiTags('角色权限管理')
@Controller('role-permission')
@UsePipes(new ValidationPipe({ transform: true }))
export class RolePermissionController {
  constructor(private readonly rolePermissionService: RolePermissionService) {}

  @Post('create')
  @ApiOperation({ summary: '分配角色权限' })
  @ApiResponse({ status: 201, description: '权限分配成功', type: Result })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 404, description: '角色或权限不存在' })
  async create(@Body() createRolePermissionDto: CreateRolePermissionDto) {
    const result = await this.rolePermissionService.create(
      createRolePermissionDto,
    );
    return Result.success(result, '角色权限分配成功');
  }

  @Post('findPage')
  @ApiOperation({ summary: '获取角色权限关联列表' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: Result<ResultPage<RolePermission>>,
  })
  @ApiBody({ type: QueryRolePermissionDto })
  async findPage(@Body() query: QueryRolePermissionDto) {
    const result = await this.rolePermissionService.findPage(query);
    return Result.success(result, '查询成功');
  }

  @Get('role/:roleId')
  @ApiOperation({ summary: '获取角色的权限列表' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: Result<RolePermission[]>,
  })
  @ApiParam({ name: 'roleId', description: '角色ID' })
  async findByRoleId(@Param('roleId') roleId: string) {
    const result = await this.rolePermissionService.findByRoleId(roleId);
    return Result.success(result, '查询成功');
  }

  @Get('permission/:permissionId')
  @ApiOperation({ summary: '获取权限关联的角色列表' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: Result<RolePermission[]>,
  })
  @ApiParam({ name: 'permissionId', description: '权限ID' })
  async findByPermissionId(@Param('permissionId') permissionId: string) {
    const result =
      await this.rolePermissionService.findByPermissionId(permissionId);
    return Result.success(result, '查询成功');
  }

  @Delete('role/:roleId/permission/:permissionId')
  @ApiOperation({ summary: '取消角色权限关联' })
  @ApiResponse({ status: 200, description: '取消成功', type: Result<void> })
  @ApiResponse({ status: 404, description: '角色权限关联不存在' })
  @ApiParam({ name: 'roleId', description: '角色ID' })
  @ApiParam({ name: 'permissionId', description: '权限ID' })
  async removeById(
    @Param('roleId') roleId: string,
    @Param('permissionId') permissionId: string,
  ) {
    await this.rolePermissionService.removeById(roleId, permissionId);
    return Result.success(null, '角色权限关联取消成功');
  }

  @Delete('role/:roleId')
  @ApiOperation({ summary: '取消角色所有权限' })
  @ApiResponse({ status: 200, description: '取消成功', type: Result<void> })
  @ApiResponse({ status: 404, description: '角色没有分配任何权限' })
  @ApiParam({ name: 'roleId', description: '角色ID' })
  async removeByRoleId(@Param('roleId') roleId: string) {
    await this.rolePermissionService.removeByRoleId(roleId);
    return Result.success(null, '角色所有权限取消成功');
  }

  @Get('role/:roleId/permissions')
  @ApiOperation({ summary: '获取角色的权限信息' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
  })
  @ApiParam({ name: 'roleId', description: '角色ID' })
  async getRolePermissions(@Param('roleId') roleId: string) {
    const permissions =
      await this.rolePermissionService.getRolePermissions(roleId);
    return Result.success(permissions, '查询成功');
  }

  @Get('permission/:permissionId/roles')
  @ApiOperation({ summary: '获取权限的角色信息' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
  })
  @ApiParam({ name: 'permissionId', description: '权限ID' })
  async getPermissionRoles(@Param('permissionId') permissionId: string) {
    const roles =
      await this.rolePermissionService.getPermissionRoles(permissionId);
    return Result.success(roles, '查询成功');
  }

  @Post('role/:roleId/assign')
  @ApiOperation({ summary: '为角色分配权限' })
  @ApiResponse({ status: 200, description: '分配成功' })
  @ApiParam({ name: 'roleId', description: '角色ID' })
  async assignPermissionsToRole(
    @Param('roleId') roleId: string,
    @Body() body: { permissionIds: string[]; createdBy?: string },
  ) {
    const result = await this.rolePermissionService.assignPermissionsToRole(
      roleId,
      body.permissionIds,
      body.createdBy,
    );
    return Result.success(result, '权限分配成功');
  }
}
