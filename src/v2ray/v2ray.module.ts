import { Module } from '@nestjs/common';
import { GraphQLRequestModule } from '@golevelup/nestjs-graphql-request';
import { V2rayService } from './v2ray.service';
import { ConfigService } from '@nestjs/config';
import { V2rayConfig } from '../common/configs/config.interface';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    RedisModule,
    GraphQLRequestModule.forRootAsync(GraphQLRequestModule, {
      useFactory: (configService: ConfigService) => {
        return {
          endpoint: configService.get<V2rayConfig>('v2ray')?.endpoint!,
          options: {
            headers: {
              'content-type': 'application/json',
            },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [V2rayService],
  exports: [V2rayService],
})
export class V2rayModule {}
