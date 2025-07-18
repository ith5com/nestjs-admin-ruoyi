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
import { MenuQueryDto, SysMenuDto } from './dto/menu.dto';
import { ApiOperation } from '@nestjs/swagger';

import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Permission } from 'src/common/decorators/permission.decorator';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @ApiOperation({ summary: '创建菜单' })
  @Post()
  @Permission('system:menu:create')
  async create(@Body() sysMenuDto: SysMenuDto, @Req() req) {
    return await this.menuService.create(sysMenuDto);
  }

  @ApiOperation({ summary: '更新菜单' })
  @Put(':id')
  @Permission('system:menu:update')
  async update(@Param('id') id: number, @Body() sysMenuDto: SysMenuDto) {
    await this.menuService.update(id, sysMenuDto);
  }

  @ApiOperation({ summary: '删除菜单' })
  @Delete(':id')
  @Permission('system:menu:update')
  async delete(@Param('id') id: number) {
    await this.menuService.delete(id);
  }

  @ApiOperation({ summary: '获取菜单列表' })
  @Get()
  @Permission('system:menu:list')
  async getMenuList(@Query() sysMenuDto: MenuQueryDto) {
    return await this.menuService.getMenuList(sysMenuDto);
  }

  @ApiOperation({ summary: '获取菜单选项' })
  @Get('options')
  async getMenuOptions(@CurrentUser() user) {
    return await this.menuService.getMenuOptions(user.sub);
  }
}
