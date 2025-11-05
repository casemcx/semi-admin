import { DataSource, DataSourceOptions } from 'typeorm';
import 'dotenv/config';

// 数据库配置
export const dbConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'postgres',
  logging: process.env.NODE_ENV === 'development',
};

// 该对象 typeorm cli 迁移时使用
const ormConfigForCli: DataSourceOptions = {
  ...dbConfig,
  entities: ['src/**/*.entity{.js,.ts}'],
  migrations: ['migrations/*{.js,.ts}'],
  logging: true,
};

// 实例化dataSource，用以之后cli使用
const dataSource = new DataSource(ormConfigForCli);

// 此处的dataSource需要 export default才可以使用
export default dataSource;
