import { Ctx, On, Scene, SceneEnter, SceneLeave } from 'nestjs-telegraf';
import { PaymentService } from '../../payment/payment.service';
import { Scenes } from 'telegraf';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserPaymentEvent } from '../events/user-payment.event';
import { TelegrafActionSceneType, TelegrafOnTextSceneType } from '../../common/contracts/IBot';

@Scene('APPROVE_PAYMENT')
export class ApproveScene {
  constructor(private readonly paymentService: PaymentService, private readonly eventEmitter: EventEmitter2) {}
  @SceneEnter()
  async entrance(@Ctx() ctx: TelegrafActionSceneType): Promise<void> {
    const paymentId: string = ctx.update.callback_query.data.slice(8);
    ctx.scene.state['data']<Record<string, string>> = {};
    ctx.scene.state['data'].payment_id = paymentId;
    const payment = await this.paymentService.findPayment(Number(paymentId));
    ctx.scene.state['data'].user_id = payment?.user.id;
  }

  @On('text')
  async getAmount(@Ctx() ctx: TelegrafOnTextSceneType): Promise<void> {
    if (!isNaN(parseInt(ctx.update.message.text))) {
      const amount = ctx.update.message.text;
      const adminId = ctx.update.message.from.id;
      ctx.scene.state['data'].amount = amount;
      ctx.scene.state['data'].admin_id = adminId;
      await ctx.scene.leave();
    } else {
      await ctx.reply('چه قدر شارژ بشه(تومان)؟');
    }
  }

  @SceneLeave()
  async exit(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    const { admin_id, user_id, payment_id, amount } = ctx.scene.state['data'];
    await this.paymentService.updatePaymentCredit(
      Number(admin_id),
      Number(payment_id),
      Number(amount),
      Number(user_id),
    );

    this.eventEmitter.emit(
      'payment.sharge',
      new UserPaymentEvent(Number(user_id), Number(admin_id), Number(amount), Number(payment_id), 'APPROVE'),
    );
  }
}
