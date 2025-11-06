import { Module } from '@nestjs/common';
import { PermissionModule } from './permission/permission.module';
import { RolePermissionModule } from './role-permission/role-permission.module';
import { RoleModule } from './role/role.module';
import { UserRoleModule } from './user-role/user-role.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    PermissionModule,
    UserModule,
    RoleModule,
    UserRoleModule,
    RolePermissionModule,
  ],
})
export class ServiceModule {}
