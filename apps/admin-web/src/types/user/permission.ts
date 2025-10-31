import type {
  CreatePermissionDto,
  PermissionQuery,
  UpdatePermissionDto,
} from './dto/permission.dto';

export interface Permission {
  id: bigint;
  parentId: bigint;
  name: string;
  code: string;
  type: PermissionType;
  path?: string;
  component?: string;
  icon?: string;
  method?: string;
  apiPath?: string;
  sort: number;
  status: PermissionStatus;
  isSystem: IsSystemFlag;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  // Relations
  parent?: Permission | null;
  children?: Permission[];
}

export enum PermissionType {
  MENU = 1, // 菜单
  BUTTON = 2, // 按钮
  API = 3, // 接口
}

export enum PermissionStatus {
  DISABLED = 0, // 禁用
  ENABLED = 1, // 启用
}

export enum IsSystemFlag {
  NO = 0, // 否
  YES = 1, // 是
}

// Re-export DTO types for convenience
export type { CreatePermissionDto, UpdatePermissionDto, PermissionQuery };

// Permission tree node (for hierarchical display)
export interface PermissionTreeNode extends Permission {
  children?: PermissionTreeNode[];
  level?: number;
  expanded?: boolean;
}

// Permission menu item (for navigation)
export interface PermissionMenuItem {
  id: bigint;
  name: string;
  code: string;
  path?: string;
  component?: string;
  icon?: string;
  sort: number;
  children?: PermissionMenuItem[];
}

// API permission (for access control)
export interface ApiPermission {
  id: bigint;
  code: string;
  method?: string;
  apiPath?: string;
  description?: string;
}

// Button permission (for UI element control)
export interface ButtonPermission {
  id: bigint;
  name: string;
  code: string;
  description?: string;
}
