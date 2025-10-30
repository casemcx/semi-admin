# Docker 开发环境

## 快速启动

### 1. 启动 PostgreSQL 数据库
```bash
cd docker
docker-compose -f docker-compose.dev.yml up -d postgres
```

### 2. 查看日志
```bash
docker-compose -f docker-compose.dev.yml logs -f postgres
```

### 3. 停止服务
```bash
docker-compose -f docker-compose.dev.yml down
```

### 4. 重启服务
```bash
docker-compose -f docker-compose.dev.yml restart postgres
```

## 数据库连接信息

- **Host**: localhost
- **Port**: 5432
- **Database**: admin_server_dev
- **Username**: postgres
- **Password**: postgres123

## 使用说明

1. 首次启动时，会自动执行 `init-db.sql` 初始化脚本
2. 数据持久化在 Docker volume `postgres_data` 中
3. 停止容器不会丢失数据

## 配置应用连接

复制 `.env.example` 到项目根目录的 `.env`：

```bash
cp docker/.env.example ../.env
```

然后更新 `.env` 文件中的数据库连接配置。

## 连接数据库

使用 psql 连接：
```bash
psql -h localhost -p 5432 -U postgres -d admin_server_dev
```

使用 GUI 工具（如 DBeaver、TablePlus、pgAdmin）：
- Host: localhost
- Port: 5432
- Database: admin_server_dev
- Username: postgres
- Password: postgres123

## 清理数据

如果需要完全重置数据库：
```bash
# 停止并删除容器
docker-compose -f docker-compose.dev.yml down

# 删除数据卷（会丢失所有数据）
docker volume rm admin-server-postgres_data

# 重新启动
docker-compose -f docker-compose.dev.yml up -d postgres
```

## 故障排除

### 端口冲突
如果 5432 端口已被占用，修改 `docker-compose.dev.yml` 中的端口映射：
```yaml
ports:
  - "5433:5432"  # 使用 5433 端口
```

### 连接问题
1. 确保 PostgreSQL 容器正在运行
2. 检查端口是否正确
3. 确认防火墙设置
4. 查看容器日志排查错误