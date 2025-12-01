-- Migration: 1762874590419
-- Description: Create permission, user, role, user_role, and role_permission tables

-- ========================================
-- 1. Create permission table
-- ========================================
CREATE TABLE "permission" (
  "id" character varying(20) NOT NULL,
  "status" integer DEFAULT 1,
  "created_at" TIMESTAMP NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
  "deleted_at" TIMESTAMP,
  "name" character varying(50) NOT NULL,
  "code" character varying(100) NOT NULL,
  "type" integer NOT NULL,
  "path" character varying(255),
  "component" character varying(255),
  "icon" character varying(100),
  "method" character varying(10),
  "apiPath" character varying(255),
  "sort" integer NOT NULL DEFAULT 0,
  "description" character varying(255),
  "parentId" character varying(20) NOT NULL DEFAULT '-1',
  CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id")
);

COMMENT ON COLUMN "permission"."id" IS 'ID';
COMMENT ON COLUMN "permission"."status" IS '状态, 0: 禁用，1: 启用';
COMMENT ON COLUMN "permission"."created_at" IS '创建时间';
COMMENT ON COLUMN "permission"."updated_at" IS '更新时间';
COMMENT ON COLUMN "permission"."deleted_at" IS '删除时间';
COMMENT ON COLUMN "permission"."name" IS '权限名称';
COMMENT ON COLUMN "permission"."code" IS '权限编码';
COMMENT ON COLUMN "permission"."type" IS '权限类型：1-菜单 2-按钮 3-接口';
COMMENT ON COLUMN "permission"."path" IS '路由路径';
COMMENT ON COLUMN "permission"."component" IS '组件路径';
COMMENT ON COLUMN "permission"."icon" IS '图标';
COMMENT ON COLUMN "permission"."method" IS '请求方法';
COMMENT ON COLUMN "permission"."apiPath" IS 'API路径';
COMMENT ON COLUMN "permission"."sort" IS '排序值';
COMMENT ON COLUMN "permission"."description" IS '权限描述';
COMMENT ON COLUMN "permission"."parentId" IS '父权限ID';

-- Create indexes on permission table
CREATE INDEX "idx_permission_sort" ON "permission" ("sort");
CREATE INDEX "idx_permission_parent_id" ON "permission" ("parentId");
CREATE INDEX "idx_permission_status" ON "permission" ("status");
CREATE INDEX "idx_permission_type" ON "permission" ("type");

-- ========================================
-- 2. Create user_role table
-- ========================================
CREATE TABLE "user_role" (
  "id" character varying(20) NOT NULL,
  "status" integer DEFAULT 1,
  "created_at" TIMESTAMP NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
  "deleted_at" TIMESTAMP,
  "userId" character varying(50) NOT NULL,
  "roleId" character varying(50) NOT NULL,
  "createdBy" character varying(50),
  CONSTRAINT "UQ_7b4e17a669299579dfa55a3fc35" UNIQUE ("userId", "roleId"),
  CONSTRAINT "PK_fb2e442d14add3cefbdf33c4561" PRIMARY KEY ("id")
);

COMMENT ON COLUMN "user_role"."id" IS 'ID';
COMMENT ON COLUMN "user_role"."status" IS '状态, 0: 禁用，1: 启用';
COMMENT ON COLUMN "user_role"."created_at" IS '创建时间';
COMMENT ON COLUMN "user_role"."updated_at" IS '更新时间';
COMMENT ON COLUMN "user_role"."deleted_at" IS '删除时间';
COMMENT ON COLUMN "user_role"."userId" IS '用户ID';
COMMENT ON COLUMN "user_role"."roleId" IS '角色ID';
COMMENT ON COLUMN "user_role"."createdBy" IS '创建人ID';

-- Create indexes on user_role table
CREATE INDEX "idx_user_role_role_id" ON "user_role" ("roleId");
CREATE INDEX "idx_user_role_user_id" ON "user_role" ("userId");

-- ========================================
-- 3. Create role table
-- ========================================
CREATE TABLE "role" (
  "id" character varying(20) NOT NULL,
  "status" integer DEFAULT 1,
  "created_at" TIMESTAMP NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
  "deleted_at" TIMESTAMP,
  "name" character varying(50) NOT NULL,
  "code" character varying(50) NOT NULL,
  "description" character varying(255),
  "sort" integer NOT NULL DEFAULT 0,
  "isSystem" smallint NOT NULL DEFAULT 0,
  CONSTRAINT "UQ_ee999bb389d7ac0fd967172c41f" UNIQUE ("code"),
  CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id")
);

COMMENT ON COLUMN "role"."id" IS 'ID';
COMMENT ON COLUMN "role"."status" IS '状态, 0: 禁用，1: 启用';
COMMENT ON COLUMN "role"."created_at" IS '创建时间';
COMMENT ON COLUMN "role"."updated_at" IS '更新时间';
COMMENT ON COLUMN "role"."deleted_at" IS '删除时间';
COMMENT ON COLUMN "role"."name" IS '角色名称';
COMMENT ON COLUMN "role"."code" IS '角色编码';
COMMENT ON COLUMN "role"."description" IS '角色描述';
COMMENT ON COLUMN "role"."sort" IS '排序（数字越小越靠前）';
COMMENT ON COLUMN "role"."isSystem" IS '是否系统角色：0-否 1-是（系统角色不可删除）';

-- Create indexes on role table
CREATE INDEX "idx_role_sort" ON "role" ("sort");
CREATE INDEX "idx_role_status" ON "role" ("status");
CREATE INDEX "idx_role_name" ON "role" ("name");

-- ========================================
-- 4. Create user table
-- ========================================
CREATE TABLE "user" (
  "id" character varying(20) NOT NULL,
  "status" integer DEFAULT 1,
  "created_at" TIMESTAMP NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
  "deleted_at" TIMESTAMP,
  "username" character varying(50) NOT NULL,
  "password" character varying(255) NOT NULL,
  "email" character varying(100),
  "phone" character varying(20),
  "nickname" character varying(50),
  "avatar" character varying(255),
  "lastLoginTime" TIMESTAMP,
  "lastLoginIp" character varying(50),
  CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"),
  CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
  CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
);

COMMENT ON COLUMN "user"."id" IS 'ID';
COMMENT ON COLUMN "user"."status" IS '状态, 0: 禁用，1: 启用';
COMMENT ON COLUMN "user"."created_at" IS '创建时间';
COMMENT ON COLUMN "user"."updated_at" IS '更新时间';
COMMENT ON COLUMN "user"."deleted_at" IS '删除时间';
COMMENT ON COLUMN "user"."username" IS '用户名';
COMMENT ON COLUMN "user"."password" IS '密码（加密存储）';
COMMENT ON COLUMN "user"."email" IS '邮箱';
COMMENT ON COLUMN "user"."phone" IS '手机号';
COMMENT ON COLUMN "user"."nickname" IS '昵称';
COMMENT ON COLUMN "user"."avatar" IS '头像URL';
COMMENT ON COLUMN "user"."lastLoginTime" IS '最后登录时间';
COMMENT ON COLUMN "user"."lastLoginIp" IS '最后登录IP';

-- Create indexes on user table
CREATE INDEX "idx_user_created_at" ON "user" ("created_at");
CREATE INDEX "idx_user_phone" ON "user" ("phone");
CREATE INDEX "idx_user_status" ON "user" ("status");

-- ========================================
-- 5. Create role_permission table
-- ========================================
CREATE TABLE "role_permission" (
  "id" character varying(20) NOT NULL,
  "status" integer DEFAULT 1,
  "created_at" TIMESTAMP NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
  "deleted_at" TIMESTAMP,
  "roleId" character varying(50) NOT NULL,
  "permissionId" character varying(50) NOT NULL,
  "createdBy" character varying(50),
  CONSTRAINT "UQ_b42bbacb8402c353df822432544" UNIQUE ("roleId", "permissionId"),
  CONSTRAINT "PK_96c8f1fd25538d3692024115b47" PRIMARY KEY ("id")
);

COMMENT ON COLUMN "role_permission"."id" IS 'ID';
COMMENT ON COLUMN "role_permission"."status" IS '状态, 0: 禁用，1: 启用';
COMMENT ON COLUMN "role_permission"."created_at" IS '创建时间';
COMMENT ON COLUMN "role_permission"."updated_at" IS '更新时间';
COMMENT ON COLUMN "role_permission"."deleted_at" IS '删除时间';
COMMENT ON COLUMN "role_permission"."roleId" IS '角色ID';
COMMENT ON COLUMN "role_permission"."permissionId" IS '权限ID';
COMMENT ON COLUMN "role_permission"."createdBy" IS '创建人ID';

-- Create indexes on role_permission table
CREATE INDEX "idx_role_permission_permission_id" ON "role_permission" ("permissionId");
CREATE INDEX "idx_role_permission_role_id" ON "role_permission" ("roleId");
