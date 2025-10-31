import type {
  IsSystemFlag,
  PermissionStatus,
  PermissionType,
} from '../permission';

/**
 * 创建权限数据传输对象
 */
export interface CreatePermissionDto {
  /** 父权限ID，0表示顶级权限 */
  parentId?: bigint;
  /** 权限名称 */
  name: string;
  /** 权限编码，唯一标识 */
  code: string;
  /** 权限类型：1-菜单 2-按钮 3-接口 */
  type: PermissionType;
  /** 菜单路径，菜单类型时使用 */
  path?: string;
  /** 组件路径，菜单类型时使用 */
  component?: string;
  /** 图标名称 */
  icon?: string;
  /** HTTP方法，接口类型时使用 */
  method?: string;
  /** API路径，接口类型时使用 */
  apiPath?: string;
  /** 排序序号 */
  sort?: number;
  /** 状态：0-禁用 1-启用 */
  status?: PermissionStatus;
  /** 是否系统权限：0-否 1-是 */
  isSystem?: IsSystemFlag;
  /** 权限描述 */
  description?: string;
}

/**
 * 更新权限数据传输对象
 */
export interface UpdatePermissionDto {
  /** 父权限ID，0表示顶级权限 */
  parentId?: bigint;
  /** 权限名称 */
  name?: string;
  /** 权限编码，唯一标识 */
  code?: string;
  /** 权限类型：1-菜单 2-按钮 3-接口 */
  type?: PermissionType;
  /** 菜单路径，菜单类型时使用 */
  path?: string;
  /** 组件路径，菜单类型时使用 */
  component?: string;
  /** 图标名称 */
  icon?: string;
  /** HTTP方法，接口类型时使用 */
  method?: string;
  /** API路径，接口类型时使用 */
  apiPath?: string;
  /** 排序序号 */
  sort?: number;
  /** 状态：0-禁用 1-启用 */
  status?: PermissionStatus;
  /** 是否系统权限：0-否 1-是 */
  isSystem?: IsSystemFlag;
  /** 权限描述 */
  description?: string;
}

/**
 * 权限查询参数对象
 */
export interface PermissionQuery {
  /** 权限ID */
  id?: bigint;
  /** 父权限ID */
  parentId?: bigint;
  /** 权限名称，支持模糊查询 */
  name?: string;
  /** 权限编码，支持精确查询 */
  code?: string;
  /** 权限类型 */
  type?: PermissionType;
  /** 菜单路径 */
  path?: string;
  /** 状态筛选 */
  status?: PermissionStatus;
  /** 系统权限筛选 */
  isSystem?: IsSystemFlag;
  /** 关键词搜索，支持按名称或编码搜索 */
  keyword?: string;

  /** 页码 */
  page?: number;
  /** 每页数量 */
  size?: number;
}
