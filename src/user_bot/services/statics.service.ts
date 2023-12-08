import { Injectable } from '@nestjs/common';
import { V2rayService } from '../../v2ray/v2ray.service';

@Injectable()
export class StaticsSerivice {
  constructor(private readonly v2rayService: V2rayService) {}

  extractUUID(str: string) {
    // Define a regular expression pattern to match UUIDs
    const uuidPattern = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;

    // Use the match() function to find the first UUID in the string
    const matches = str.match(uuidPattern);

    // Check if a UUID was found
    if (matches && matches.length > 0) {
      return matches[0]; // Return the first matched UUID
    } else {
      return null; // Return null if no UUID was found
    }
  }

  bytesToGB(bytes: number): number {
    const gigabyte = 1024 * 1024 * 1024; // 1 gigabyte = 1024 megabytes * 1024 kilobytes * 1024 bytes
    return bytes / gigabyte;
  }

  roundTo(number: number, decimalPlaces: number) {
    const factor = Math.pow(10, decimalPlaces);
    return Math.round(number * factor) / factor;
  }

  getConsumedTraffic(up: number, down: number): number {
    return this.roundTo(this.bytesToGB(up + down), 1);
  }

  getRemainingDays(expired: number): number {
    const now = new Date();
    const expiredDate = new Date(expired);

    const diff = (expiredDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

    return Math.round(diff);
  }

  async showOrderStatics(config_id: string): Promise<Record<string, number>> {
    const currentStat = (await this.v2rayService.getOrderStatics(config_id)).clientStats[0];
    return {
      totalTraffic: currentStat && this.roundTo(this.bytesToGB(currentStat?.total), 1),
      remainingTraffic: currentStat && this.getConsumedTraffic(currentStat.up, currentStat.down),
      remainingDays:
        currentStat?.expiryTime === 0
          ? false
          : currentStat?.expiryTime && this.getRemainingDays(currentStat?.expiryTime),
    };
  }
}
