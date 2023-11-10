import { Action, Context, Ctx, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { Markup, Scenes } from 'telegraf';
import { TelegrafActionWizardType, TelegrafOnTextWizardType } from '../../common/contracts/IBot';
import { OrderService } from '../../order/order.service';
import { UserBotService } from '../services/user_bot.service';
import { PackageService } from '../../package/package.service';

@Wizard('BuyWizard')
export class BuyWizard {
  constructor(
    private readonly userBotService: UserBotService,
    private readonly orderService: OrderService,
    private readonly packageService: PackageService,
  ) {}

  @WizardStep(1)
  async showMonth(@Context() ctx: Scenes.WizardContext): Promise<void> {
    console.log(ctx.session);
    // if (!ctx.wizard.state['data']) {
    //   console.log(ctx.wizard.step);
    // }
    ctx.wizard.state['data']<Record<string, string>> = {};
    await ctx.deleteMessage();
    const buttons = await this.userBotService.monthButtons();
    await ctx.reply('بسته چند ماهه میخوای؟', buttons);
    ctx.wizard.next();
  }

  @WizardStep(2)
  @Action(new RegExp(/^M\d$/, 'g'))
  async showVolume(@Ctx() ctx: TelegrafActionWizardType): Promise<void> {
    console.log(ctx.session);
    const monthMark: string = ctx.update.callback_query.data;
    ctx.wizard.state['data'].month = monthMark.slice(1);
    const buttons = await this.userBotService.volumeButtons(Number(ctx.wizard.state['data'].month));
    await ctx.deleteMessage();
    await ctx.reply(`چه مقدار حجم(گیگابایت) واسه ${ctx.wizard.state['data'].month} ماه میخوای؟`, buttons);
    ctx.wizard.next();
  }

  @WizardStep(3)
  @Action(new RegExp(/^G\d+$/, 'g'))
  async selectPackage(@Ctx() ctx: TelegrafActionWizardType): Promise<void> {
    console.log(ctx.session);
    const volumeMark = ctx.update.callback_query.data;
    // ctx.wizard.state['data'].volume = volumeMark.slice(1);
    const pack = await this.packageService.getLastPackage(
      Number(ctx.wizard.state['data'].month),
      Number(volumeMark.slice(1)),
    );

    ctx.wizard.state['data'].pack = pack;
    await ctx.deleteMessage();
    await ctx.reply(
      'لطفا یه اسم واسه بسته ای که میخوای تهیه کنی بذار. \n.\n.\n این اسم واسه اینه که بتونی بعدا دسترسی بهتری به بسته ات داشته باشی و هرچیزی هم میتونه باشه مثلا اسم یا لقب کسی که داری براش خرید میکنی.',
    );
    ctx.wizard.next();
  }

  @WizardStep(4)
  @On('text')
  async selectTitle(@Ctx() ctx: TelegrafOnTextWizardType): Promise<void> {
    console.log(ctx.session);
    ctx.wizard.state['data'].title = ctx.update.message.text;
    await ctx.reply(
      `هزینه بسته ${ctx.wizard.state['data'].month} ماهه ${ctx.wizard.state['data'].pack.volume} گیگ , ${ctx.wizard.state['data'].pack.cost} تومان هستش 😉\n`,
      {
        reply_markup: {
          inline_keyboard: [[{ text: 'ثبت سفارش و پرداخت', callback_data: 'ADD_TO_CART' }]],
        },
      },
    );
    ctx.wizard.next();
  }

  @WizardStep(5)
  @Action('ADD_TO_CART')
  async addToCart(@Ctx() ctx: TelegrafActionWizardType): Promise<void> {
    console.log(ctx.session);
    const user_id = ctx.update.callback_query.from.id;
    const { pack, title } = ctx.wizard.state['data'];

    const orderResult = await this.userBotService.buyPackage(Number(user_id), Number(pack.id), title);

    await ctx.deleteMessage();

    if (!orderResult.config_url) {
      await ctx.reply(
        `سفارش شما با شناسه ${orderResult.id} و عنوان <b>${orderResult.title}</b> به سبد خریدتون اضافه شد ولی موجودیتون واسه تکمیل سفارش کافی نبود \nبعد از افزایش موجودی از سبد خرید توی منوی اصلی میتونید سفارشتون رو تکمیل کنید `,
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
