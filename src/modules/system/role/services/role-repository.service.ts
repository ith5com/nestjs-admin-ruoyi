import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { SysRoleEntity } from '../entities/role.entity';
import { CreateRoleDto, DeleteRoleDto } from '../dto/role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorResponseException } from 'src/common/exceptions/error-response.exception';
import { ErrorEnum } from 'src/common/enums/error.enum';
import { SysUserRepositoryService } from '../../user/services/user-repository.service';

@Injectable()
export class RoleRepositoryService {
  constructor(
    @InjectRepository(SysRoleEntity)
    private readonly roleRepository: Repository<SysRoleEntity>,

    @Inject(forwardRef(() => SysUserRepositoryService))
    private readonly sysUserRepositoryService: SysUserRepositoryService,
  ) {}

  create(createRoleDto: CreateRoleDto) {
    const role = this.roleRepository.create(createRoleDto);
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
}
