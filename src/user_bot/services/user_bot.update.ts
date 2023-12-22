import { Action, Ctx, Hears, InjectBot, InlineQuery, Next, On, Start, Update, Use } from 'nestjs-telegraf';
import { Context, Scenes, Telegraf } from 'telegraf';
import { PrismaService } from 'nestjs-prisma';
import { NextFunction } from 'express';
import { User } from '@prisma/client';
import { HttpService } from '@nestjs/axios';
import { UserBotService } from './user_bot.service';
import { RedisService } from '../../redis/redis.service';
import { MinioClientService } from '../../minio/minio.service';
import { PaymentService } from '../../payment/payment.service';
import { TelegrafActionSceneType, TelegrafActionType, TelegrafInlineQueryType } from '../../common/contracts/IBot';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserPaymentEvent } from '../events/user-payment.event';
import { OrderService } from '../../order/order.service';
import { StaticsSerivice } from './statics.service';
import { HttpException } from '@nestjs/common';

@Update()
export class UserBotUpdate {
  private user: User | null;

  constructor(
    @InjectBot('user_bot') private readonly bot: Telegraf<Context>,
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
    private readonly userBotService: UserBotService,
    private readonly staticsService: StaticsSerivice,
    private readonly redisService: RedisService,
    private readonly minio: MinioClientService,
    private readonly paymentService: PaymentService,
    private readonly orderService: OrderService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Use()
  async authMiddleware(@Ctx() ctx: Context<any>, @Next() next: NextFunction) {
    let id: number | undefined;

    switch (Object.keys(ctx.update)[1]) {
      case 'message':
        id = ctx.update.message.from.id;
        break;
      case 'callback_query':
        id = ctx.update.callback_query.from.id;
        break;
      case 'inline_query':
        id = ctx.update.inline_query.from.id;
        break;
      case 'edited_message':
        id = ctx.update.edited_message.from.id;
    }

    if (id !== undefined) {
      const cachedUser = await this.redisService.get(id!.toString());
      if (cachedUser) {
        this.user = JSON.parse(cachedUser);
        return next();
      }

      const dbUser = await this.prisma.user.findUnique({
        where: {
          id: Number(id),
        },
      });
      if (dbUser) {
        this.user = dbUser;
        await this.redisService.set(id!.toString(), JSON.stringify(this.user));
        return next();
      }
    }

    await ctx.reply('شما مجاز به استفاده از این ربات نیستید 🛑');
  }

  @Start()
  async startCommand(@Ctx() ctx: Context<any>) {
    await ctx.reply('💎', {
      reply_markup: {
        keyboard: [[{ text: 'منو اصلی' }]],
        resize_keyboard: true,
      },
    });
    await this.userBotService.mainMenuMessage(ctx);
  }

  @Hears('منو اصلی')
  async mainMenu(@Ctx() ctx: Context<any>) {
    await this.userBotService.mainMenuMessage(ctx);
  }

  @Action('CREDIT')
  async getInventory(@Ctx() ctx: TelegrafActionType) {
    await ctx.deleteMessage();
    await ctx.reply(`موجودی شما : ${this.user!.credit} هزار تومان`);
  }

  @Action('CHARGE')
  async sharge(@Ctx() ctx: TelegrafActionType) {
    await ctx.deleteMessage();
    await ctx.reply(
      'لطفا مبلغ مورد نظرتو واسه افزایش موجودی به شماره کارت زیر واریز کن(بزن روش کپی میشه) و عکس فیش واریز رو همینجا واسه ربات بفرست 👇 \n بعد از تایید توسط ادمین حسابت شارژ میشه و همینجا بهت خبر میدیم \n.\n.\n.\n.\n<code>6219861913589536</code> - محمد مهدی دعواییها - بانک سامان',
      {
        parse_mode: 'HTML',
      },
    );
  }

  @Action('BUY')
  async buypackage(@Ctx() ctx: Scenes.SceneContext) {
    await ctx.scene.enter('BuyWizard');
  }

  @Action('TEST')
  async testPackage(@Ctx() ctx: TelegrafActionType) {
    const user_id = ctx.update.callback_query.from.id;
    const testConfigUrl = await this.userBotService.getTestPackage();
    await ctx.reply(
      `بسته تستی با حجم 256 مگابایت و به مدت سی روزه براتون با کانفیگ زیر فعال شد.🧪\n.\n.\n.\n بزن روش کپی میشه👇\n.<code>${testConfigUrl}</code>`,
      {
        parse_mode: 'HTML',
      },
    );
  }

  @Action(new RegExp(/^APPROVE_\d+$/, 'g'))
  async approvePayment(@Ctx() ctx: TelegrafActionSceneType) {
    await ctx.scene.enter('APPROVE_PAYMENT');
    await ctx.reply('چه قدر شارژ بشه(تومان)؟');
  }

  @Action(new RegExp(/^REJECT_\d+$/, 'g'))
  async rejectPayment(@Ctx() ctx: TelegrafActionType) {
    const paymentId: string = ctx.update.callback_query.data.slice(7);
    const adminId = ctx.update.callback_query.from.id;
    const payment = await this.paymentService.updatePaymentCredit(Number(adminId), Number(paymentId), 0);
    this.eventEmitter.emit('payment.reject', new UserPaymentEvent(payment.user_id, adminId, 0, payment.id, 'REJECT'));
  }

  @Action(new RegExp(/^STATICS_.+/, 'g'))
  async showOrderStatics(@Ctx() ctx: TelegrafActionType) {
    const configId: string = ctx.update.callback_query.data.slice(8);
    const { remainingDays, remainingTraffic, totalTraffic } = await this.staticsService.showOrderStatics(configId);

    await this.userBotService.sendNotification(
      this.user!.id,
      `روز های باقیمانده:${
        remainingDays > 0 ? remainingDays : 'بسته مصرفی تموم شده'
      }\nترافیک باقیمانده:${remainingTraffic}\nدرصد باقیمانده : ${((remainingTraffic / totalTraffic) * 100).toFixed(
        1,
      )}% \n.`,
    );
  }

  @On('photo')
  async getPayment(@Ctx() ctx: Context<any>) {
    const fileId = ctx.update.message.photo.pop().file_id;

    const fileLink = await ctx.telegram.getFileLink(fileId);

    const response = await this.httpService.axiosRef({
      url: fileLink.href,
      method: 'GET',
      responseType: 'arraybuffer',
    });

    await this.minio.upload(
      [
        {
          buffer: Buffer.from(await response.data, 'base64'),
          mimetype: 'jpg',
          filename: `${fileId}`,
        },
      ],
      'invoices',
    );

    const fromChatId = ctx.update.message.from.id;
    const messageId = ctx.update.message.message_id;

    const payment = await this.paymentService.createPayment({
      file_name: fileId,
      user_id: fromChatId,
    });

    await this.userBotService.invoiceAdminNotification(fromChatId, messageId, payment.id, this.user!);
  }

  @Action(new RegExp(/^DELETE_\d+$/, 'g'))
  async deleteFromCart(@Ctx() ctx: TelegrafActionType) {
    const orderId: string = ctx.update.callback_query.data.slice(7);
    await this.orderService.deleteOrder(Number(orderId));
    await ctx.telegram.editMessageReplyMarkup(undefined, undefined, ctx.update.callback_query.inline_message_id, {
      inline_keyboard: [],
    });
    await ctx.answerCbQuery(`سفارش ${orderId} با موفقیت حذف شد.`);
  }

  @Action(new RegExp(/^COMPLETE_\d+$/, 'g'))
  async completeOrder(@Ctx() ctx: TelegrafActionType) {
    const orderId: string = ctx.update.callback_query.data.slice(9);

    const completedOrder = await this.userBotService.completeInCartOrder(Number(orderId));
    if (!completedOrder!.config_url) {
      await this.userBotService.sendNotification(
        Number(this.user?.id),
        `سفارش شما با شناسه ${completedOrder!.id} و عنوان <b>${
          completedOrder!.title
        }</b> به سبد خریدتون اضافه شد ولی موجودیتون واسه تکمیل سفارش کافی نبود \nبعد از افزایش موجودی از سبد خرید توی منوی اصلی میتونید سفارشتون رو تکمیل کنید `,
        {
          reply_markup: {
            inline_keyboard: [[{ text: 'افزایش موجودی', callback_data: 'CHARGE' }]],
          },
          parse_mode: 'HTML',
        },
      );
    } else {
      await this.userBotService.sendNotification(
        Number(this.user?.id),
        `تبریک👏🎉\n سفارش شما با شناسه ${completedOrder!.id} و عنوان ${
          completedOrder!.title
        } تکمیل شد.\n از منوی اصلی قسمت کانفیگ های فعال میتونی آمار بسته رو داشته باشی😎 \n.\n.\n کانفیگ شما این پایین هستش(بزن روش کپی میشه) :\n <code>${
          completedOrder!.config_url
        }</code>`,
        {
          parse_mode: 'HTML',
        },
      );
    }
  }

  @InlineQuery('#active')
  async avtiveOrders(@Ctx() ctx: TelegrafInlineQueryType) {
    try {
      await ctx.answerInlineQuery(await this.userBotService.showActivePackages(this.user!.id), {
        cache_time: 0,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        await ctx.telegram.sendMessage(this.user?.id!, error.message);
      }
    }
  }

  @InlineQuery('#cart')
  async inCartOrders(@Ctx() ctx: TelegrafInlineQueryType) {
    try {
      await ctx.answerInlineQuery(await this.userBotService.showInCartPackages(this.user!.id), {
        cache_time: 0,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        await ctx.telegram.sendMessage(this.user?.id!, error.message);
        // await ctx.telegram.editMessageCaption(this.user?.id!, undefined,undefined,'');
      }
    }
  }
}
