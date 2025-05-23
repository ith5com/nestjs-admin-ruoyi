import { Injectable } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { SysUserRepositoryService } from 'src/modules/system/user/services/user-repository.service';
import { ErrorEnum } from 'src/common/enums/error.enum';
import { HashingProvider } from 'src/modules/system/user/services/hashing.provider';
import { RedisService } from 'src/shared/redis/redis.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly sysUserRepositoryService: SysUserRepositoryService,
    private readonly hashingProvider: HashingProvider,
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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

    const payload = {
      sub: user.id,
      username: user.username,
    };

    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('jwt.system_secret'),
      expiresIn: '1h',
    });
    // 存储到redis中，后面做挤兑下线功能
    await this.redisService.set(`user_${user.id}`, token, 'EX', 1000);
    return {
      user: {
        id: user.id,
        username: user.username,
        phone: user.phone,
        status: user.status,
      },
      accessToken: token,
    };
  }
}
