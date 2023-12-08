import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UserBotUpdate } from './services/user_bot.update';
import { UserBotService } from './services/user_bot.service';
import { BuyWizard } from './scenes/buy.wizard';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigService } from '@nestjs/config';
import RedisSession from 'telegraf-session-redis';
import { TelegramConfig } from '../common/configs/config.interface';
import { OrderModule } from '../order/order.module';
import { RedisModule } from '../redis/redis.module';
import { PaymentModule } from '../payment/payment.module';
import { ApproveScene } from './scenes/approve.scene';
import { OnPaymentAdminListener } from './listeners/on-payment-admin.listener';
import { OnPaymentUserListener } from './listeners/on-payment-user.listener';
import { PackageModule } from '../package/package.module';
import { V2rayModule } from '../v2ray/v2ray.module';
import { StaticsSerivice } from './services/statics.service';

const sessions = new RedisSession({
  store: {
    host: process.env.REDIS_HOST!,
    port: process.env.REDIS_PORT || 6379,
    db: 1,
  },
});

@Module({
  imports: [
    HttpModule,
    PackageModule,
    OrderModule,
    RedisModule,
    PaymentModule,
    V2rayModule,
    TelegrafModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          middlewares: [sessions.middleware()],
          token: configService.get<TelegramConfig>('telegram')!.user_bot_api_token,
        };
      },
      botName: 'user_bot',
      inject: [ConfigService],
    }),
  ],
  providers: [
    UserBotUpdate,
    UserBotService,
    StaticsSerivice,
    BuyWizard,
    ApproveScene,
    OnPaymentAdminListener,
    OnPaymentUserListener,
  ],
})
export class UserBotModule {}
