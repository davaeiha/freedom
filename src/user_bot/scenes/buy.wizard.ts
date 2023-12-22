import { Action, Context, Ctx, Next, On, Use, Wizard, WizardStep } from 'nestjs-telegraf';
import { Scenes } from 'telegraf';
import { TelegrafActionWizardType, TelegrafOnTextWizardType } from '../../common/contracts/IBot';
import { OrderService } from '../../order/order.service';
import { UserBotService } from '../services/user_bot.service';
import { PackageService } from '../../package/package.service';
import { NextFunction } from 'express';

@Wizard('BuyWizard')
export class BuyWizard {
  constructor(
    private readonly userBotService: UserBotService,
    private readonly orderService: OrderService,
    private readonly packageService: PackageService,
  ) {}

  @Use()
  async buyMiddleware(@Ctx() ctx: any, @Next() next: NextFunction) {
    if (ctx.update.message !== undefined && ctx.update.message.text === 'منو اصلی') {
      await ctx.scene.leave();
      await this.userBotService.mainMenuMessage(ctx);
    }
    return next();
  }

  @WizardStep(1)
  async showPackages(@Context() ctx: Scenes.WizardContext): Promise<void> {
    ctx.wizard.state['data']<Record<string, any>> = {};
    await ctx.deleteMessage();
    const buttons = await this.userBotService.packageButtons();
    await ctx.reply('کدوم بسته رو میخوای؟\n.\n.\n.\nهمه بسته ها به مدت سی روز و بدون محدودیت کاربر هستش 👇', buttons);
    ctx.wizard.next();
  }

  @WizardStep(2)
  @Action(new RegExp(/^id_+/, 'g'))
  async showPrice(@Ctx() ctx: TelegrafActionWizardType) {
    const packId = ctx.update.callback_query.data.slice(3);
    const pack = await this.packageService.getPackageById(packId);
    ctx.wizard.state['data'].pack = pack;
    await ctx.deleteMessage();
    await ctx.reply(
      `هزینه بسته سی روزه ${pack.traffic} گیگ ${pack.price}هزار تومنه.\n.\n.\n.\n لطفا اگر قصد خرید داری یه اسم واسه سفارشت بذار این اسم واسه اینه که بتونی بعدا دسترسی بهتری به بسته ات داشته باشی و هرچیزی هم میتونه باشه مثلا اسم یا لقب کسی که داری براش خرید میکنی 👇`,
    );
    ctx.wizard.next();
  }

  @WizardStep(3)
  @On('text')
  async selectTitle(@Ctx() ctx: TelegrafOnTextWizardType): Promise<void> {
    const order = await this.orderService.createOrder(
      ctx.update.message.from.id,
      ctx.update.message.text,
      ctx.wizard.state['data'].pack.id,
    );

    ctx.wizard.state['data'].order = order;

    await ctx.reply(`سفارش شما با شناسه ${order.id} و عنوان <b>${order.title}</b> به سبد خریدتون اضافه شد 😇`, {
      reply_markup: {
        inline_keyboard: [[{ text: 'ثبت سفارش و پرداخت', callback_data: 'ADD_TO_CART' }]],
      },
      parse_mode: 'HTML',
    });
    ctx.wizard.next();
  }

  @WizardStep(4)
  @Action('ADD_TO_CART')
  async addToCart(@Ctx() ctx: TelegrafActionWizardType): Promise<void> {
    const user_id = ctx.update.callback_query.from.id;

    const orderResult = await this.userBotService.buyPackage(Number(user_id), ctx.wizard.state['data'].order.id);

    await ctx.deleteMessage();

    if (!orderResult.config_url) {
      await ctx.reply(
        `متاسفانه موجودیتون واسه پرداخت هزینه بسته کافی نیست.☹️\n.\n.\n.\n بعد از افزایش موجودی میتونید از طریق منو اصلی و سبد خرید سفارشتون رو تکمیل کنید`,
        {
          reply_markup: {
            inline_keyboard: [[{ text: 'افزایش موجودی', callback_data: 'CHARGE' }]],
          },
          parse_mode: 'HTML',
        },
      );
    } else {
      await ctx.reply(
        `تبریک👏🎉\n سفارش شما با شناسه ${orderResult.id} و عنوان ${orderResult.title} تکمیل شد.\n از منوی اصلی قسمت کانفیگ های فعال میتونی آمار بسته رو داشته باشی😎 \n.\n.\n کانفیگ شما این پایین هستش(بزن روش کپی میشه) :\n <code>${orderResult.config_url}</code>`,
        {
          parse_mode: 'HTML',
        },
      );
    }

    await ctx.scene.leave();
  }
}
