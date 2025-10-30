# Swagger API 文档

## 概述

本项目集成了 Swagger/OpenAPI 3.0，自动生成交互式 API 文档。

## 访问文档

启动开发服务器后，访问：
- **API 文档**: http://localhost:3000/api-docs

## 主要功能

### 1. **API 文档浏览**
- 自动生成所有接口的文档
- 支持在线测试 API
- 清晰的请求/响应示例

### 2. **认证支持**
- Bearer Token 认证
- 在右上角点击 "Authorize" 按钮
- 输入格式：`Bearer <your-token>`

### 3. **数据模型**
- 完整的 DTO 类型定义
- 响应格式规范
- 分页响应结构

## API 响应格式

### 成功响应
```json
{
  "success": true,
  "data": { ... },
  "message": "操作成功",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 分页响应
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 错误响应
```json
{
  "success": false,
  "message": "错误信息",
  "code": 400,
  "error": "详细错误信息",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 注解说明

### Controller 级注解
- `@ApiTags()`: 标签分组
- `@ApiOperation()`: 接口描述
- `@ApiResponse()`: 响应描述

### DTO 级注解
- `@ApiProperty()`: 属性描述
- `@ApiPropertyOptional()`: 可选属性
- `@ApiPropertyRequired()`: 必需属性

### 参数注解
- `@ApiParam()`: 路径参数
- `@ApiQuery()`: 查询参数
- `@ApiBody()`: 请求体

## 权限管理 API 示例

### 1. 创建权限
```bash
POST /api/permission/create
Content-Type: application/json

{
  "name": "用户管理",
  "code": "user:manage",
  "type": 1,
  "parentId": 0,
  "path": "/users",
  "component": "UserManage",
  "icon": "UserOutlined"
}
```

### 2. 获取权限列表
```bash
POST /api/permission/findPage
Content-Type: application/json

{
  "page": 1,
  "limit": 10,
  "name": "用户",
  "type": 1
}
```

### 3. 获取权限树
```bash
GET /api/permission/tree
```

### 4. 获取单个权限
```bash
GET /api/permission/1
```

### 5. 更新权限
```bash
PATCH /api/permission/1
Content-Type: application/json

{
  "name": "更新的权限名称",
  "description": "更新后的描述"
}
```

### 6. 删除权限
```bash
DELETE /api/permission/1
```

## 最佳实践

1. **保持文档更新**
   - 每次修改 API 后重新生成文档
   - 确保 DTO 和 Controller 注解完整

2. **使用清晰的命名**
   - 接口路径要有意义
   - 参数和响应要有明确说明

3. **提供示例**
   - 为复杂参数提供示例值
   - 确保响应示例准确

4. **版本管理**
   - 重要修改时更新 API 版本
   - 保持向后兼容性

## 故障排除

### 文档未更新
1. 检查 Controller 是否有正确的注解
2. 重启开发服务器
3. 清除浏览器缓存

### 请求测试失败
1. 检查请求参数是否正确
2. 确认数据库连接正常
3. 查看控制台错误日志

### 认证失败
1. 确保 token 格式正确
2. 检查 token 是否过期
3. 验证权限配置