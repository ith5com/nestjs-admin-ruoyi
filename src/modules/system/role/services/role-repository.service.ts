import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { Repository, In, Like } from 'typeorm';
import { SysRoleEntity } from '../entities/role.entity';
import {
  CreateRoleDto,
  DeleteRoleDto,
  GetRoleListDto,
  UpdateRoleDto,
} from '../dto/role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorResponseException } from 'src/common/exceptions/error-response.exception';
import { ErrorEnum } from 'src/common/enums/error.enum';
import { SysUserRepositoryService } from '../../user/services/user-repository.service';
import { SysMenuRepositoryService } from '../../menu/services/sys-menu.repository.service';
import { isEmpty } from 'class-validator';

@Injectable()
export class RoleRepositoryService {
  constructor(
    @InjectRepository(SysRoleEntity)
    private readonly roleRepository: Repository<SysRoleEntity>,

    @Inject(forwardRef(() => SysUserRepositoryService))
    private readonly sysUserRepositoryService: SysUserRepositoryService,

    @Inject(forwardRef(() => SysMenuRepositoryService))
    private readonly sysMenuRepositoryService: SysMenuRepositoryService,
  ) {}

  /**
   * 创建角色
   * @param createRoleDto 创建角色dto
   * @returns 创建后的角色
   */
  async create(createRoleDto: CreateRoleDto) {
    // 1. 创建角色
    const { menus = [], ...rest } = createRoleDto;
    const role = this.roleRepository.create(rest);
    // 2. 如果有菜单，则关联菜单
    if (menus.length > 0) {
      const menuEntities =
        await this.sysMenuRepositoryService.findMenusByIds(menus);
      role.menus = menuEntities;
    }
    // 3. 保存角色
    return this.roleRepository.save(role);
  }

  /**
   * @param roleIds 角色id列表
   * @returns 角色信息列表
   * @description 根据角色id列表，查询角色信息
   */
  async findRolesByIds(roleIds: number[]): Promise<SysRoleEntity[]> {
    return await this.roleRepository
      .createQueryBuilder('role')
      .where('role.id IN (:...roleIds)', { roleIds })
      .getMany();
  }

  /**
   * 删除角色
   * @param deleteRoleDto 删除角色dto
   * @returns 删除后的角色
   */
  async delete({ id }: DeleteRoleDto) {
    const roleId = Number(id);
    // 1. 根据角色id, 判断是否是admin角色，如果是，不能删除
    if (roleId === 1) {
      throw new ErrorResponseException(ErrorEnum.SYSTEM_ROLE_NOT_DEL);
    }

    // 2. 判断是否存在关联用户，如果是，不能删除
    const users = await this.sysUserRepositoryService.getUsersByRoleId(roleId);
    if (users.length > 0) {
      throw new ErrorResponseException(ErrorEnum.SYSTEM_ROLE_HAS_USERS);
    }

    // 3. 执行删除操作
    await this.roleRepository.delete(roleId);

    // 4. 后续，需要刷新权限code列表。在权限守卫里面，请求进去，需要先去检查缓存的权限列表，对比。
  }

  /**
   * 更新角色
   * @param id 角色id
   * @param updateRoleDto 更新角色dto
   * @returns 更新后的角色
   */
  async updateRole(id: string, updateRoleDto: UpdateRoleDto) {
    let { menus = [], ...rest } = updateRoleDto;
    const role = await this.roleRepository
      .createQueryBuilder('role')
      .where('role.id = :id', { id: Number(id) })
      .getOne();
    if (!role) {
      throw new ErrorResponseException(ErrorEnum.SYSTEM_ROLE_NOT_FOUND);
    }
    if (menus.length > 0) {
      const menuEntities =
        await this.sysMenuRepositoryService.findMenusByIds(menus);
      role.menus = menuEntities;
    }
    Object.assign(role, rest);
    return await this.roleRepository.save(role);
  }

  /**
   * 获取角色列表
   * @param query 查询条件
   * @returns 角色列表
   */
  async getRolesList(query: GetRoleListDto) {
    const { page = 1, pageSize = 10, name, status, code } = query;
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    const where = {};
    if (name) {
      where['name'] = Like(`%${name}%`);
    }
    if (status) {
      where['status'] = status;
    }
    if (code) {
      where['code'] = code;
    }
    console.log({ name, status, code });
    const [list, total] = await this.roleRepository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.menus', 'menus')
      .select(['role.id', 'role.name', 'role.status', 'role.code', 'menus.id'])
      .where(where)
      .skip(skip)
      .take(take)
      .getManyAndCount();

    const data = list.map((role: any) => {
      return {
        ...role,
        menus: role.menus.map((menu: any) => menu.id),
      };
    });
    console.log({ data });
    return {
      list: data,
      total,
      page,
      pageSize,
    };
  }
  /**
   * 获取角色详情
   * @param id 角色id
   * @returns 角色详情
   */
  async getRoleDetail(id: string) {
    return await this.roleRepository
      .createQueryBuilder('role')
      .where('role.id = :id', { id: Number(id) })
      .leftJoinAndSelect('role.menus', 'menus')
      .getOne();
  }

  /**
   * 根据用户id查询角色id列表
   * @param userId 用户id
   * @returns 角色id列表
   */
  async findRoleByUserId(userId: number) {
    let roleIds = await this.roleRepository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.users', 'users')
      .where('users.id = :userId', { userId })
      .getMany();
    if (isEmpty(roleIds)) return [];
    return roleIds.map((item) => item.id);
  }

  /**
   * 获取角色选项
   * @returns 角色选项
   */
  async getRoleOptions() {
    const roles = await this.roleRepository
      .createQueryBuilder('role')
      .select(['role.id', 'role.name'])
      .getMany();

    return roles.map((role) => ({
      label: role.name,
      value: role.id,
    }));
  }
}
