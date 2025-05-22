import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseConfig } from 'src/config/database.config';
import { EnvValidationSchema } from './env-config.schema';
import { RedisConfig } from 'src/config/redis.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`, // 自动加载
      load: [DatabaseConfig, RedisConfig],
      validationSchema: EnvValidationSchema,
    }),
  ],
})
export class EnvConfigModule {}
