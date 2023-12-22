import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf, Context, Markup } from 'telegraf';
import { InlineQueryResult } from 'telegraf/typings/core/types/typegram';

import { Order, Prisma, User } from '@prisma/client';
import { AdminPymentMessageWithAmin } from '../../common/contracts/IAdminMessage';
import { PackageService } from '../../package/package.service';
import { InlineKeyboardMarkup } from 'telegraf/typings/core/types/typegram';
import { OrderService } from '../../order/order.service';
import { V2rayService } from '../../v2ray/v2ray.service';
import { StaticsSerivice } from './statics.service';
import { JalaliDateTime } from '@webilix/jalali-date-time';
import { menuButtons } from '../buttons';

@Injectable()
export class UserBotService {
  private adminIds: number[];
  private readonly jalali = JalaliDateTime({
    timezone: 'Asia/Tehran',
    locale: 'fa',
    fullTextFormat: 'W, D N Y H:I:S',
    titleFormat: 'W, D N Y',
    dateFormat: 'Y-M-D',
    timeFormat: 'H:I:S',
  });
  constructor(
    @InjectBot('user_bot') private readonly userBot: Telegraf<Context>,
    private readonly prisma: PrismaService,
    private readonly packageService: PackageService,
    private readonly orderService: OrderService,
    private readonly v2rayService: V2rayService,
    private readonly staticsService: StaticsSerivice,
  ) {}

  private readonly TestPackageId = '97c710b4-66a3-403b-8a70-3dc358970a45';

  async sendNotification(chat_id: string | number, message: string, extra?: Record<string, any>): Promise<any> {
    return this.userBot.telegram.sendMessage(chat_id, message, extra || {});
  }

  async mainMenuMessage(ctx) {
    await ctx.reply(
      'سلام به ربات آزادی خوش اومدی 😇\nتوی این ربات میتونی واسه خودت و دیگران فیلتر شکن تهیه کنی و  اونها رو مدیریت کنی. \n.\n.\n.\n.\n برای شروع از دکمه های زیر استفاده کن 👇  ',
      menuButtons(),
    );
  }

  async shargeUser(user_id: number, amount: number) {
    return this.prisma.user.update({
      where: {
        id: user_id,
      },
      data: {
        credit: amount,
      },
    });
  }

  private async getAdminIds() {
    try {
      this.adminIds = (
        await this.prisma.user.findMany({
          where: {
            role: 'ADMIN',
          },
          select: {
            id: true,
          },
        })
      ).map((admin) => admin.id);
    } catch (error) {
      throw error;
    }
  }

  async invoiceAdminNotification(
    from_chat_id: string | number,
    message_id: number,
    payment_id: string | number,
    user: User,
  ) {
    await this.getAdminIds();

    let jobs: Promise<any>[] = [];

    this.adminIds.forEach((adminId) => {
      jobs.push(
        this.userBot.telegram.forwardMessage(adminId, from_chat_id, message_id),
        this.userBot.telegram.sendMessage(
          adminId,
          `user: ${user.id}\nname: ${user.name}\nusername: @${user.username}\npayment_id: ${payment_id}`,
          {
            reply_markup: {
              inline_keyboard: [
                [
                  { text: 'تایید', callback_data: `APPROVE_${payment_id}` },
                  { text: 'رد', callback_data: `REJECT_${payment_id}` },
                ],
              ],
            },
          },
        ),
      );
    });

    const messages = await Promise.all(jobs);

    const doubleMessageChatIdDic = messages.reduce<Record<string, any[]>>((initial, message) => {
      if (Object.keys(initial).includes(message.chat.id.toString())) {
        initial[message.chat.id].push(message);
      } else {
        initial[message.chat.id] = [message];
      }

      return initial;
    }, {});

    const createMessagesInput = Object.keys(doubleMessageChatIdDic).reduce<
      Prisma.AdminPaymentMessagesCreateManyInput[]
    >((initial, chatId) => {
      const adminPayment = {};

      doubleMessageChatIdDic[chatId].forEach((message) => {
        if (message.forward_date) {
          adminPayment['forwarded_message_id'] = Number(message.message_id);
        } else {
          adminPayment['status_message_id'] = Number(message.message_id);
        }
      });

      adminPayment['payment_id'] = Number(payment_id);
      adminPayment['admin_id'] = Number(doubleMessageChatIdDic[chatId][0].chat.id);
      initial.push(adminPayment as Prisma.AdminPaymentMessagesCreateManyInput);

      return initial;
    }, []);

    return this.prisma.adminPaymentMessages.createMany({
      data: createMessagesInput,
    });
  }

  async adminNotifEdit(message: AdminPymentMessageWithAmin, amount: number, type: 'APPROVE' | 'REJECT' = 'APPROVE') {
    return this.userBot.telegram.editMessageText(
      message.admin_id,
      message.status_message_id,
      undefined,
      `پرداخت ${type === 'APPROVE' ? 'تایید شد' : 'رد شد'} ${`به وسیله @${message.admin.username} ${
        amount > 0 ? `با مبلغ: ${amount} تومان` : ''
      }`}`,
    );
  }

  async packageButtons(): Promise<Markup.Markup<InlineKeyboardMarkup>> {
    const packages = JSON.parse((await this.packageService.getPackageFromCache())!);
    return Markup.inlineKeyboard(
      packages
        .filter((pack) => pack.traffic >= 1)
        .map((pack) => Markup.button.callback(`گیگ ${pack.traffic}`, `id_${pack.id}`)),
      {
        columns: 2,
      },
    );
  }

  async buyPackage(user_id: number, order_id: number): Promise<any> {
    const order = await this.prisma.order.findUnique({
      where: {
        id: order_id,
      },
      include: {
        user: true,
        package: true,
      },
    });

    if (order!.user.credit! >= order!.package.price) {
      await this.prisma.user.update({
        where: {
          id: user_id,
        },
        data: {
          credit: {
            decrement: order!.package.price,
          },
        },
      });

      const config_url = await this.v2rayService.buyPackageArvan(order!.package.id);

      return this.orderService.completeOrder(order!.id, config_url);
    }

    return order;
  }

  async completeInCartOrder(order_id: number) {
    const order = await this.orderService.getInCompleteOrder(order_id);

    if (order!.user.credit! >= order!.package.price) {
      await this.prisma.user.update({
        where: {
          id: order?.user_id,
        },
        data: {
          credit: {
            decrement: order!.package.price,
          },
        },
      });

      const config_url = await this.v2rayService.buyPackageArvan(order?.package.id!);

      return this.orderService.completeOrder(order!.id, config_url);
    }

    return order;
  }

  async showActivePackages(user_id: number): Promise<InlineQueryResult[]> {
    const activeOrders = await this.orderService.getActivePackages(user_id);

    if (activeOrders.length === 0) {
      throw new HttpException('هیچ کانفیگ فعالی نیست 🤕', HttpStatus.NOT_FOUND);
    }

    return activeOrders.map<InlineQueryResult>((pack) => ({
      type: 'article',
      id: pack.id.toString(),
      title: pack.title!,
      description: `بسته سی روزه ${pack.package.traffic} گیگ`,
      input_message_content: {
        message_text: `عنوان: ${pack.title!}\n بسته سی روزه ${
          pack.package.traffic
        } گیگ\n تاریخ فعالسازی: ${this.jalali.toTitle(pack.active_at!)}\nساعت سفارش: ${this.jalali.toTime(
          pack.active_at!,
        )}\n قیمت: ${pack.package.price}  هزار تومان\nکانفیگ:\n<code>${pack.config_url}</code>\n.\n`,
        parse_mode: 'HTML',
      },
      reply_markup: {
        inline_keyboard: [
          [{ text: 'آمار', callback_data: `STATICS_${this.staticsService.extractUUID(pack.config_url!)}` }],
        ],
      },
    }));
  }

  async showInCartPackages(user_id: number): Promise<InlineQueryResult[]> {
    const inCartPackages = await this.orderService.getInCartPackages(user_id);

    if (inCartPackages.length === 0) {
      throw new HttpException('هیچ بسته ای توی سبد خرید نیست 🤕', HttpStatus.NOT_FOUND);
    }

    return inCartPackages.map<InlineQueryResult>((pack) => ({
      type: 'article',
      id: pack.id.toString(),
      title: pack.title || 'بدون عنوان',
      description: `بسته سی روزه ${pack.package.traffic} گیگ`,
      input_message_content: {
        message_text: `عنوان: ${pack.title!}\nبسته سی روز ${
          pack.package.traffic
        } گیگ \nتاریخ سفارش: ${this.jalali.toTitle(pack.created_at)}\nساعت سفارش: ${this.jalali.toTime(
          pack.created_at,
        )}\n.\n`,
        parse_mode: 'HTML',
      },
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'حذف', callback_data: `DELETE_${pack.id}` },
            { text: 'تکمیل', callback_data: `COMPLETE_${pack.id}` },
          ],
        ],
      },
    }));
  }

  async getTestPackage() {
    // await this.orderService.createOrder(user_id, title, this.TestPackageId);
    return this.v2rayService.buyPackageArvan(this.TestPackageId);
  }
}
