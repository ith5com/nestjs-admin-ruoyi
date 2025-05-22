import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import Redis, { RedisOptions } from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      useFactory: (configService: ConfigService): Redis => {
        const options: RedisOptions = {
          host: configService.get<string>('redis.host'),
          port: configService.get<number>('redis.port'),
          password: configService.get<string>('redis.password'),
          db: configService.get<number>('redis.db'),
        };
        return new Redis(options);
      },
      inject: [ConfigService],
    },
  ],
  exports: ['REDIS_CLIENT', RedisService],
})
export class RedisModule {}
