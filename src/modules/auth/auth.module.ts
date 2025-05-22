import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './service/auth.service';
import { UserModule } from '../system/user/user.module';
import { RedisModule } from 'src/shared/redis/redis.module';

@Module({
  imports: [UserModule, RedisModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
