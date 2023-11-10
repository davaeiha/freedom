import { Markup } from 'telegraf';
import { InlineKeyboardMarkup } from 'telegraf/typings/core/types/typegram';


export const menuButtons = (): Markup.Markup<InlineKeyboardMarkup> => {
  return Markup.inlineKeyboard(
    [
      Markup.button.callback('موجودی 💰', 'CREDIT'),
      Markup.button.callback('خرید 💵', 'BUY'),
      Markup.button.callback('افزایش موجودی 💸 ', 'CHARGE'),
      Markup.button.callback('تست 🧪', 'test'),
      Markup.button.switchToCurrentChat('سبد خرید 🛒', '#cart'),
      Markup.button.switchToCurrentChat('کانفیگ های فعال 🟢', '#active'),
    ],
    {
      columns: 2,
    },
  );
};
