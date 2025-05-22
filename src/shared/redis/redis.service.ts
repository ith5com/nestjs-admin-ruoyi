import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}
  /**
   *
   * @param param0
   * 设置字符串键值对
   */
  public async set(key, value, type, secoend) {
    await this.redis.set(key, value, type, secoend);
  }

  /**
   *
   * @param key
   * @returns
   * 获取 key 的值
   */
  public async get(key: string) {
    return await this.redis.get(key);
  }

  /**
   *
   * @param key
   * 删除 key
   */
  public async del(key: string) {
    await this.redis.del(key);
  }

  /**
   *
   * @param key
   * @returns
   * 	key 是否存在（返回 0/1）
   */
  public async exists(key: string) {
    return await this.redis.exists(key);
  }

  /**
   *
   * @param param0
   * 设置 key 的过期时间（秒）
   */
  public async expire({ key, seconds }) {
    await this.redis.expire(key, seconds);
  }
}
