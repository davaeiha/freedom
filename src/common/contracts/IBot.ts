import * as Typegram from 'typegram';
import { Context, Markup, Scenes } from 'telegraf';
import { WizardContext } from 'telegraf/typings/scenes';
import { InlineKeyboardMarkup } from 'telegraf/typings/core/types/typegram';

export type TelegrafOnChatMemberJoinType = Context<
  Typegram.Update.MessageUpdate<Typegram.Message.NewChatMembersMessage>
>;
export type TelegrafOnChatMemberLeftType = Context<
  Typegram.Update.MessageUpdate<Typegram.Message.LeftChatMemberMessage>
>;

export type TelegrafOnTextType = Context<Typegram.Update.MessageUpdate<Typegram.Message.TextMessage>>;
export type TelegrafActionType = Context<Typegram.Update.CallbackQueryUpdate<Typegram.CallbackQuery.DataQuery>>;
export type TelegrafInlineQueryType = Context<Typegram.Update.InlineQueryUpdate>

export type TelegrafActionWizardType = TelegrafActionType & WizardContext;
export type TelegrafOnTextWizardType = TelegrafOnTextType & WizardContext;

export type TelegrafOnTextSceneType = TelegrafOnTextType & Scenes.SceneContext;
export type TelegrafActionSceneType = TelegrafActionType & Scenes.SceneContext;

export type InlineKeyboardMarkupType = Markup.Markup<InlineKeyboardMarkup>;
