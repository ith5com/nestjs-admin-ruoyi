import { forwardRef, Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { MenuService } from './services/menu.service';
import { SysMenuRepositoryService } from './services/sys-menu.repository.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SysMenuEntity } from './entities/menu.entity';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SysMenuEntity]),
    forwardRef(() => RoleModule),
  ],
  controllers: [MenuController],
  providers: [MenuService, SysMenuRepositoryService],
  exports: [SysMenuRepositoryService, MenuService],
})
export class MenuModule {}
