import type {
  AssignRolesToUserDto,
  UserRole,
  UserRoleQuery,
} from '@/types/user';
import type { Role } from '@/types/user';
import { request } from '@/utils/request';
import type { QueryPageResult } from '@packages/share';

/**
 * @description 为用户分配角色
 * @param data AssignRolesToUserDto
 * @returns UserRole[]
 */
export const assignRolesToUser = (data: AssignRolesToUserDto) => {
  return request.post<UserRole[]>('/api/user-role/create', data);
};

/**
 * @description 获取用户角色列表（分页）
 * @param data UserRoleQuery
 * @returns ResultPage<UserRole>
 */
export const getUserRolePage = (data: UserRoleQuery) => {
  return request.post<QueryPageResult<UserRole>>(
    '/api/user-role/findPage',
    data,
  );
};

/**
 * @description 获取用户的所有角色
 * @param userId 用户ID
 * @returns Role[]
 */
export const getUserRoles = (userId: string) => {
  return request.get<Role[]>(`/api/user-role/user/${userId}`);
};

/**
 * @description 获取拥有某角色的所有用户
 * @param roleId 角色ID
 * @returns User[]
 */
export const getRoleUsers = (roleId: string) => {
  return request.get<any[]>(`/api/user-role/role/${roleId}`);
};

/**
 * @description 删除用户角色关联
 * @param userId 用户ID
 * @param roleId 角色ID
 * @returns void
 */
export const deleteUserRole = (userId: string, roleId: string) => {
  return request.delete<void>(`/api/user-role/${userId}/${roleId}`);
};
