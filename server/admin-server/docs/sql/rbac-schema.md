# RBAC 五表鉴权系统设计文档

## 概述

本文档描述了一个基于 RBAC (Role-Based Access Control) 的五表鉴权系统设计，包含用户表、角色表、权限表、用户角色关联表和角色权限关联表。

## 系统架构

```
┌─────────┐       ┌──────────────┐       ┌─────────┐
│  User   │──────▶│  UserRole    │◀──────│  Role   │
│  用户表  │       │ 用户角色关联表 │       │  角色表  │
└─────────┘       └──────────────┘       └─────────┘
                                              │
                                              │
                                              ▼
                                      ┌──────────────┐
                                      │  RolePermission│
                                      │ 角色权限关联表 │
                                      └──────────────┘
                                              │
                                              │
                                              ▼
                                         ┌─────────┐
                                         │Permission│
                                         │  权限表   │
                                         └─────────┘
```

## 表结构设计

### 1. 用户表 (user)

存储系统用户的基本信息。

```sql
CREATE TABLE `user` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` VARCHAR(50) NOT NULL COMMENT '用户名',
  `password` VARCHAR(255) NOT NULL COMMENT '密码（加密存储）',
  `email` VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
  `phone` VARCHAR(20) DEFAULT NULL COMMENT '手机号',
  `nickname` VARCHAR(50) DEFAULT NULL COMMENT '昵称',
  `avatar` VARCHAR(255) DEFAULT NULL COMMENT '头像URL',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态：0-禁用 1-启用',
  `last_login_time` DATETIME DEFAULT NULL COMMENT '最后登录时间',
  `last_login_ip` VARCHAR(50) DEFAULT NULL COMMENT '最后登录IP',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` DATETIME DEFAULT NULL COMMENT '删除时间（软删除）',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  UNIQUE KEY `uk_email` (`email`),
  KEY `idx_phone` (`phone`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';
```

**字段说明：**

- `id`: 主键，用户唯一标识
- `username`: 用户名，唯一，用于登录
- `password`: 密码，需使用 bcrypt 或 argon2 等安全算法加密
- `email`: 邮箱，唯一，可用于找回密码
- `phone`: 手机号，可用于短信验证
- `nickname`: 昵称，用于显示
- `avatar`: 头像URL
- `status`: 账号状态，支持禁用功能
- `last_login_time`: 记录最后登录时间
- `last_login_ip`: 记录最后登录IP，用于安全审计
- `deleted_at`: 软删除字段

### 2. 角色表 (role)

定义系统中的角色，角色是权限的集合。

```sql
CREATE TABLE `role` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '角色ID',
  `name` VARCHAR(50) NOT NULL COMMENT '角色名称',
  `code` VARCHAR(50) NOT NULL COMMENT '角色编码',
  `description` VARCHAR(255) DEFAULT NULL COMMENT '角色描述',
  `sort` INT NOT NULL DEFAULT 0 COMMENT '排序（数字越小越靠前）',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态：0-禁用 1-启用',
  `is_system` TINYINT NOT NULL DEFAULT 0 COMMENT '是否系统角色：0-否 1-是（系统角色不可删除）',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` DATETIME DEFAULT NULL COMMENT '删除时间（软删除）',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`),
  KEY `idx_name` (`name`),
  KEY `idx_status` (`status`),
  KEY `idx_sort` (`sort`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色表';
```

**字段说明：**

- `id`: 主键，角色唯一标识
- `name`: 角色名称，如"管理员"、"普通用户"
- `code`: 角色编码，唯一，如"ADMIN"、"USER"，用于程序中判断
- `description`: 角色描述，说明该角色的用途
- `sort`: 排序字段，用于前端显示时的排序
- `status`: 角色状态，可禁用某个角色
- `is_system`: 标识系统预置角色，防止误删
- `deleted_at`: 软删除字段

**常见角色示例：**

```sql
INSERT INTO `role` (`name`, `code`, `description`, `sort`, `is_system`) VALUES
('超级管理员', 'SUPER_ADMIN', '拥有系统所有权限', 1, 1),
('管理员', 'ADMIN', '拥有大部分管理权限', 2, 1),
('普通用户', 'USER', '普通用户权限', 3, 1),
('访客', 'GUEST', '只读权限', 4, 1);
```

### 3. 权限表 (permission)

定义系统中的所有权限点。

```sql
CREATE TABLE `permission` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '权限ID',
  `parent_id` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '父权限ID（0表示顶级权限）',
  `name` VARCHAR(50) NOT NULL COMMENT '权限名称',
  `code` VARCHAR(100) NOT NULL COMMENT '权限编码',
  `type` TINYINT NOT NULL COMMENT '权限类型：1-菜单 2-按钮 3-接口',
  `path` VARCHAR(255) DEFAULT NULL COMMENT '路由路径（菜单类型）',
  `component` VARCHAR(255) DEFAULT NULL COMMENT '组件路径（菜单类型）',
  `icon` VARCHAR(100) DEFAULT NULL COMMENT '图标（菜单类型）',
  `method` VARCHAR(10) DEFAULT NULL COMMENT 'HTTP方法（接口类型）',
  `api_path` VARCHAR(255) DEFAULT NULL COMMENT 'API路径（接口类型）',
  `sort` INT NOT NULL DEFAULT 0 COMMENT '排序（数字越小越靠前）',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态：0-禁用 1-启用',
  `is_system` TINYINT NOT NULL DEFAULT 0 COMMENT '是否系统权限：0-否 1-是',
  `description` VARCHAR(255) DEFAULT NULL COMMENT '权限描述',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` DATETIME DEFAULT NULL COMMENT '删除时间（软删除）',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`),
  KEY `idx_parent_id` (`parent_id`),
  KEY `idx_type` (`type`),
  KEY `idx_status` (`status`),
  KEY `idx_sort` (`sort`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='权限表';
```

**字段说明：**

- `id`: 主键，权限唯一标识
- `parent_id`: 父权限ID，用于构建权限树结构
- `name`: 权限名称，如"用户管理"、"新增用户"
- `code`: 权限编码，唯一，如"user:manage"、"user:add"
- `type`: 权限类型
  - 1: 菜单（前端路由菜单）
  - 2: 按钮（页面内的操作按钮）
  - 3: 接口（后端API接口）
- `path`: 前端路由路径，菜单类型时使用
- `component`: 前端组件路径，菜单类型时使用
- `icon`: 菜单图标，菜单类型时使用
- `method`: HTTP方法（GET/POST/PUT/DELETE等），接口类型时使用
- `api_path`: API路径，接口类型时使用
- `sort`: 排序字段
- `status`: 权限状态
- `is_system`: 系统权限标识
- `description`: 权限描述

**权限示例：**

```sql
-- 用户管理菜单
INSERT INTO `permission` (`parent_id`, `name`, `code`, `type`, `path`, `component`, `icon`, `sort`) VALUES
(0, '用户管理', 'user:manage', 1, '/user', 'UserManage', 'user', 1);

-- 用户管理下的按钮权限
INSERT INTO `permission` (`parent_id`, `name`, `code`, `type`, `sort`) VALUES
(1, '新增用户', 'user:add', 2, 1),
(1, '编辑用户', 'user:edit', 2, 2),
(1, '删除用户', 'user:delete', 2, 3),
(1, '查看用户', 'user:view', 2, 4);

-- 用户管理相关的接口权限
INSERT INTO `permission` (`parent_id`, `name`, `code`, `type`, `method`, `api_path`, `sort`) VALUES
(1, '获取用户列表', 'user:list:api', 3, 'GET', '/api/users', 1),
(1, '创建用户', 'user:create:api', 3, 'POST', '/api/users', 2),
(1, '更新用户', 'user:update:api', 3, 'PUT', '/api/users/:id', 3),
(1, '删除用户', 'user:delete:api', 3, 'DELETE', '/api/users/:id', 4);
```

### 4. 用户角色关联表 (user_role)

建立用户和角色之间的多对多关系。

```sql
CREATE TABLE `user_role` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `role_id` BIGINT UNSIGNED NOT NULL COMMENT '角色ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `created_by` BIGINT UNSIGNED DEFAULT NULL COMMENT '创建人ID',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_role` (`user_id`, `role_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_role_id` (`role_id`),
  CONSTRAINT `fk_user_role_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_role_role` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户角色关联表';
```

**字段说明：**

- `id`: 主键
- `user_id`: 用户ID，外键关联用户表
- `role_id`: 角色ID，外键关联角色表
- `created_at`: 创建时间，记录授权时间
- `created_by`: 创建人ID，记录是谁给用户分配的角色

**索引说明：**

- `uk_user_role`: 唯一索引，防止重复授权
- `idx_user_id`: 用于快速查询某个用户的所有角色
- `idx_role_id`: 用于快速查询拥有某个角色的所有用户

### 5. 角色权限关联表 (role_permission)

建立角色和权限之间的多对多关系。

```sql
CREATE TABLE `role_permission` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `role_id` BIGINT UNSIGNED NOT NULL COMMENT '角色ID',
  `permission_id` BIGINT UNSIGNED NOT NULL COMMENT '权限ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `created_by` BIGINT UNSIGNED DEFAULT NULL COMMENT '创建人ID',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_permission` (`role_id`, `permission_id`),
  KEY `idx_role_id` (`role_id`),
  KEY `idx_permission_id` (`permission_id`),
  CONSTRAINT `fk_role_permission_role` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_role_permission_permission` FOREIGN KEY (`permission_id`) REFERENCES `permission` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色权限关联表';
```

**字段说明：**

- `id`: 主键
- `role_id`: 角色ID，外键关联角色表
- `permission_id`: 权限ID，外键关联权限表
- `created_at`: 创建时间，记录授权时间
- `created_by`: 创建人ID，记录是谁给角色分配的权限

**索引说明：**

- `uk_role_permission`: 唯一索引，防止重复授权
- `idx_role_id`: 用于快速查询某个角色的所有权限
- `idx_permission_id`: 用于快速查询哪些角色拥有某个权限

## 常用查询示例

### 1. 查询用户的所有角色

```sql
SELECT r.*
FROM role r
INNER JOIN user_role ur ON r.id = ur.role_id
WHERE ur.user_id = ? AND r.status = 1 AND r.deleted_at IS NULL;
```

### 2. 查询用户的所有权限（去重）

```sql
SELECT DISTINCT p.*
FROM permission p
INNER JOIN role_permission rp ON p.id = rp.permission_id
INNER JOIN user_role ur ON rp.role_id = ur.role_id
WHERE ur.user_id = ? AND p.status = 1 AND p.deleted_at IS NULL;
```

### 3. 查询用户的菜单权限（树形结构）

```sql
-- 先查询所有菜单权限
SELECT DISTINCT p.*
FROM permission p
INNER JOIN role_permission rp ON p.id = rp.permission_id
INNER JOIN user_role ur ON rp.role_id = ur.role_id
WHERE ur.user_id = ?
  AND p.type = 1
  AND p.status = 1
  AND p.deleted_at IS NULL
ORDER BY p.sort ASC;
```

### 4. 检查用户是否有某个权限

```sql
SELECT COUNT(*) > 0 as has_permission
FROM permission p
INNER JOIN role_permission rp ON p.id = rp.permission_id
INNER JOIN user_role ur ON rp.role_id = ur.role_id
WHERE ur.user_id = ?
  AND p.code = ?
  AND p.status = 1
  AND p.deleted_at IS NULL;
```

### 5. 查询角色的所有权限

```sql
SELECT p.*
FROM permission p
INNER JOIN role_permission rp ON p.id = rp.permission_id
WHERE rp.role_id = ? AND p.status = 1 AND p.deleted_at IS NULL
ORDER BY p.sort ASC;
```

### 6. 查询拥有某个角色的所有用户

```sql
SELECT u.*
FROM user u
INNER JOIN user_role ur ON u.id = ur.user_id
WHERE ur.role_id = ? AND u.status = 1 AND u.deleted_at IS NULL;
```

## 业务逻辑说明

### 1. 用户授权流程

1. 创建用户
2. 为用户分配一个或多个角色（插入 `user_role` 表）
3. 用户登录时，查询其所有角色
4. 根据角色查询所有权限
5. 将权限信息存入 JWT Token 或 Session

### 2. 权限验证流程

**前端权限验证：**

1. 用户登录后获取权限列表
2. 根据权限列表动态生成菜单
3. 根据按钮权限控制按钮显示/隐藏

**后端权限验证：**

1. 从请求中获取用户信息（JWT/Session）
2. 根据请求的 API 路径和方法，查询对应的权限
3. 验证用户是否拥有该权限
4. 允许或拒绝请求

### 3. 角色权限管理

**分配权限给角色：**

```javascript
// 批量分配权限
async function assignPermissionsToRole(roleId, permissionIds) {
  // 1. 删除旧的权限关联
  await db.query('DELETE FROM role_permission WHERE role_id = ?', [roleId]);

  // 2. 批量插入新的权限关联
  const values = permissionIds.map(pid => [roleId, pid, currentUserId]);
  await db.query(
    'INSERT INTO role_permission (role_id, permission_id, created_by) VALUES ?',
    [values]
  );
}
```

**分配角色给用户：**

```javascript
// 批量分配角色
async function assignRolesToUser(userId, roleIds) {
  // 1. 删除旧的角色关联
  await db.query('DELETE FROM user_role WHERE user_id = ?', [userId]);

  // 2. 批量插入新的角色关联
  const values = roleIds.map(rid => [userId, rid, currentUserId]);
  await db.query(
    'INSERT INTO user_role (user_id, role_id, created_by) VALUES ?',
    [values]
  );
}
```

## 权限设计最佳实践

### 1. 权限粒度

- **粗粒度**：模块级别（如：用户管理、订单管理）
- **细粒度**：操作级别（如：添加用户、删除用户）
- 建议：根据实际业务需求选择合适的粒度，过细会增加管理复杂度

### 2. 权限编码规范

建议使用 `资源:操作` 的格式：

- `user:add` - 添加用户
- `user:edit` - 编辑用户
- `user:delete` - 删除用户
- `user:view` - 查看用户
- `order:manage` - 订单管理

### 3. 数据权限

五表设计主要解决功能权限，如需数据权限（如只能看自己部门的数据），可以：

1. 在权限表中增加 `data_scope` 字段
2. 新增数据权限规则表
3. 在业务查询时添加数据过滤条件

### 4. 缓存策略

权限信息查询频繁，建议使用缓存：

```javascript
// 用户权限缓存 Key
const USER_PERMISSIONS_KEY = `user:permissions:${userId}`;

// 缓存用户权限，TTL 30分钟
await redis.setex(USER_PERMISSIONS_KEY, 1800, JSON.stringify(permissions));
```

### 5. 安全建议

1. **密码安全**：使用 bcrypt 或 argon2 加密密码
2. **软删除**：重要数据使用软删除，便于审计和恢复
3. **操作日志**：记录关键操作（授权、权限变更等）
4. **定期清理**：定期清理无效的关联关系
5. **权限校验**：前后端双重校验，前端控制显示，后端控制执行

## 扩展设计

### 1. 用户组（可选）

如果需要用户组功能，可以在用户和角色之间增加一层：

```
User -> UserGroup -> Role -> Permission
```

### 2. 动态数据权限

增加数据权限规则表：

```sql
CREATE TABLE `data_permission` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `role_id` BIGINT UNSIGNED NOT NULL,
  `resource_type` VARCHAR(50) NOT NULL COMMENT '资源类型',
  `scope_type` TINYINT NOT NULL COMMENT '范围类型：1-全部 2-部门 3-个人',
  `scope_value` VARCHAR(255) DEFAULT NULL COMMENT '范围值',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3. 权限继承

如果需要权限继承（子角色继承父角色的权限），在角色表中增加 `parent_id` 字段。

## 总结

这个五表设计方案具有以下优点：

1. **灵活性强**：支持一个用户多个角色，一个角色多个权限
2. **易于扩展**：可以方便地添加新的权限和角色
3. **维护简单**：通过关联表管理权限，修改角色权限不影响其他数据
4. **性能良好**：合理的索引设计保证查询效率
5. **安全可靠**：支持软删除、状态控制等安全特性

根据实际业务需求，可以在此基础上进行适当的调整和扩展。
