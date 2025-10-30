import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';

@Module({
  imports: [PrismaModule],
  providers: [PermissionService],
  controllers: [PermissionController],
})
export class PermissionModule {}
