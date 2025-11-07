import { Result, ResultPage } from '@/models/common';
import {
  CreateUserRoleDto,
  QueryUserRoleDto,
  UserRole,
} from '@/models/user-role';
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
import { UserRoleService } from './user-role.service';

@ApiTags('用户角色管理')
@Controller('user-role')
@UsePipes(new ValidationPipe({ transform: true }))
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}

  @Post('create')
  @ApiOperation({ summary: '分配用户角色' })
  @ApiResponse({ status: 201, description: '角色分配成功', type: Result })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 404, description: '用户或角色不存在' })
  async create(@Body() createUserRoleDto: CreateUserRoleDto) {
    const result = await this.userRoleService.create(createUserRoleDto);
    return Result.success(result, '用户角色分配成功');
  }

  @Post('findPage')
  @ApiOperation({ summary: '获取用户角色关联列表' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: Result<ResultPage<UserRole>>,
  })
  @ApiBody({ type: QueryUserRoleDto })
  async findPage(@Body() query: QueryUserRoleDto) {
    const result = await this.userRoleService.findPage(query);
    return Result.success(result, '查询成功');
  }

  @Get('user/:userId')
  @ApiOperation({ summary: '获取用户的角色列表' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: Result<UserRole[]>,
  })
  @ApiParam({ name: 'userId', description: '用户ID' })
  async findByUserId(@Param('userId') userId: string) {
    const result = await this.userRoleService.findByUserId(userId);
    return Result.success(result, '查询成功');
  }

  @Get('role/:roleId')
  @ApiOperation({ summary: '获取角色关联的用户列表' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: Result<UserRole[]>,
  })
  @ApiParam({ name: 'roleId', description: '角色ID' })
  async findByRoleId(@Param('roleId') roleId: string) {
    const result = await this.userRoleService.findByRoleId(roleId);
    return Result.success(result, '查询成功');
  }

  @Delete('user/:userId/role/:roleId')
  @ApiOperation({ summary: '取消用户角色关联' })
  @ApiResponse({ status: 200, description: '取消成功', type: Result<void> })
  @ApiResponse({ status: 404, description: '用户角色关联不存在' })
  @ApiParam({ name: 'userId', description: '用户ID' })
  @ApiParam({ name: 'roleId', description: '角色ID' })
  async removeById(
    @Param('userId') userId: string,
    @Param('roleId') roleId: string,
  ) {
    await this.userRoleService.removeById(userId, roleId);
    return Result.success(null, '用户角色关联取消成功');
  }

  @Delete('user/:userId')
  @ApiOperation({ summary: '取消用户所有角色' })
  @ApiResponse({ status: 200, description: '取消成功', type: Result<void> })
  @ApiResponse({ status: 404, description: '用户没有分配任何角色' })
  @ApiParam({ name: 'userId', description: '用户ID' })
  async removeByUserId(@Param('userId') userId: string) {
    await this.userRoleService.removeByUserId(userId);
    return Result.success(null, '用户所有角色取消成功');
  }

  @Get('user/:userId/roles')
  @ApiOperation({ summary: '获取用户的角色信息' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
  })
  @ApiParam({ name: 'userId', description: '用户ID' })
  async getUserRoles(@Param('userId') userId: string) {
    const roles = await this.userRoleService.getUserRoles(userId);
    return Result.success(roles, '查询成功');
  }

  @Get('role/:roleId/users')
  @ApiOperation({ summary: '获取角色的用户信息' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
  })
  @ApiParam({ name: 'roleId', description: '角色ID' })
  async getRoleUsers(@Param('roleId') roleId: string) {
    const users = await this.userRoleService.getRoleUsers(roleId);
    return Result.success(users, '查询成功');
  }
}
