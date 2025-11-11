import { DataSource, DataSourceOptions } from 'typeorm';
import 'dotenv/config';

// 解析 DATABASE_URL 环境变量
function parseDatabaseUrl(): DataSourceOptions {
  // 如果存在完整的 DATABASE_URL，优先使用
  if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);
    return {
      type: 'postgres' as const,
      host: url.hostname,
      port: Number(url.port) || 5432,
      username: url.username,
      password: url.password,
      database: url.pathname.slice(1), // 移除开头的 '/'
    };
  }

  // 否则使用单独的环境变量或默认值
  return {
    type: 'postgres' as const,
    host: process.env.DATABASE_HOST || '127.0.0.1',
    port: Number(process.env.DATABASE_PORT) || 5432,
    username: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres123',
    database: process.env.DATABASE_NAME || 'admin_server_dev',
  };
}

// 数据库连接配置
export const dbConfig: DataSourceOptions = {
  ...parseDatabaseUrl(),
  logging: process.env.NODE_ENV === 'development',
  // 连接池配置
  extra: {
    connectionLimit: Number(process.env.DATABASE_CONNECTION_LIMIT) || 20,
    acquireTimeout: Number(process.env.DATABASE_TIMEOUT) || 20000,
    idleTimeout: Number(process.env.DATABASE_IDLE_TIMEOUT) || 10000,
    maxLifetime: Number(process.env.DATABASE_MAX_LIFETIME) || 300000,
  },
};

// TypeORM CLI 迁移时使用的配置对象
const ormConfigForCli: DataSourceOptions = {
  ...dbConfig,
  // 实体文件路径
  entities: ['src/**/*.entity{.js,.ts}'],
  // 迁移文件路径
  migrations: ['migrations/*{.js,.ts}'],
  // CLI 模式下总是开启日志
  logging: true,
};

// 创建数据源实例，供 CLI 工具使用
const dataSource = new DataSource(ormConfigForCli);

// 导出默认数据源供 TypeORM CLI 使用
export default dataSource;
