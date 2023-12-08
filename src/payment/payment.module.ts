import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { MinioClientModule } from '../minio/minio.module';

@Module({
  imports: [MinioClientModule],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
