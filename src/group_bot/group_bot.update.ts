import { Action, Ctx, InjectBot, Next, On, Start, Update, Use } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { PrismaService } from 'nestjs-prisma';
import { TelegrafOnChatMemberJoinType, TelegrafOnChatMemberLeftType } from '../common/contracts/IBot';

@Update()
export class GroupBotUpdate {
  constructor(private prisma: PrismaService) {}

  @On('new_chat_members')
  async registerNewUser(@Ctx() ctx: TelegrafOnChatMemberJoinType) {
    await this.prisma.user.create({
      data: {
        id: Number(ctx.update.message.new_chat_members[0].id),
        name: ctx.update.message.new_chat_members[0].first_name,
        username: ctx.update.message.new_chat_members[0].username,
      },
    });
  }

  @On('left_chat_member')
  async deleteUser(@Ctx() ctx: TelegrafOnChatMemberLeftType) {
    await this.prisma.user.delete({
      where: {
        id: Number(ctx.update.message.left_chat_member.id),
      },
    });
  }
}
