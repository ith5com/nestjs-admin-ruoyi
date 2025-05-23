import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/user.dto';
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
  public async createUser({ username, password, phone }: CreateUserDto) {
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
    };
    const user = await this.sysUserRepositoryService.createUser(createUserBody);

    return {
      id: user.id,
      username: user.username,
      phone: user.phone,
      status: user.status,
    };
  }
}
