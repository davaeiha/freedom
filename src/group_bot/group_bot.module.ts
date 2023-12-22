import { Module } from '@nestjs/common';
import { GroupBotUpdate } from './group_bot.update';
import { GroupBotService } from './group_service';
import { ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { TelegramConfig } from 'src/common/configs/config.interface';
import RedisSession from 'telegraf-session-redis';

const sessions = new RedisSession({
  store: {
    host: process.env.REDIS_HOST!,
    port: process.env.REDIS_PORT || 6379,
    db: 2,
    url: process.env.REDIS_URL,
  },
});
@Module({
  imports: [
    TelegrafModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          middlewares: [sessions.middleware()],
          token: configService.get<TelegramConfig>('telegram')!.group_bot_api_token,
          include: [AdminBotModule],
        };
      },
      botName: 'group_bot',
      inject: [ConfigService],
    }),
  ],
  providers: [GroupBotUpdate, GroupBotService],
})
export class AdminBotModule {}
