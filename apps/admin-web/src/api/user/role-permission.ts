import type {
  AssignPermissionsToRoleDto,
  RolePermission,
  RolePermissionQuery,
} from '@/types/user';
import type { Permission } from '@/types/user';
import { request } from '@/utils/request';
import type { QueryPageResult } from '@packages/share';

/**
 * @description 为角色分配权限
 * @param data AssignPermissionsToRoleDto
 * @returns RolePermission[]
 */
export const assignPermissionsToRole = (data: AssignPermissionsToRoleDto) => {
  return request.post<RolePermission[]>('/api/role-permission/create', data);
};

/**
 * @description 获取角色权限列表（分页）
 * @param data RolePermissionQuery
 * @returns ResultPage<RolePermission>
 */
export const getRolePermissionPage = (data: RolePermissionQuery) => {
  return request.post<QueryPageResult<RolePermission>>(
    '/api/role-permission/findPage',
    data,
  );
};

/**
 * @description 获取角色的所有权限
 * @param roleId 角色ID
 * @returns Permission[]
 */
export const getRolePermissions = (roleId: string) => {
  return request.get<Permission[]>(`/api/role-permission/role/${roleId}`);
};

/**
 * @description 获取拥有某权限的所有角色
 * @param permissionId 权限ID
 * @returns Role[]
 */
export const getPermissionRoles = (permissionId: string) => {
  return request.get<any[]>(`/api/role-permission/permission/${permissionId}`);
};

/**
 * @description 删除角色权限关联
 * @param roleId 角色ID
 * @param permissionId 权限ID
 * @returns void
 */
export const deleteRolePermission = (roleId: string, permissionId: string) => {
  return request.delete<void>(`/api/role-permission/${roleId}/${permissionId}`);
};
