import { Injectable } from '@nestjs/common';
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

  async validate(req: Request, payload: { sub: number }) {
    const cachedToken = await this.redisService.get(`token:${payload.sub}`);
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (cachedToken !== token) {
      throw new ErrorResponseException(ErrorEnum.SYSTEM_IN_OTHER_LOGIN);
    }
    return { userId: payload.sub };
  }
}
