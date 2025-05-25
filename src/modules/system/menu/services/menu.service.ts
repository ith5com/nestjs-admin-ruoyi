import { Injectable } from '@nestjs/common';
import { MenuQueryDto, SysMenuDto } from '../dto/menu.dto';
import { SysMenuRepositoryService } from './sys-menu.repository.service';

@Injectable()
export class MenuService {
  constructor(
    private readonly sysMenuRepositoryService: SysMenuRepositoryService,
  ) {}
  /**
   * 创建菜单
   * @param sysMenuDto 菜单信息
   * @returns 创建的菜单
   */
  public async create(sysMenuDto: SysMenuDto) {
    return await this.sysMenuRepositoryService.create(sysMenuDto);
  }

  /**
   * 更新菜单
   * @param id 菜单id
   * @param sysMenuDto 菜单信息
   * @returns 更新的菜单
   */
  public async update(id: number, sysMenuDto: SysMenuDto) {
    return await this.sysMenuRepositoryService.update(id, sysMenuDto);
  }

  /**
   * 删除菜单
   * @param id 菜单id
   * @returns 删除的菜单
   */
  public async delete(id: number) {
    return await this.sysMenuRepositoryService.delete(id);
  }

  /**
   * 获取菜单列表
   * @param page 页码
   * @param pageSize 每页条数
   * @param sysMenuDto 菜单信息
   * @returns 菜单列表
   */
  public async getMenuList(
   
    sysMenuDto: MenuQueryDto,
  ) {
    return await this.sysMenuRepositoryService.getMenuList(
    
      sysMenuDto,
    );
  }
}
