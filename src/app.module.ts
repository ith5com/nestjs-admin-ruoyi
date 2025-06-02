import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvConfigModule } from './shared/env-config/env-config.module';
import { DatabaseModule } from './shared/database/database.module';
import { LoggerService } from './shared/logger/logger.service';
import { SystemModule } from './modules/admin/system/system.module';
import { AuthModule } from './modules/admin/auth/auth.module';
import { RedisModule } from './shared/redis/redis.module';
import { JwtAuthModule } from './shared/jwt/jwt.module';
import { PersonnelModule } from './modules/admin/personnel/personnel.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    EnvConfigModule,
    DatabaseModule,
    SystemModule,
    AuthModule,
    RedisModule,
    JwtAuthModule,
    PersonnelModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService, LoggerService],
  exports: [LoggerService],
})
export class AppModule {}
