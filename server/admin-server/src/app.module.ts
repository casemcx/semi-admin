import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './common';
import { ServiceModule } from './modules';
import { PrismaModule } from './services/prisma';

@Module({
  imports: [ServiceModule, PrismaModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
