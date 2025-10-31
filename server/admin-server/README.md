# Admin Server

## dev开发

### 1. 启动中间件

```bash
docker-compose -f docker/docker-compose.dev.yml up -d
```

### 2. 初始化信息

```bash
sh ./scripts/prisma.sh migrate init-db
```

```bash
pnpm dev
```

## 生产环境

```bash
pnpm build
```
