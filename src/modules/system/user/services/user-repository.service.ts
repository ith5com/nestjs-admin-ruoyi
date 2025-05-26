import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SysUserEntity } from '../entities/user.entity';
import { Like, Repository } from 'typeorm';
import { CreateUserDto, GetUserListDto, UpdateUserDto } from '../dto/user.dto';
import { RoleRepositoryService } from '../../role/services/role-repository.service';
import { ErrorEnum } from 'src/common/enums/error.enum';
import { ErrorResponseException } from 'src/common/exceptions/error-response.exception';

@Injectable()
export class SysUserRepositoryService {
  constructor(
    @InjectRepository(SysUserEntity)
    private readonly sysUserRepository: Repository<SysUserEntity>,

    private readonly roleRepositoryService: RoleRepositoryService,
  ) {}

  public async createUser({
    username,
    password,
    phone,
    roles = [],
  }: CreateUserDto) {
    // 1. 创建用户基本信息
    const user = this.sysUserRepository.create({
      username,
      password,
      phone,
    });

    // 2. 如果有角色，则关联角色
    if (roles && roles.length > 0) {
      const roleEntities = await this.roleRepositoryService.findRolesByIds(roles);
      user.roles = roleEntities;
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
    const { roles = [], ...updateData } = updateUserDto;
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
      const roleEntities = await this.roleRepositoryService.findRolesByIds(roles);
      user.roles = roleEntities;
    }else{
      user.roles = [];
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
    await this.sysUserRepository.delete(id) 
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
    .where('user.id = :id', { id: Number(id) })
    .getOne();
  }

  /**
   * 获取用户列表
   * @returns 用户列表
   */
  public async getUserList(query: GetUserListDto) {
    const { page = 1, pageSize = 10, username, phone, status } = query;
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    const where = {};
    if (username) {
      where['user.username'] = Like(`%${username}%`);
    }
    if (phone) {
      where['user.phone'] = Like(`%${phone}%`);
    }
    if (status) {
      where['user.status'] = status;
    }
    const [list, total] = await this.sysUserRepository
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.roles', 'roles')
    .where(where)
    .skip(skip)
    .take(take)
    .getManyAndCount();
    return {
      list,
      total,
      page,
      pageSize
    };
  }
}
