import { Injectable } from '@nestjs/common';
import { InjectGraphQLClient } from '@golevelup/nestjs-graphql-request';
import { GraphQLClient } from 'graphql-request';
import {
  LoginDocument,
  LoginMutationVariables,
  LoginMutation,
  RefreshTokenDocument,
  RefreshTokenMutation,
  RefreshTokenMutationVariables,
  BuyPackageDocument,
  BuyPackageMutation,
  BuyPackageMutationVariables,
  PackageType,
  ClientStatsDocument,
  ClientStatsQuery,
  ClientStatsQueryVariables,
} from './arvan.schema';
import { RedisService } from '../redis/redis.service';
import { Interval, Timeout } from '@nestjs/schedule';

@Injectable()
export class V2rayService {
  constructor(@InjectGraphQLClient() private readonly client: GraphQLClient, private readonly redis: RedisService) {}

  @Timeout(1000)
  async login(): Promise<void> {
    const arvanUser = await this.client.request<LoginMutation, LoginMutationVariables>(LoginDocument, {
      phone: process.env.ARVAN_USER_PHONE!,
      password: process.env.ARVAN_USER_PASSWORD!,
    });

    this.client.setHeader('Authorization', `Bearer ${arvanUser.login.accessToken}`);
    await this.redis.set('arvan_access_token', arvanUser.login.accessToken);
    await this.redis.set('arvan_refresh_token', arvanUser.login.refreshToken);
  }

  @Interval(10 * 60000)
  async refreshToken(): Promise<void> {
    const token = await this.client.request<RefreshTokenMutation, RefreshTokenMutationVariables>(RefreshTokenDocument, {
      token: await this.redis.get('arvan_refresh_token'),
    });

    this.client.setHeader('Authorization', `Bearer ${token.refreshToken.accessToken}`);
    await this.redis.set('arvan_refresh_token', token.refreshToken.refreshToken);
    await this.redis.set('arvan_access_token', token.refreshToken.accessToken);
  }

  async buyPackageArvan(type: PackageType): Promise<string> {
    return (
      await this.client.request<BuyPackageMutation, BuyPackageMutationVariables>(BuyPackageDocument, {
        type,
      })
    ).buyPackage;
  }

  async getOrderStatics(config_id: string) {
    return this.client.request<ClientStatsQuery, ClientStatsQueryVariables>(ClientStatsDocument, {
      id: config_id,
    });
  }
}
