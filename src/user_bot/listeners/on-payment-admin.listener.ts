import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { UserPaymentEvent } from '../events/user-payment.event';
import { PrismaService } from 'nestjs-prisma';
import { UserBotService } from '../services/user_bot.service';

@Injectable()
export class OnPaymentAdminListener {
  constructor(private readonly prisma: PrismaService, private readonly userBotService: UserBotService) {}
  @OnEvent('payment.*', { async: true })
  async handlePaymentAdminEvent(event: UserPaymentEvent) {
    const adminPaymentMessages = await this.prisma.adminPaymentMessages.findMany({
      where: {
        payment_id: event.payment_id,
      },
      include: {
        admin: true,
      },
    });

    return Promise.all(
      adminPaymentMessages.map((message) => {
        this.userBotService.adminNotifEdit(message, event.amount, event.type);
      }),
    );
  }
}
