import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './services/role.service';
import { RoleRepositoryService } from './services/role-repository.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SysRoleEntity } from './entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SysRoleEntity])],
  controllers: [RoleController],
  providers: [RoleService, RoleRepositoryService],
})
export class RoleModule {}
