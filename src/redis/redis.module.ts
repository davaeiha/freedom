import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisConfig } from '../common/configs/config.interface';
import { RedisService } from './redis.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      isGlobal: true,
      useFactory: async (configService: ConfigService) =>
        ({
          store: redisStore.redisStore,
          url: configService.get<RedisConfig>('redis')?.url,
          host: configService.get<RedisConfig>('redis')?.host,
          port: configService.get<RedisConfig>('redis')?.port,
          ttl: configService.get<RedisConfig>('redis')?.ttl,
          db: configService.get<RedisConfig>('redis')?.db,
        } as any),
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
