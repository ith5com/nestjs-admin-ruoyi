import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './service/auth.service';
import { UserModule } from '../system/user/user.module';
import { RedisModule } from 'src/shared/redis/redis.module';
import { JwtAuthModule } from 'src/shared/jwt/jwt.module';

@Module({
  imports: [UserModule, RedisModule, JwtAuthModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
