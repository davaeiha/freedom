import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { loggingMiddleware, PrismaModule } from 'nestjs-prisma';
import { EventEmitterModule } from '@nestjs/event-emitter';
import config from './common/configs/config';
import { GqlConfigService } from './gql-config.service';
import { UserBotModule } from './user_bot/user_bot.module';
import { AdminBotModule } from './group_bot/group_bot.module';
import { OrderModule } from './order/order.module';
import { RedisModule } from './redis/redis.module';
import { AppResolver } from './app.resolver';
import { MinioClientModule } from './minio/minio.module';
import { PaymentModule } from './payment/payment.module';
import { PackageModule } from './package/package.module';
import { V2rayModule } from './v2ray/v2ray.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    EventEmitterModule.forRoot({
      delimiter: '.',
      wildcard: true,
    }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [
          // configure your prisma middleware
          loggingMiddleware({
            logger: new Logger('PrismaMiddleware'),
            logLevel: 'log',
          }),
        ],
      },
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useClass: GqlConfigService,
    }),
    ScheduleModule.forRoot(),
    UserBotModule,
    AdminBotModule,
    OrderModule,
    RedisModule,
    MinioClientModule,
    PaymentModule,
    PackageModule,
    V2rayModule,
  ],
  providers: [AppResolver],
})
export class AppModule {}
