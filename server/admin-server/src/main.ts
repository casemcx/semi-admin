// main.ts
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  return app;
}

const app = await bootstrap();

if (import.meta.env.PROD) {
  await app.listen(3000);
}

export const viteNodeApp = bootstrap() as any;
