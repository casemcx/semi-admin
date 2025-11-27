import type { Permission } from './permission';
import type { Role } from './role';

export interface RolePermission {
  id: string;
  roleId: string;
  permissionId: string;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  role?: Role;
  permission?: Permission;
}
