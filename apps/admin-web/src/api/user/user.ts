import type {
  CreateUserDto,
  UpdateUserDto,
  User,
  UserQuery,
} from '@/types/user';
import { request } from '@/utils/request';
import type { QueryPageResult } from '@packages/share';

/**
 * @description 创建用户
 * @param data CreateUserDto
 * @returns User
 */
export const createUser = (data: CreateUserDto) => {
  return request.post<User>('/api/user/create', data);
};

/**
 * @description 获取用户列表（分页）
 * @param data UserQuery
 * @returns ResultPage<User>
 */
export const getUserPage = (data: UserQuery) => {
  return request.post<QueryPageResult<User>>('/api/user/findPage', data);
};

/**
 * @description 获取用户详情
 * @param id 用户ID
 * @returns User
 */
export const getUserById = (id: string) => {
  return request.get<User>(`/api/user/${id}`);
};

/**
 * @description 更新用户
 * @param data UpdateUserDto
 * @returns User
 */
export const updateUserById = (data: UpdateUserDto) => {
  return request.post<User>('/api/user/updateById', data);
};

/**
 * @description 删除用户
 * @param id 用户ID
 * @returns void
 */
export const deleteUserById = (id: string) => {
  return request.delete<void>(`/api/user/deleteById/${id}`);
};

/**
 * @description 批量删除用户
 * @param ids 用户ID数组
 * @returns void
 */
export const deleteUserBatch = (ids: string[]) => {
  return request.post<void>('/api/user/deleteBatch', { ids });
};

/**
 * @description 更新用户状态
 * @param id 用户ID
 * @param status 状态
 * @returns void
 */
export const updateUserStatus = (id: string, status: number) => {
  return request.patch<void>(
    `/api/user/updateStatus/${id}?status=${status}`,
    {},
  );
};
