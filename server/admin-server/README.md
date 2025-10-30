# 权限管理模块

基于 NestJS + Prisma 实现的权限管理 CRUD 功能。

## 功能特性

- ✅ 完整的 CRUD 操作
- ✅ 树形结构权限管理
- ✅ 软删除
- ✅ 数据验证
- ✅ API 文档支持
- ✅ 分页查询
- ✅ 条件筛选

## API 接口

### 1. 创建权限
```
POST /permission/create
```

请求体示例：
```json
{
  "name": "订单管理",
  "code": "order:manage",
  "type": 1,
  "parentId": 0,
  "path": "/orders",
  "component": "OrderManage",
  "icon": "ShoppingOutlined",
  "sort": 1,
  "status": 1,
  "description": "订单管理模块"
}
```

### 2. 获取权限列表
```
POST /permission/page
```

请求体：
```json
{
  "page": 1,
  "limit": 10,
  "name": "用户",
  "code": "user",
  "type": 1,
  "status": 1,
  "parentId": 0
}
```

查询参数：
- `page`: 页码（默认 1）
- `limit`: 每页数量（默认 10）
- `name`: 权限名称（模糊搜索）
- `code`: 权限编码（模糊搜索）
- `type`: 权限类型（1-菜单，2-按钮，3-接口）
- `status`: 状态（0-禁用，1-启用）
- `parentId`: 父权限ID

### 3. 获取权限树
```
GET /permission/tree
```

返回树形结构的权限数据。

### 4. 获取单个权限
```
GET /permission/:id
```

### 5. 更新权限
```
PATCH /permission/:id
```

### 6. 删除权限
```
DELETE /permission/:id
```

## 权限类型说明

- **1 - 菜单**: 前端路由菜单
- **2 - 按钮**: 页面操作按钮
- **3 - 接口**: 后端 API 接口

## 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BigInt | 主键 |
| parentId | BigInt | 父权限ID（0表示顶级） |
| name | String | 权限名称 |
| code | String | 权限编码（唯一） |
| type | Int | 权限类型 |
| path | String? | 路由路径（菜单类型） |
| component | String? | 组件路径（菜单类型） |
| icon | String? | 图标（菜单类型） |
| method | String? | HTTP方法（接口类型） |
| apiPath | String? | API路径（接口类型） |
| sort | Int | 排序 |
| status | Int | 状态（0-禁用，1-启用） |
| isSystem | Int | 是否系统权限（0-否，1-是） |
| description | String? | 权限描述 |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |
| deletedAt | DateTime? | 删除时间（软删除） |

## 业务规则

1. 权限编码必须唯一
2. 系统权限（isSystem=1）不能修改和删除
3. 存在子权限的权限不能删除
4. 不能将自己设为父权限
5. 支持软删除

## 测试

打开 `test-permission.html` 文件在浏览器中测试所有 API 接口。

## 数据库初始化

运行 `scripts/init-db.sql` 创建数据库表和初始数据。

## 注意事项

1. 本示例使用 Prisma 本地开发服务器
2. 生产环境请配置正确的数据库连接
3. API 使用字符串 ID，服务端自动转换为 BigInt

4. 生成增删查改模块

```
cd ./src/modules && nest g res {模块名}
```