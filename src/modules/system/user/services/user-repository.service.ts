import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SysUserEntity } from '../entities/user.entity';
import { Like, Repository } from 'typeorm';
import {
  CreateUserDto,
  DeleteUserDto,
  GetUserListDto,
  UpdateUserDto,
} from '../dto/user.dto';
import { RoleRepositoryService } from '../../role/services/role-repository.service';
import { ErrorEnum } from 'src/common/enums/error.enum';
import { ErrorResponseException } from 'src/common/exceptions/error-response.exception';
import { DeptRepositoryService } from '../../dept/services/dept-repository.service';

@Injectable()
export class SysUserRepositoryService {
  constructor(
    @InjectRepository(SysUserEntity)
    private readonly sysUserRepository: Repository<SysUserEntity>,

    private readonly roleRepositoryService: RoleRepositoryService,

    private readonly deptRepositoryService: DeptRepositoryService,
  ) {}

  public async createUser({
    username,
    password,
    phone,
    roles = [],
    deptId,
  }: CreateUserDto) {
    // 1. 创建用户基本信息
    const user = this.sysUserRepository.create({
      username,
      password,
      phone,
    });

    // 2. 如果有角色，则关联角色
    if (roles && roles.length > 0) {
      const roleEntities =
        await this.roleRepositoryService.findRolesByIds(roles);
      user.roles = roleEntities;
    }

    if (deptId) {
      const dept = await this.deptRepositoryService.findDeptById(deptId);
      if (!dept) {
        throw new ErrorResponseException(ErrorEnum.SYSTEM_DEPT_NOT_FOUND);
      }
      user.dept = dept;
    }

    // 3. 保存用户信息
    return await this.sysUserRepository.save(user);
  }

  /**
   *
   * @param username
   * @returns
   * 通过用户名查找用户信息
   */
  public async findUserByUsername(username: string) {
    return await this.sysUserRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .addSelect('user.password')
      .getOne();
  }

  public async getUsersByRoleId(roleId: number): Promise<SysUserEntity[]> {
    return await this.sysUserRepository
      .createQueryBuilder('user')
      .innerJoin('user.roles', 'role')
      .where('role.id = :roleId', { roleId })
      .getMany();
  }

  /**
   * 更新用户信息
   * @param id 用户id
   * @param updateUserDto 更新用户信息
   * @returns 更新后的用户信息
   */
  public async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const { roles = [], deptId, ...updateData } = updateUserDto;
    // 1. 查询用户信息
    const user = await this.sysUserRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
      .where('user.id = :id', { id: Number(id) })
      .getOne();
    if (!user) {
      throw new ErrorResponseException(ErrorEnum.SYSTEM_USER_NOT_FOUND);
    }

    // 2. 如果有角色，则关联角色
    if (roles && roles.length > 0) {
      const roleEntities =
        await this.roleRepositoryService.findRolesByIds(roles);
      user.roles = roleEntities;
    } else {
      user.roles = [];
    }

    if (deptId) {
      const dept = await this.deptRepositoryService.findDeptById(deptId);
      if (!dept) {
        throw new ErrorResponseException(ErrorEnum.SYSTEM_DEPT_NOT_FOUND);
      }
      user.dept = dept;
    }

    // 3. 更新用户信息
    Object.assign(user, updateData);
    return await this.sysUserRepository.save(user);
  }

  /**
   * 删除用户
   * @param id 用户id
   * @returns 删除后的用户信息
   */
  public async deleteUser(id: string) {
    const user = await this.sysUserRepository.findOneBy({ id: Number(id) });
    if (!user) {
      throw new ErrorResponseException(ErrorEnum.SYSTEM_USER_NOT_FOUND);
    }
    await this.sysUserRepository.delete(id);
  }

  /**
   * 获取用户详情
   * @param id 用户id
   * @returns 用户详情
   */
  public async getUserDetail(id: string) {
    return await this.sysUserRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
      .leftJoinAndSelect('user.dept', 'dept')
      .where('user.id = :id', { id: Number(id) })
      .getOne();
  }

  /**
   * 获取用户列表
   * @returns 用户列表
   */
  public async getUserList(query: GetUserListDto) {
    const { page = 1, pageSize = 10, username, phone, status, deptId } = query;
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const queryBuilder = this.sysUserRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
      .leftJoinAndSelect('user.dept', 'dept');

    if (deptId) {
      queryBuilder.andWhere('dept.id = :deptId', { deptId });
    }
    if (username) {
      queryBuilder.andWhere('user.username LIKE :username', {
        username: `%${username}%`,
      });
    }
    if (phone) {
      queryBuilder.andWhere('user.phone LIKE :phone', { phone: `%${phone}%` });
    }
    if (status !== undefined) {
      queryBuilder.andWhere('user.status = :status', { status });
    }

    const [list, total] = await queryBuilder
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return {
      list,
      total,
      page,
      pageSize,
    };
  }

  /**
   * 批量删除用户
   * @param deleteUserDto 删除用户dto
   * @returns 删除后的用户信息
   */
  public async batchDeleteUsers(deleteUserDto: DeleteUserDto) {
    return await this.sysUserRepository.delete(deleteUserDto.ids);
  }
}
