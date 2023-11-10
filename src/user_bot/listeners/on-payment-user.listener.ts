import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { UserPaymentEvent } from '../events/user-payment.event';
import { UserBotService } from '../services/user_bot.service';

@Injectable()
export class OnPaymentUserListener {
  constructor(private readonly userBotService: UserBotService) {}
  @OnEvent('payment.*', { async: true })
  async handleShargeNitificationEvent(event: UserPaymentEvent) {
    return this.userBotService.sendNotification(
      event.user_id,
      `${
        event.type === 'APPROVE'
          ? `موجودی شما ${event.amount} .تومان شارژ شد🤗`
          : 'اوپس🤗\n پرداخت شما رد شد.\n اگر فاکتور رو اشتباه فرستادی یا میخوای ادمین دوباره ورداختتو ببینن عکس فاکتور رو همینجا بفرست'
      }`,
    );
  }
}
