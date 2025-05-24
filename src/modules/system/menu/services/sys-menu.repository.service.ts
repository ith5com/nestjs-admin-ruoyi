import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { SysMenuEntity } from '../entities/menu.entity';
import { SysMenuDto } from '../dto/menu.dto';
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
    const sysMenu = await this.sysMenuRepository.findOne({ where: { id } });
    if (!sysMenu) {
      throw new ErrorResponseException(ErrorEnum.SYSTEM_MENU_NOT_FOUND);
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
  public async getMenuList(
    page: number,
    pageSize: number,
    sysMenuDto: SysMenuDto,
  ) {
    const queryBuilder = this.sysMenuRepository.createQueryBuilder('menu');
    console.log(page);
    console.log(page - 1);
    const { name } = sysMenuDto;
    if (name) {
      queryBuilder.andWhere('menu.name LIKE :name', { name: `%${name}%` });
    }
    const [menus, total] = await queryBuilder
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();
    return {
      menus,
      total,
      page,
      pageSize,
    };
  }

  /**
   * 根据菜单id列表查询菜单
   * @param menuIds 菜单id列表
   * @returns 菜单列表
   */
  async findMenuByIds(menuIds: number[]) {
    return await this.sysMenuRepository.findBy({ id: In(menuIds) });
  }
}
