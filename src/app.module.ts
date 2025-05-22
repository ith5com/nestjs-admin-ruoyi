import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvConfigModule } from './shared/env-config/env-config.module';
import { DatabaseModule } from './shared/database/database.module';
import { LoggerService } from './shared/logger/logger.service';
import { SystemModule } from './modules/system/system.module';

@Module({
  imports: [EnvConfigModule, DatabaseModule, SystemModule],
  controllers: [AppController],
  providers: [AppService, LoggerService],
  exports: [LoggerService],
})
export class AppModule {}
