import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(user_id: number, title: string, package_id: string) {
    return this.prisma.order.create({
      data: {
        user_id,
        title,
        package_id,
      },
      include: {
        user: true,
        package: true,
      },
    });
  }

  async completeOrder(id: number, config_url: string) {
    return this.prisma.order.update({
      where: {
        id,
      },
      data: {
        config_url,
        active_at: new Date(Date.now()),
      },
    });
  }

  async getInCompleteOrder(order_id: number) {
    return this.prisma.order.findUnique({
      where: {
        id: order_id,
        config_url: null,
      },
      include: {
        user: true,
        package: true,
      },
    });
  }

  async getActivePackages(user_id: number) {
    return this.prisma.order.findMany({
      where: {
        user_id,
        NOT: [
          {
            config_url: null,
          },
          {
            title: null,
          },
        ],
      },
      include: {
        package: true,
      },
    });
  }

  async getInCartPackages(user_id: number) {
    return this.prisma.order.findMany({
      where: {
        user_id,
        config_url: null,
      },
      include: {
        package: true,
      },
    });
  }

  async deleteOrder(order_id: number) {
    try {
      return this.prisma.order.delete({
        where: {
          id: order_id,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
