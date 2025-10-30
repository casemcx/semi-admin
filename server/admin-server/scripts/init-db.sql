-- 创建 permission 表
CREATE TABLE IF NOT EXISTS "permission" (
  "id" BIGSERIAL PRIMARY KEY,
  "parent_id" BIGINT NOT NULL DEFAULT 0,
  "name" VARCHAR(50) NOT NULL,
  "code" VARCHAR(100) UNIQUE NOT NULL,
  "type" INTEGER NOT NULL,
  "path" VARCHAR(255),
  "component" VARCHAR(255),
  "icon" VARCHAR(100),
  "method" VARCHAR(10),
  "api_path" VARCHAR(255),
  "sort" INTEGER NOT NULL DEFAULT 0,
  "status" INTEGER NOT NULL DEFAULT 1,
  "is_system" INTEGER NOT NULL DEFAULT 0,
  "description" VARCHAR(255),
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "deleted_at" TIMESTAMP WITH TIME ZONE
);

-- 创建索引
CREATE INDEX IF NOT EXISTS "idx_permission_parent_id" ON "permission"("parent_id");
CREATE INDEX IF NOT EXISTS "idx_permission_type" ON "permission"("type");
CREATE INDEX IF NOT EXISTS "idx_permission_status" ON "permission"("status");
CREATE INDEX IF NOT EXISTS "idx_permission_sort" ON "permission"("sort");

-- 插入示例数据
INSERT INTO "permission" ("id", "parent_id", "name", "code", "type", "path", "component", "icon", "sort", "is_system") VALUES
(1, 0, '用户管理', 'user:manage', 1, '/users', 'UserManage', 'UserOutlined', 1, 1),
(2, 1, '新增用户', 'user:add', 2, NULL, NULL, NULL, 1, 1),
(3, 1, '编辑用户', 'user:edit', 2, NULL, NULL, NULL, 2, 1),
(4, 1, '删除用户', 'user:delete', 2, NULL, NULL, NULL, 3, 1),
(5, 1, '查看用户', 'user:view', 2, NULL, NULL, NULL, 4, 1),
(6, 0, '角色管理', 'role:manage', 1, '/roles', 'RoleManage', 'TeamOutlined', 2, 1),
(7, 6, '新增角色', 'role:add', 2, NULL, NULL, NULL, 1, 1),
(8, 6, '编辑角色', 'role:edit', 2, NULL, NULL, NULL, 2, 1),
(9, 6, '删除角色', 'role:delete', 2, NULL, NULL, NULL, 3, 1),
(10, 6, '查看角色', 'role:view', 2, NULL, NULL, NULL, 4, 1);