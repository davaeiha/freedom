export type ENV = 'production' | 'staging' | 'development';
export interface Config {
  env: ENV;
  version: string;
  serviceName: string;
  nest: NestConfig;
  cors: CorsConfig;
  swagger: SwaggerConfig;
  graphql: GraphqlConfig;
  security: SecurityConfig;
  minio: MinioConfig;
  telegram: TelegramConfig;
  redis: RedisConfig;
  v2ray: V2rayConfig;
}

export interface NestConfig {
  port: number;
}

export interface CorsConfig {
  enabled: boolean;
}

export interface SwaggerConfig {
  enabled: boolean;
  title: string;
  description: string;
  version: string;
  path: string;
}

export interface GraphqlConfig {
  playgroundEnabled: boolean;
  debug: boolean;
  schemaDestination: string;
  introspection: boolean;
  sortSchema: boolean;
}

export interface SecurityConfig {
  jwtAccessSecret: string;
  jwtRefreshSecret: string;
  expiresIn: string;
  refreshIn: string;
  bcryptSaltOrRound: string | number;
}

export interface MinioConfig {
  endpoint: string;
  port: number;
  rootUser: string;
  rootPassword: string;
  bucket: string;
  region: string;
  request?: string;
}

export interface TelegramConfig {
  user_bot_api_token: string;
  group_bot_api_token: string;
}

export interface RedisConfig {
  url?: string;
  host: string;
  port: number;
  ttl: number;
  db: number;
}

export interface V2rayConfig {
  endpoint: string;
}
