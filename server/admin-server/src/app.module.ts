import { Module } from '@nestjs/common';
import { ServiceModule } from './modules';
import { PrismaModule } from './services/prisma';

@Module({
  imports: [ServiceModule, PrismaModule],
})
export class AppModule {}
