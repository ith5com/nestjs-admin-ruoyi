import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { SysMenuEntity } from '../entities/menu.entity';
import { MenuQueryDto, SysMenuDto } from '../dto/menu.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorResponseException } from 'src/common/exceptions/error-response.exception';
import { ErrorEnum } from 'src/common/enums/error.enum';

@Injectable()
export class SysMenuRepositoryService {
  constructor(
    @InjectRepository(SysMenuEntity)
    private readonly sysMenuRepository: Repository<SysMenuEntity>,
  ) {}

  /**
   * 创建菜单
   * @param sysMenuDto 菜单信息
   * @returns 创建的菜单
   */
  public async create(sysMenuDto: SysMenuDto) {
    const sysMenu = this.sysMenuRepository.create(sysMenuDto);
    return await this.sysMenuRepository.save(sysMenu);
  }

  /**
   * 更新菜单
   * @param id 菜单id
   * @param sysMenuDto 菜单信息
   * @returns 更新的菜单
   */
  public async update(id: number, sysMenuDto: SysMenuDto) {
    const sysMenu = await this.sysMenuRepository.findOne({ where: { id } });
    if (!sysMenu) {
      throw new ErrorResponseException(ErrorEnum.SYSTEM_MENU_NOT_FOUND);
    }

    return await this.sysMenuRepository.update(id, sysMenuDto);
  }

  /**
   * 删除菜单
   * @param id 菜单id
   * @returns 删除的菜单
   */
  public async delete(id: number) {
    // 如果绑定了角色，则不能删除
    const roleMenu = await this.sysMenuRepository.findOne({
      where: { id },
      relations: ['roles'],
    });
    if (roleMenu && roleMenu.roles.length > 0) {
      throw new ErrorResponseException(ErrorEnum.SYSTEM_MENU_HAS_ROLE);
    }
    return await this.sysMenuRepository.delete(id);
  }

  /**
   * 获取菜单列表
   * @param page 页码
   * @param pageSize 每页条数
   * @param name 菜单名称
   * @returns 菜单列表
   */
  public async getMenuList(sysMenuDto: MenuQueryDto) {
    const { name } = sysMenuDto;
    const queryBuilder = this.sysMenuRepository.createQueryBuilder('menu');

    if (name) {
      queryBuilder.andWhere('menu.name LIKE :name', { name: `%${name}%` });
    }
    const [list, total] = await queryBuilder.getManyAndCount();
    return {
      list,
      total,
    };
  }

  /**
   * 根据菜单id列表查询菜单
   * @param menuIds 菜单id列表
   * @returns 菜单列表
   */
  async findMenusByIds(menuIds: number[]) {
    return await this.sysMenuRepository
      .createQueryBuilder('menu')
      .where('menu.id IN (:...menuIds)', { menuIds })
      .getMany();
  }

  /**
   * 根据用户id查询菜单
   * @param roleIds 角色id列表
   * @returns 菜单列表
   */
  async findMenusByRoleIds(roleIds: number[]) {
    return await this.sysMenuRepository
      .createQueryBuilder('menu')
      .leftJoinAndSelect('menu.roles', 'roles')
      .where('roles.id IN (:...roleIds)', { roleIds })
      .getMany();
  }
  /**
   * 返回所有菜单
   * @returns 菜单列表
   */
  async findAllMenus() {
    return await this.sysMenuRepository
      .createQueryBuilder('menu')
      .orderBy('menu.sort', 'ASC')
      .getMany();
  }

  /**
   * 获取所有菜单权限
   * @returns 权限列表
   */
  async findAllPermission() {
    const menus = await this.sysMenuRepository
      .createQueryBuilder('menu')
      .select('menu.permission')
      .where('menu.type IN (:...type)', { type: [1, 2] })
      .getMany();

    return menus.map((menu) => menu.permission);
  }

  /**
   * 根据角色id列表查询菜单权限
   * @param roleIds 角色id列表
   * @returns 权限列表
   */
  async findPermissionByRoleIds(roleIds: number[]) {
    const menus = await this.sysMenuRepository
      .createQueryBuilder('menu')
      .select('menu.permission')
      .leftJoinAndSelect('menu.roles', 'roles')
      .where('roles.id IN (:...roleIds)', { roleIds })
      .getMany();
    return menus.map((menu) => menu.permission);
  }

  /**
   * 获取菜单选项
   * @returns 菜单选项
   */
  async getMenuOptions() {
    return await this.sysMenuRepository
      .createQueryBuilder('menu')
      .select(['menu.id', 'menu.name'])
      .orderBy('menu.sort', 'ASC')
      .getMany();
  }
}
