import { config } from 'dotenv';
config(); // 加载环境变量

// Ensure JSON serialization can handle bigint values
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { ValidationPipe } from '@nestjs/common';
// main.ts
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';

import { AppModule } from './app.module';

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter();

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
  );

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true, // 只过滤不在 DTO 中的属性，但不报错
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // CORS 配置
  app.enableCors({
    origin: true, // 允许所有来源
    credentials: true,
  });

  // 注册 Fastify Swagger 插件
  await fastifyAdapter.register(fastifySwagger, {
    swagger: {
      info: {
        title: 'Admin Server API',
        description: '后台管理系统 API 文档',
        version: '1.0',
      },
      host: 'localhost:3000',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [{ name: '权限管理', description: '权限管理相关接口' }],
      securityDefinitions: {
        Bearer: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
          description: '输入 JWT token',
        },
      },
      security: [{ Bearer: [] }],
    },
  });

  // 注册 Swagger UI 插件
  await fastifyAdapter.register(fastifySwaggerUi, {
    routePrefix: '/api-docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
    },
  });

  // 设置全局前缀
  app.setGlobalPrefix('api');

  const port = Number.parseInt(process.env.PORT || '5000', 10);

  if (process.env.PROD) {
    await app.listen(port, '0.0.0.0');
    console.log(`🚀 Server is running on http://localhost:${port}`);
    console.log(`📚 API Documentation: http://localhost:${port}/api-docs`);
  }
  return app;
}

console.log(Number(process.env.PROD), 'Number(process.env.PROD)');

// 开发环境启动
if (!Number(process.env.PROD)) {
  bootstrap();
}

// 生产环境导出
export const viteNodeApp = bootstrap() as any;
