import { Injectable } from '@nestjs/common';
import { CreateUserDto, GetUserListDto, UpdateUserDto } from '../dto/user.dto';
import { HashingProvider } from './hashing.provider';
import { SysUserRepositoryService } from './user-repository.service';
import { ErrorEnum } from 'src/common/enums/error.enum';
import { ErrorResponseException } from 'src/common/exceptions/error-response.exception';

@Injectable()
export class UserService {
  constructor(
    private readonly hashingProvider: HashingProvider,
    private readonly sysUserRepositoryService: SysUserRepositoryService,
  ) {}
  /**
   *
   * @param param0
   * @returns SysUserEntity
   * 创建用户
   */
  public async createUser({
    username,
    password,
    phone,
    roles = [],
  }: CreateUserDto) {
    // 判断是否存在用户
    const exists =
      await this.sysUserRepositoryService.findUserByUsername(username);


    if (exists) {
      throw new ErrorResponseException(ErrorEnum.SYSTEM_USER_EXISTS);
    }

    const newPassword = await this.hashingProvider.generatePassword(password);
    const createUserBody = {
      username,
      phone,
      password: newPassword,
      roles: roles,
    };
    const user = await this.sysUserRepositoryService.createUser(createUserBody);

    return {
      id: user.id,
      username: user.username,
      phone: user.phone,
      status: user.status,
    };
  }
  /**
   * 更新用户信息
   * @param id 用户id
   * @param updateUserDto 更新用户信息
   * @returns 更新后的用户信息
   */
  updateUser(id: string, updateUserDto: UpdateUserDto) {
    return this.sysUserRepositoryService.updateUser(id, updateUserDto);
  }

  /**
   * 删除用户
   * @param id 用户id
   * @returns 删除后的用户信息
   */
  deleteUser(id: string) {
    return this.sysUserRepositoryService.deleteUser(id);
  }

  /**
   * 获取用户详情
   * @param id 用户id
   * @returns 用户详情
   */
  getUserDetail(id: string) {
    return this.sysUserRepositoryService.getUserDetail(id);
  }

  /**
   * 获取用户列表
   * @returns 用户列表
   */
  getUserList(query: GetUserListDto) {
    return this.sysUserRepositoryService.getUserList(query);
  }
}
