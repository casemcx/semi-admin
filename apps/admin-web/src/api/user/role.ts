import type {
  CreateRoleDto,
  Role,
  RoleQuery,
  UpdateRoleDto,
} from '@/types/user';
import { request } from '@/utils/request';
import type { QueryPageResult } from '@packages/share';

/**
 * @description 创建角色
 * @param data CreateRoleDto
 * @returns Role
 */
export const createRole = (data: CreateRoleDto) => {
  return request.post<Role>('/api/role/create', data);
};

/**
 * @description 获取角色列表（分页）
 * @param data RoleQuery
 * @returns ResultPage<Role>
 */
export const getRolePage = (data: RoleQuery) => {
  return request.post<QueryPageResult<Role>>('/api/role/findPage', data);
};

/**
 * @description 获取所有启用的角色
 * @returns Role[]
 */
export const getAllEnabledRoles = () => {
  return request.get<Role[]>('/api/role/all/enabled');
};

/**
 * @description 获取角色详情
 * @param id 角色ID
 * @returns Role
 */
export const getRoleById = (id: string) => {
  return request.get<Role>(`/api/role/${id}`);
};

/**
 * @description 更新角色
 * @param data UpdateRoleDto
 * @returns Role
 */
export const updateRoleById = (data: UpdateRoleDto) => {
  return request.post<Role>('/api/role/updateById', data);
};

/**
 * @description 删除角色
 * @param id 角色ID
 * @returns void
 */
export const deleteRoleById = (id: string) => {
  return request.delete<void>(`/api/role/deleteById/${id}`);
};

/**
 * @description 批量删除角色
 * @param ids 角色ID数组
 * @returns void
 */
export const deleteRoleBatch = (ids: string[]) => {
  return request.post<void>('/api/role/deleteBatch', { ids });
};
