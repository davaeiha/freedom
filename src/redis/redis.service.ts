import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Injectable, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { RedisStore } from 'cache-manager-redis-store';

@Injectable()
export class RedisService {
  private readonly redisStore!: RedisStore;
  constructor(@Inject(CACHE_MANAGER) private readonly redis: Cache) {
    this.redisStore = redis.store as unknown as RedisStore;
  }

  async get(key: string): Promise<string | undefined> {
    return this.redis.get(key);
  }

  async set(key: string, value: string): Promise<void> {
    await this.redis.set(key, value);
  }
}
