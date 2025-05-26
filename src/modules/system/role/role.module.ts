import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleController } from './role.controller';
import { RoleService } from './services/role.service';
import { RoleRepositoryService } from './services/role-repository.service';
import { SysRoleEntity } from './entities/role.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SysRoleEntity]),
    forwardRef(() => UserModule),
  ],
  controllers: [RoleController],
  providers: [RoleService, RoleRepositoryService],
  exports: [RoleRepositoryService],
})
export class RoleModule {}
