import { RolePermission } from '@/models/role-permission/role-permission.entity';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionModule } from '../permission/permission.module';
import { RoleModule } from '../role/role.module';
import { RolePermissionController } from './role-permission.controller';
import { RolePermissionService } from './role-permission.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RolePermission]),
    forwardRef(() => RoleModule),
    forwardRef(() => PermissionModule),
  ],
  controllers: [RolePermissionController],
  providers: [RolePermissionService],
  exports: [RolePermissionService],
})
export class RolePermissionModule {}
