import { Injectable } from '@nestjs/common';
import { Interval, Timeout } from '@nestjs/schedule';
import { PrismaService } from 'nestjs-prisma';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class PackageService {
  constructor(private readonly prisma: PrismaService, private readonly redis: RedisService) {}

  // async getVolumeOfMonth(month: number) {
  //   return this.prisma.package.groupBy({
  //     by: ['volume'],
  //     where: {
  //       month,
  //       deprecated: false,
  //     },
  //     _max: {
  //       created_at: true,
  //     },
  //     orderBy: {
  //       volume: 'asc',
  //     },
  //   });
  // }

  // async getLastPackage(month: number, volume: number) {
  //   const theLastCreatedOne = await this.prisma.package.aggregate({
  //     where: {
  //       month,
  //       volume,
  //       deprecated: false,
  //     },
  //     _max: {
  //       created_at: true,
  //     },
  //   });

  //   if (!theLastCreatedOne._max.created_at) {
  //     throw new HttpException(`پکیج با ${month} ماه ${volume} گیگ موجود نیست`, HttpStatus.BAD_REQUEST);
  //   }

  //   console.log(theLastCreatedOne);

  //   return this.prisma.package.findUnique({
  //     where: {
  //       month_volume_created_at: {
  //         month,
  //         volume,
  //         created_at: theLastCreatedOne._max.created_at!,
  //       },
  //     },
  //   });
  // }

  @Timeout(1 * 1000)
  async setPackageInCacheTimeOut() {
    const packages = await this.prisma.package.findMany({});
    return this.redis.set('packages', JSON.stringify(packages), 30 * 60 * 1000);
  }

  @Interval(30 * 60 * 1000)
  async setPackageInCacheInterval() {
    const packages = await this.prisma.package.findMany({});
    return this.redis.set('packages', JSON.stringify(packages), 30 * 60 * 1000);
  }

  async getPackageFromCache(): Promise<any> {
    return (await this.redis.get('packages')) || JSON.stringify(await this.prisma.package.findMany({}));
  }

  async getPackageById(pack_id: string) {
    return JSON.parse((await this.getPackageFromCache())!).find((pack) => pack['id'] == pack_id);
  }
}
