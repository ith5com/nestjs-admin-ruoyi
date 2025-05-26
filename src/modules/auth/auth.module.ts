import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './service/auth.service';
import { UserModule } from '../system/user/user.module';
import { RedisModule } from 'src/shared/redis/redis.module';
import { JwtAuthModule } from 'src/shared/jwt/jwt.module';
import { AccountController } from './controller/account.controller';
import { MenuModule } from '../system/menu/menu.module';

@Module({
  imports: [UserModule, RedisModule, JwtAuthModule, MenuModule],
  controllers: [AuthController, AccountController],
  providers: [AuthService],
})
export class AuthModule {}
