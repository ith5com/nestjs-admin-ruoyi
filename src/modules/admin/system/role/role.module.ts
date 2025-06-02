import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleController } from './role.controller';
import { RoleService } from './services/role.service';
import { RoleRepositoryService } from './services/role-repository.service';
import { SysRoleEntity } from './entities/role.entity';
import { UserModule } from '../user/user.module';
import { MenuModule } from '../menu/menu.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SysRoleEntity]),
    forwardRef(() => UserModule),
    forwardRef(() => MenuModule),
  ],
  controllers: [RoleController],
  providers: [RoleService, RoleRepositoryService],
  exports: [RoleRepositoryService, RoleService],
})
export class RoleModule {}
