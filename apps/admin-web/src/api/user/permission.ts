import type {
  CreatePermissionDto,
  Permission,
  PermissionQuery,
  UpdatePermissionDto,
} from '@/types/user';
import { request } from '@/utils/request';

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
  return request.post<any>('/api/permission/findPage', data);
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
export const getPermissionDetail = (id: string) => {
  return request.get<Permission>(`/api/permission/${id}`);
};

/**
 * @description 更新权限
 * @param id 权限ID
 * @param data UpdatePermissionDto
 * @returns Permission
 */
export const updatePermission = (id: string, data: UpdatePermissionDto) => {
  return request.put<Permission>(`/api/permission/${id}`, data);
};

/**
 * @description 删除权限
 * @param id 权限ID
 * @returns void
 */
export const deletePermission = (id: string) => {
  return request.delete<void>(`/api/permission/${id}`);
};
