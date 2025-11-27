import type { QueryPage } from '@packages/share';
import type { RolePermission } from '../role-permission';

export type RolePermissionQuery = QueryPage<RolePermission>;

export interface AssignPermissionsToRoleDto {
  roleId: string;
  permissionIds: string[];
  createdBy?: string;
}
