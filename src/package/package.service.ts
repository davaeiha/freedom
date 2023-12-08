import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Interval, Timeout } from '@nestjs/schedule';
import { Package } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class PackageService {
  constructor(private readonly prisma: PrismaService, private readonly redis: RedisService) {}

  async getMonth() {
    return (
      await this.prisma.package.findMany({
        distinct: ['month'],
        where: {
          deprecated: false,
        },
        select: {
          month: true,
        },
      })
    ).map((item) => item.month);
  }

  async getVolumeOfMonth(month: number) {
    return this.prisma.package.groupBy({
      by: ['volume'],
      where: {
        month,
        deprecated: false,
      },
      _max: {
        created_at: true,
      },
      orderBy: {
        volume: 'asc',
      },
    });
  }

  async getLastPackage(month: number, volume: number) {
    const theLastCreatedOne = await this.prisma.package.aggregate({
      where: {
        month,
        volume,
        deprecated: false,
      },
      _max: {
        created_at: true,
      },
    });

    if (!theLastCreatedOne._max.created_at) {
      throw new HttpException(`پکیج با ${month} ماه ${volume} گیگ موجود نیست`, HttpStatus.BAD_REQUEST);
    }

    console.log(theLastCreatedOne);

    return this.prisma.package.findUnique({
      where: {
        month_volume_created_at: {
          month,
          volume,
          created_at: theLastCreatedOne._max.created_at!,
        },
      },
    });
  }

  @Timeout(1 * 1000)
  async setMonthInCache() {
    const months = await this.getMonth();
    return this.redis.set('months', JSON.stringify(months));
  }

  @Interval(60 * 60 * 1000)
  async setMonthInCacheEveryMiniute() {
    const months = await this.getMonth();
    return this.redis.set('months', JSON.stringify(months));
  }

  async getMonthFromCache(): Promise<string | undefined> {
    return this.redis.get('months');
  }
}
