// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  return app;
}

const app = await bootstrap();

if (import.meta.env.PROD) {
  await app.listen(3000);
}

export const viteNodeApp = bootstrap();
