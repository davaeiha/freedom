import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreatePaymentDto } from './payment.dto';
import { MinioClientService } from '../minio/minio.service';
import { Payment, User } from '@prisma/client';

@Injectable()
export class PaymentService {
  constructor(private readonly prisma: PrismaService, private readonly minio: MinioClientService) {}

  async createPayment(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const { user_id, file_name } = createPaymentDto;
    return this.prisma.payment.create({
      data: {
        user_id,
        file_name,
      },
    });
  }

  async findPayment(payment_id: number) {
    return this.prisma.payment.findUnique({
      where: {
        id: payment_id,
      },
      include: {
        user: true,
      },
    });
  }

  async updatePaymentCredit(admin_id: number, payment_id: number, amount: number, user_id?: number) {
    const updatedPayment = this.prisma.payment.update({
      where: {
        id: payment_id,
      },
      data: {
        amount,
        admin_id,
      },
      include: {
        user: true,
      },
    });

    const updatedUser =
      amount > 0 &&
      this.prisma.user.update({
        where: {
          id: user_id,
        },
        data: {
          credit: {
            increment: amount || 0,
          },
        },
      });

    await (updatedUser
      ? this.prisma.$transaction([updatedPayment, updatedUser])
      : this.prisma.$transaction([updatedPayment]));

    return updatedPayment;
  }

  async rejectPayment(id: number): Promise<void> {
    const deletedPayment = await this.prisma.payment.delete({
      where: {
        id,
      },
      select: {
        file_name: true,
      },
    });

    await this.minio.delete([deletedPayment.file_name]);
  }
}
