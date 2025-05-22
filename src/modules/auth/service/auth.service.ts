import { Injectable } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { SysUserRepositoryService } from 'src/modules/system/user/services/user-repository.service';
import { ErrorEnum } from 'src/common/enums/error.enum';
import { HashingProvider } from 'src/modules/system/user/services/hashing.provider';
import { RedisService } from 'src/shared/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly sysUserRepositoryService: SysUserRepositoryService,
    private readonly hashingProvider: HashingProvider,
    private readonly redisService: RedisService,
  ) {}
  public async login({ username, password }: LoginDto) {
    const user =
      await this.sysUserRepositoryService.findUserByUsername(username);
    if (!user) {
      throw new Error(ErrorEnum.SYSTEM_USER_EXISTS);
    }
    const cachePassword = user.password;
    // 校验密码
    const isPass = await this.hashingProvider.comaprePassword(
      password,
      cachePassword,
    );
    if (!isPass) throw new Error(ErrorEnum.SYSTEM_USER_PASSWORD_ERROR);
    await this.redisService.set(
      `user_${user.id}`,
      JSON.stringify({
        id: user.id,
        username: user.username,
        phone: user.phone,
        status: user.status,
      }),
      'EX',
      1000,
    );
    return {
      id: user.id,
      username: user.username,
      phone: user.phone,
      status: user.status,
    };
  }
}
