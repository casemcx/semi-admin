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
    return this.userRoleService.create(createUserRoleDto);
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
    return this.userRoleService.findPage(query);
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
    return this.userRoleService.findByUserId(userId);
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
    return this.userRoleService.findByRoleId(roleId);
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
    return this.userRoleService.removeById(userId, roleId);
  }

  @Delete('user/:userId')
  @ApiOperation({ summary: '取消用户所有角色' })
  @ApiResponse({ status: 200, description: '取消成功', type: Result<void> })
  @ApiResponse({ status: 404, description: '用户没有分配任何角色' })
  @ApiParam({ name: 'userId', description: '用户ID' })
  async removeByUserId(@Param('userId') userId: string) {
    return this.userRoleService.removeByUserId(userId);
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
    return Result.success(roles);
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
    return Result.success(users);
  }
}
