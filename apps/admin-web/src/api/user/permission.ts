import type {
  CreatePermissionDto,
  Permission,
  PermissionQuery,
  UpdatePermissionDto,
} from '@/types/user';
import { request } from '@/utils/request';
import type { QueryPageResult } from '@packages/share';

/**
 * @description 创建权限
 * @param data CreatePermissionDto
 * @returns Permission
 */
export const createPermission = (data: CreatePermissionDto) => {
  return request.post<Permission>('/api/permission/create', data);
};

/**
 * @description 获取权限列表（分页）
 * @param data PermissionQuery
 * @returns ResultPage<Permission>
 */
export const getPermissionPage = (data: PermissionQuery) => {
  return request.post<QueryPageResult<Permission>>(
    '/api/permission/findPage',
    data,
  );
};

/**
 * @description 获取权限树
 * @returns Permission[]
 */
export const getPermissionTree = () => {
  return request.get<Permission[]>('/api/permission/tree');
};

/**
 * @description 获取权限详情
 * @param id 权限ID
 * @returns Permission
 */
export const getPermissionById = (id: string) => {
  return request.get<Permission>(`/api/permission/${id}`);
};

/**
 * @description 更新权限
 * @param data UpdatePermissionDto
 * @returns Permission
 */
export const updatePermissionById = (data: UpdatePermissionDto) => {
  return request.post<Permission>('/api/permission/updateById', data);
};

/**
 * @description 删除权限
 * @param id 权限ID
 * @returns void
 */
export const deletePermissionById = (id: string) => {
  return request.delete<void>(`/api/permission/deleteById/${id}`);
};

/**
 * @description 批量删除权限
 * @param ids 权限ID数组
 * @returns void
 */
export const deletePermissionBatch = (ids: string[]) => {
  return request.post<void>('/api/permission/deleteBatch', { ids });
};
