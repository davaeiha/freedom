import { Module } from '@nestjs/common';
import { PackageService } from './package.service';
import { RedisModule } from '../redis/redis.module';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [RedisModule,OrderModule],
  providers: [PackageService],
  exports: [PackageService],
})
export class PackageModule {}
