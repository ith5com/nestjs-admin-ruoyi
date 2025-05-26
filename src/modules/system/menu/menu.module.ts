import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { MenuService } from './services/menu.service';
import { SysMenuRepositoryService } from './services/sys-menu.repository.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SysMenuEntity } from './entities/menu.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SysMenuEntity])],
  controllers: [MenuController],
  providers: [MenuService, SysMenuRepositoryService],
  exports: [SysMenuRepositoryService],
})
export class MenuModule {}
