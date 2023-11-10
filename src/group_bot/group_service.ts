import { Injectable } from '@nestjs/common';
import { Order } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { InjectBot, Start, Use } from 'nestjs-telegraf';
import { dirname } from 'path';
import { Telegraf, Context, Input, Markup } from 'telegraf';

@Injectable()
export class GroupBotService {
  constructor(
    @InjectBot('group_bot') private readonly bot: Telegraf<Context>,
    private readonly prisma: PrismaService,
  ) {}
}
