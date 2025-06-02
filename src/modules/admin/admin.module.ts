import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD, RouterModule } from '@nestjs/core';

import { PermissionGuard } from 'src/common/guards/permission/permission.guard';
import { JwtSystemGuardGuard } from 'src/common/guards/auth/jwt-system-auth.guard';
import { UserModule } from './system/user/user.module';
import { RoleModule } from './system/role/role.module';
import { MenuModule } from './system/menu/menu.module';
import { PostModule } from './personnel/post/post.module';
import { DeptModule } from './personnel/dept/dept.module';
import { StaffModule } from './personnel/staff/staff.module';

@Module({
  imports: [
    AuthModule,
    RouterModule.register([
      {
        path: 'admin',
        module: AdminModule,
        children: [
          {
            path: 'system',
            children: [UserModule, RoleModule, MenuModule],
          },
          {
            path: 'personnel',
            children: [StaffModule, DeptModule, PostModule],
          },
          AuthModule,
        ],
      },
    ]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtSystemGuardGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AdminModule {}
