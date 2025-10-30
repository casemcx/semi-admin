-- 创建扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 创建数据库（如果不存在）
-- CREATE DATABASE IF NOT EXISTS admin_server_dev;

-- 切换到应用数据库
-- \c admin_server_dev;

-- 创建初始表结构（可选，Prisma会自动创建）
-- 这里只是示例，实际使用时 Prisma migrate 会处理

-- 创建用户表
-- CREATE TABLE IF NOT EXISTS "user" (
--   id BIGSERIAL PRIMARY KEY,
--   username VARCHAR(50) UNIQUE NOT NULL,
--   password VARCHAR(255) NOT NULL,
--   email VARCHAR(100) UNIQUE,
--   phone VARCHAR(20),
--   nickname VARCHAR(50),
--   avatar VARCHAR(255),
--   status SMALLINT DEFAULT 1,
--   last_login_time TIMESTAMP,
--   last_login_ip VARCHAR(50),
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   deleted_at TIMESTAMP
-- );

-- 创建权限表
-- CREATE TABLE IF NOT EXISTS "permission" (
--   id BIGSERIAL PRIMARY KEY,
--   parent_id BIGINT DEFAULT 0,
--   name VARCHAR(50) NOT NULL,
--   code VARCHAR(100) UNIQUE NOT NULL,
--   type INTEGER NOT NULL,
--   path VARCHAR(255),
--   component VARCHAR(255),
--   icon VARCHAR(100),
--   method VARCHAR(10),
--   api_path VARCHAR(255),
--   sort INTEGER DEFAULT 0,
--   status INTEGER DEFAULT 1,
--   is_system INTEGER DEFAULT 0,
--   description VARCHAR(255),
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   deleted_at TIMESTAMP
-- );

-- 插入示例权限数据
INSERT INTO "permission" ("id", "parent_id", "name", "code", "type", "path", "component", "icon", "sort", "is_system", "description") VALUES
(1, 0, '系统管理', 'system:manage', 1, '/system', 'SystemManage', 'SettingOutlined', 1, 1, '系统管理模块'),
(2, 1, '用户管理', 'user:manage', 1, '/system/user', 'UserManage', 'UserOutlined', 1, 1, '用户管理'),
(3, 2, '新增用户', 'user:add', 2, NULL, NULL, NULL, 1, 1, '新增用户'),
(4, 2, '编辑用户', 'user:edit', 2, NULL, NULL, NULL, 2, 1, '编辑用户'),
(5, 2, '删除用户', 'user:delete', 2, NULL, NULL, NULL, 3, 1, '删除用户'),
(6, 2, '查看用户', 'user:view', 2, NULL, NULL, NULL, 4, 1, '查看用户'),
(7, 1, '角色管理', 'role:manage', 1, '/system/role', 'RoleManage', 'TeamOutlined', 2, 1, '角色管理'),
(8, 7, '新增角色', 'role:add', 2, NULL, NULL, NULL, 1, 1, '新增角色'),
(9, 7, '编辑角色', 'role:edit', 2, NULL, NULL, NULL, 2, 1, '编辑角色'),
(10, 7, '删除角色', 'role:delete', 2, NULL, NULL, NULL, 3, 1, '删除角色'),
(11, 7, '查看角色', 'role:view', 2, NULL, NULL, NULL, 4, 1, '查看角色'),
(12, 1, '权限管理', 'permission:manage', 1, '/system/permission', 'PermissionManage', 'SafetyCertificateOutlined', 3, 1, '权限管理'),
(13, 12, '新增权限', 'permission:add', 2, NULL, NULL, NULL, 1, 1, '新增权限'),
(14, 12, '编辑权限', 'permission:edit', 2, NULL, NULL, NULL, 2, 1, '编辑权限'),
(15, 12, '删除权限', 'permission:delete', 2, NULL, NULL, NULL, 3, 1, '删除权限'),
(16, 12, '查看权限', 'permission:view', 2, NULL, NULL, NULL, 4, 1, '查看权限');

-- 创建索引
CREATE INDEX IF NOT EXISTS "idx_user_username" ON "user"("username");
CREATE INDEX IF NOT EXISTS "idx_user_email" ON "user"("email");
CREATE INDEX IF NOT EXISTS "idx_user_status" ON "user"("status");
CREATE INDEX IF NOT EXISTS "idx_permission_parent_id" ON "permission"("parent_id");
CREATE INDEX IF NOT EXISTS "idx_permission_type" ON "permission"("type");
CREATE INDEX IF NOT EXISTS "idx_permission_code" ON "permission"("code");

-- 输出完成信息
DO $$
BEGIN
  RAISE NOTICE '==========================================';
  RAISE NOTICE '数据库初始化完成！';
  RAISE NOTICE '数据库: admin_server_dev';
  RAISE NOTICE '用户: postgres';
  RAISE NOTICE '密码: postgres123';
  RAISE NOTICE '端口: 5432';
  RAISE NOTICE '==========================================';
END $$;