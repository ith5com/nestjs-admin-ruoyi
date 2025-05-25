import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { MenuModule } from './menu/menu.module';
import { RouterModule } from '@nestjs/core';
@Module({
  imports: [
    UserModule,
    RoleModule,
    MenuModule,
    RouterModule.register([
      {
        path: 'system',
        module: SystemModule,
        children: [UserModule, RoleModule, MenuModule],
      },
    ]),
  ],
})
export class SystemModule {}
