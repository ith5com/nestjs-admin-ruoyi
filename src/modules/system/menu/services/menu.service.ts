import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { MenuQueryDto, SysMenuDto } from '../dto/menu.dto';
import { SysMenuRepositoryService } from './sys-menu.repository.service';
import { RoleService } from '../../role/services/role.service';
import { SysMenuEntity } from '../entities/menu.entity';
import { generatorRouters } from 'src/utils/permission';
import { isEmpty } from 'class-validator';

@Injectable()
export class MenuService {
  constructor(
    private readonly sysMenuRepositoryService: SysMenuRepositoryService,
    @Inject(forwardRef(() => RoleService))
    private readonly roleService: RoleService,
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
  public async getMenuList(sysMenuDto: MenuQueryDto) {
    return await this.sysMenuRepositoryService.getMenuList(sysMenuDto);
  }

  /**
   * 获取用户菜单
   * @param userId 用户ID
   * @returns 菜单列表
   */
  async findMenusByUserId(userId: number) {
    let menus: SysMenuEntity[] = [];
    let roleIds = await this.roleService.getRoleIdsByUser(userId);
    if (isEmpty(roleIds)) {
      return generatorRouters([]);
    }
    if (roleIds.includes(1)) {
      // 如果是超级用户，则返回所有菜单
      menus = await this.sysMenuRepositoryService.findAllMenus();
    } else {
      // 根据返回的roleIds集合，查菜单
      menus = await this.sysMenuRepositoryService.findMenusByRoleIds(roleIds);
    }
    return generatorRouters(menus);
  }
  /**
   * 获取用户权限
   * @param userId 用户ID
   * @returns 权限列表
   */
  async findPermissionByUserId(userId: number) {
    let roleIds = await this.roleService.getRoleIdsByUser(userId);
    let permission: string[] = [];
    if (roleIds.includes(1)) {
      permission = await this.sysMenuRepositoryService.findAllPermission();
    } else {
      if (isEmpty(roleIds)) return permission;
      permission =
        await this.sysMenuRepositoryService.findPermissionByRoleIds(roleIds);
    }
    return permission;
  }
}
