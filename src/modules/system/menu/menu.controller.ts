import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MenuService } from './services/menu.service';
import { SysMenuDto } from './dto/menu.dto';
import { ApiOperation } from '@nestjs/swagger';
import { JwtSystemGuardGuard } from 'src/common/guards/auth/jwt-system-auth.guard';
import { Permission } from 'src/common/decorators/permission.decorator';
import { PermissionGuard } from 'src/common/guards/permission/permission.guard';

@Controller('menu')
@UseGuards(JwtSystemGuardGuard, PermissionGuard)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}
  @Permission('system:menu:create')
  @ApiOperation({ summary: '创建菜单' })
  @Post()
  async create(@Body() sysMenuDto: SysMenuDto, @Req() req) {
    console.log('req.user', req.user);
    return await this.menuService.create(sysMenuDto);
  }

  @ApiOperation({ summary: '更新菜单' })
  @Put(':id')
  async update(@Param('id') id: number, @Body() sysMenuDto: SysMenuDto) {
    await this.menuService.update(id, sysMenuDto);
  }

  @ApiOperation({ summary: '删除菜单' })
  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.menuService.delete(id);
  }

  @ApiOperation({ summary: '获取菜单列表' })
  @Get()
  async getMenuList(
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @Query() sysMenuDto: SysMenuDto,
  ) {
    return await this.menuService.getMenuList(
      Number(page),
      Number(pageSize),
      sysMenuDto,
    );
  }
}
