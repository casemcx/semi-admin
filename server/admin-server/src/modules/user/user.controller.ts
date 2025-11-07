import { Result, ResultPage } from '@/models/common';
import {
  CreateUserDto,
  QueryUserDto,
  UpdateUserDto,
  User,
} from '@/models/user';
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
import { UserService } from './user.service';

@ApiTags('用户管理')
@Controller('user')
@UsePipes(new ValidationPipe({ transform: true }))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  @ApiOperation({ summary: '创建用户' })
  @ApiResponse({ status: 201, description: '用户创建成功', type: Result })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  async create(@Body() createUserDto: CreateUserDto) {
    const result = await this.userService.create(createUserDto);
    return Result.success(result, '用户创建成功');
  }

  @Post('findPage')
  @ApiOperation({ summary: '获取用户列表' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: Result<ResultPage<User>>,
  })
  @ApiBody({ type: QueryUserDto })
  async findPage(@Body() query: QueryUserDto) {
    const resultPage = await this.userService.findPage(query);
    return Result.page(resultPage, '查询成功');
  }

  @Get(':id')
  @ApiOperation({ summary: '获取用户详情' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: Result<User>,
  })
  @ApiResponse({ status: 404, description: '用户不存在' })
  @ApiParam({ name: 'id', description: '用户ID' })
  async findById(@Param('id') id: string) {
    const result = await this.userService.findById(id);
    return Result.success(result, '查询成功');
  }

  @Post('updateById')
  @ApiOperation({ summary: '更新用户' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  @ApiBody({ type: UpdateUserDto })
  async updateById(@Body() updateUserDto: UpdateUserDto) {
    await this.userService.updateById(updateUserDto);
    return Result.success(null, '用户更新成功');
  }

  @Delete('deleteById/:id')
  @ApiOperation({ summary: '删除用户' })
  @ApiResponse({ status: 200, description: '删除成功', type: Result<void> })
  @ApiResponse({ status: 404, description: '用户不存在' })
  @ApiParam({ name: 'id', description: '用户ID' })
  async removeById(@Param('id') id: string) {
    await this.userService.removeById(id);
    return Result.success(undefined, '用户删除成功');
  }

  @Patch('updateStatus/:id')
  @ApiOperation({ summary: '更新用户状态' })
  @ApiResponse({ status: 200, description: '状态更新成功' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  @ApiParam({ name: 'id', description: '用户ID' })
  async updateStatus(@Param('id') id: string, @Query('status') status: number) {
    return this.userService.updateStatus(id, status);
  }
}
