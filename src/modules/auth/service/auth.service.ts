import { Injectable } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { SysUserRepositoryService } from 'src/modules/system/user/services/user-repository.service';
import { ErrorEnum } from 'src/common/enums/error.enum';
import { HashingProvider } from 'src/modules/system/user/services/hashing.provider';
import { RedisService } from 'src/shared/redis/redis.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ErrorResponseException } from 'src/common/exceptions/error-response.exception';

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
      throw new ErrorResponseException(ErrorEnum.SYSTEM_USER_PASSWORD_ERROR);
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

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('jwt.system_secret'),
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: 'refresh-secret',
      expiresIn: '7d',
    });
    // 存储到redis中，后面做挤兑下线功能
    await this.redisService.set(
      `accessToken:user_${user.id}`,
      accessToken,
      'EX',
      60 * 15,
    );
    // 存储到redis中，后面做挤兑下线功能
    await this.redisService.set(
      `refreshToken:user_${user.id}`,
      accessToken,
      'EX',
      60 * 60 * 24 * 7,
    );
    return {
      user: {
        id: user.id,
        username: user.username,
        phone: user.phone,
        status: user.status,
      },
      accessToken: accessToken,
      refreshToken,
    };
  }

  public async refreshToken(data: { refreshToken: string }) {
    let payload = {} as any;
    try {
      payload = await this.jwtService.verifyAsync(data.refreshToken, {
        secret: this.configService.get('jwt.system_secret'),
      });
    } catch (error) {
      console.log(error);
      throw new ErrorResponseException(ErrorEnum.SYSTEM_USER_UNAUTHORIZED);
    }
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('jwt.system_secret'),
      expiresIn: '15m',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: 'refresh-secret',
      expiresIn: '7d',
    });
    // 存储到redis中，后面做挤兑下线功能
    await this.redisService.set(
      `accessToken:user_${payload.sub}`,
      accessToken,
      'EX',
      60 * 15,
    );
    // 存储到redis中，后面做挤兑下线功能
    await this.redisService.set(
      `refreshToken:user_${payload.sub}`,
      refreshToken,
      'EX',
      60 * 60 * 24 * 7,
    );
    return { accessToken, refreshToken };
  }
}
