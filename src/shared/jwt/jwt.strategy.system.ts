import { ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RedisService } from '../redis/redis.service';
import { Request } from 'express';
import { ErrorResponseException } from '../../common/exceptions/error-response.exception';
import { ErrorEnum } from 'src/common/enums/error.enum';

@Injectable()
export class SystemJwtStrategy extends PassportStrategy(
  Strategy,
  'system-jwt',
) {
  constructor(
    private configService: ConfigService,
    private redisService: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
      passReqToCallback: true,
    });
  }
  handleRequest(err: any, user: any) {
    if (err || !user) {
      // 这里改为你自定义的异常，code 自定义（如 10001 表示 token 失效）
      throw new ErrorResponseException('10001:登录状态已过期，请重新登录');
    }
    return user;
  }
  async validate(req: Request, payload: { sub: number }) {
    const cachedToken = await this.redisService.get(
      `accessToken:user_${payload.sub}`,
    );
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!cachedToken) {
      throw new ErrorResponseException(ErrorEnum.ACCESS_TOKEN_EXPIRED);
    }
    if (cachedToken !== token) {
      throw new ErrorResponseException(ErrorEnum.SYSTEM_IN_OTHER_LOGIN);
    }
    return { userId: payload.sub };
  }
}
