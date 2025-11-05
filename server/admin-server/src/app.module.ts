import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErrorInterceptor, ResponseInterceptor } from './common';
import { dbConfig } from './config/db';
import { ServiceModule } from './modules';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...dbConfig,
      entities: ['dist/**/*.entity{.js,.ts}'],
      autoLoadEntities: true,
    }),
    ServiceModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
