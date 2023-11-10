import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { GraphQLClient } from 'graphql-request';
import { GraphQLClientRequestHeaders } from 'graphql-request/build/cjs/types';
import { gql } from 'graphql-request';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  BigNumber: { input: any; output: any };
  DateTime: { input: any; output: any };
  JWT: { input: any; output: any };
};

export type Arvan = {
  __typename?: 'Arvan';
  /** Identifies the date and time when the object was created. */
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  nsKeys: Array<Scalars['String']['output']>;
  password: Scalars['String']['output'];
  token?: Maybe<Scalars['String']['output']>;
  tokenExpiredAt?: Maybe<Scalars['DateTime']['output']>;
  /** Identifies the date and time when the object was last updated. */
  updatedAt: Scalars['DateTime']['output'];
};

export type Auth = {
  __typename?: 'Auth';
  /** JWT access token */
  accessToken: Scalars['JWT']['output'];
  /** JWT refresh token */
  refreshToken: Scalars['JWT']['output'];
  user: User;
};

export type BuyPackageInput = {
  type: PackageType;
};

export type ChangePasswordInput = {
  newPassword: Scalars['String']['input'];
  oldPassword: Scalars['String']['input'];
};

export type ClientStat = {
  __typename?: 'ClientStat';
  /** Identifies the date and time when the object was created. */
  createdAt: Scalars['DateTime']['output'];
  down: Scalars['BigNumber']['output'];
  email: Scalars['String']['output'];
  enable: Scalars['Boolean']['output'];
  expiryTime: Scalars['BigNumber']['output'];
  id: Scalars['ID']['output'];
  total: Scalars['BigNumber']['output'];
  up: Scalars['BigNumber']['output'];
  /** Identifies the date and time when the object was last updated. */
  updatedAt: Scalars['DateTime']['output'];
};

export type CreateArvanAccountInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type CreateDomainInput = {
  arvanAccount: Scalars['String']['input'];
  domain: Scalars['String']['input'];
  expiredAt?: InputMaybe<Scalars['String']['input']>;
  serverDomain: Scalars['String']['input'];
};

export type CreateServerInput = {
  domain: Scalars['String']['input'];
  ip: Scalars['String']['input'];
  type: ServerCountry;
};

export type Dns = {
  __typename?: 'Dns';
  cloud: Scalars['Boolean']['output'];
  /** Identifies the date and time when the object was created. */
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  ttl: Scalars['Int']['output'];
  type: Scalars['String']['output'];
  /** Identifies the date and time when the object was last updated. */
  updatedAt: Scalars['DateTime']['output'];
  upstream_https: UpstreamHttps;
  value: Array<DnsValue>;
};

export type DnsValue = {
  __typename?: 'DnsValue';
  country: Scalars['String']['output'];
  ip: Scalars['String']['output'];
  port?: Maybe<Scalars['String']['output']>;
  weight: Scalars['Int']['output'];
};

export type Domain = {
  __typename?: 'Domain';
  arvanSslState: DomainState;
  /** Identifies the date and time when the object was created. */
  createdAt: Scalars['DateTime']['output'];
  domain: Scalars['String']['output'];
  expiredAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  letsEncryptSsl: DomainState;
  nsState: DomainState;
  /** Identifies the date and time when the object was last updated. */
  updatedAt: Scalars['DateTime']['output'];
};

/** Domain state */
export enum DomainState {
  Applied = 'APPLIED',
  Pending = 'PENDING',
}

export type DomainsFiltersInput = {
  arvanSslState?: InputMaybe<DomainState>;
  domain?: InputMaybe<Scalars['String']['input']>;
  letsEncryptSsl?: InputMaybe<DomainState>;
  nsState?: InputMaybe<DomainState>;
};

export type GetClientStatsFiltersInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
};

export type IssueCertInput = {
  domain: Scalars['String']['input'];
};

export type LoginInput = {
  password: Scalars['String']['input'];
  phone: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addArvanAccount: Arvan;
  addDomain: Domain;
  addServer: Server;
  buyPackage: Scalars['String']['output'];
  changePassword: User;
  issueCert: Domain;
  login: Auth;
  refreshToken: Token;
  signup: Auth;
  updateArvanSslStates: Scalars['Boolean']['output'];
  updateIp: Array<Dns>;
  updateLetsEncryptSslStates: Scalars['Boolean']['output'];
  updateNsStates: Scalars['Boolean']['output'];
  updatePort: Dns;
  updateUser: User;
};

export type MutationAddArvanAccountArgs = {
  data: CreateArvanAccountInput;
};

export type MutationAddDomainArgs = {
  data: CreateDomainInput;
};

export type MutationAddServerArgs = {
  data: CreateServerInput;
};

export type MutationBuyPackageArgs = {
  data: BuyPackageInput;
};

export type MutationChangePasswordArgs = {
  data: ChangePasswordInput;
};

export type MutationIssueCertArgs = {
  data: IssueCertInput;
};

export type MutationLoginArgs = {
  data: LoginInput;
};

export type MutationRefreshTokenArgs = {
  token: Scalars['JWT']['input'];
};

export type MutationSignupArgs = {
  data: SignupInput;
};

export type MutationUpdateIpArgs = {
  data: UpdateDnsIpInput;
};

export type MutationUpdatePortArgs = {
  data: UpdateDnsPortInput;
};

export type MutationUpdateUserArgs = {
  data: UpdateUserInput;
};

/** PackageType */
export enum PackageType {
  M1_20G = 'M1_20G',
  M1_40G = 'M1_40G',
  M1_60G = 'M1_60G',
  M1_80G = 'M1_80G',
  M1_100G = 'M1_100G',
  M1_120G = 'M1_120G',
  M1_160G = 'M1_160G',
  M1_200G = 'M1_200G',
  M3_60G = 'M3_60G',
  M3_120G = 'M3_120G',
  M3_180G = 'M3_180G',
  M3_240G = 'M3_240G',
  M3_300G = 'M3_300G',
  M3_360G = 'M3_360G',
  M3_480G = 'M3_480G',
  M3_600G = 'M3_600G',
  M6_120G = 'M6_120G',
  M6_240G = 'M6_240G',
  M6_360G = 'M6_360G',
  M6_480G = 'M6_480G',
  M6_600G = 'M6_600G',
  M6_720G = 'M6_720G',
  M6_960G = 'M6_960G',
  M6_1200G = 'M6_1200G',
}

export type Query = {
  __typename?: 'Query';
  clientStats: Array<ClientStat>;
  domains: Array<Domain>;
  hello: Scalars['String']['output'];
  helloWorld: Scalars['String']['output'];
  me: User;
};

export type QueryClientStatsArgs = {
  filters?: InputMaybe<GetClientStatsFiltersInput>;
};

export type QueryDomainsArgs = {
  filters?: InputMaybe<DomainsFiltersInput>;
};

export type QueryHelloArgs = {
  name: Scalars['String']['input'];
};

/** User role */
export enum Role {
  Admin = 'ADMIN',
  User = 'USER',
}

export type Server = {
  __typename?: 'Server';
  /** Identifies the date and time when the object was created. */
  createdAt: Scalars['DateTime']['output'];
  domain: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  ip: Scalars['String']['output'];
  token: Scalars['String']['output'];
  type: ServerCountry;
  /** Identifies the date and time when the object was last updated. */
  updatedAt: Scalars['DateTime']['output'];
};

/** ServerCountry */
export enum ServerCountry {
  De = 'DE',
  Nl = 'NL',
}

export type SignupInput = {
  firstname?: InputMaybe<Scalars['String']['input']>;
  lastname?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
  phone: Scalars['String']['input'];
};

export type Token = {
  __typename?: 'Token';
  /** JWT access token */
  accessToken: Scalars['JWT']['output'];
  /** JWT refresh token */
  refreshToken: Scalars['JWT']['output'];
};

export type UpdateDnsIpInput = {
  domain: Scalars['String']['input'];
  ip: Scalars['String']['input'];
};

export type UpdateDnsPortInput = {
  domain: Scalars['String']['input'];
  port: Scalars['String']['input'];
};

export type UpdateUserInput = {
  firstname?: InputMaybe<Scalars['String']['input']>;
  lastname?: InputMaybe<Scalars['String']['input']>;
};

/** Upstream Https */
export enum UpstreamHttps {
  Auto = 'auto',
  Default = 'default',
  Http = 'http',
  Https = 'https',
}

export type User = {
  __typename?: 'User';
  /** Identifies the date and time when the object was created. */
  createdAt: Scalars['DateTime']['output'];
  firstname?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastname?: Maybe<Scalars['String']['output']>;
  phone: Scalars['String']['output'];
  role: Role;
  /** Identifies the date and time when the object was last updated. */
  updatedAt: Scalars['DateTime']['output'];
};

export type BuyPackageMutationVariables = Exact<{
  type: PackageType;
}>;

export type BuyPackageMutation = { __typename?: 'Mutation'; buyPackage: string };

export type LoginMutationVariables = Exact<{
  password: Scalars['String']['input'];
  phone: Scalars['String']['input'];
}>;

export type LoginMutation = {
  __typename?: 'Mutation';
  login: {
    __typename?: 'Auth';
    accessToken: any;
    refreshToken: any;
    user: { __typename?: 'User'; id: string; firstname?: string | null; lastname?: string | null };
  };
};

export type RefreshTokenMutationVariables = Exact<{
  token: Scalars['JWT']['input'];
}>;

export type RefreshTokenMutation = {
  __typename?: 'Mutation';
  refreshToken: { __typename?: 'Token'; accessToken: any; refreshToken: any };
};

export type SignUpMutationVariables = Exact<{
  phone: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;

export type SignUpMutation = {
  __typename?: 'Mutation';
  signup: {
    __typename?: 'Auth';
    accessToken: any;
    refreshToken: any;
    user: { __typename?: 'User'; firstname?: string | null; lastname?: string | null; phone: string; role: Role };
  };
};

export type ClientStatsQueryVariables = Exact<{
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
}>;

export type ClientStatsQuery = {
  __typename?: 'Query';
  clientStats: Array<{
    __typename?: 'ClientStat';
    id: string;
    email: string;
    enable: boolean;
    expiryTime: any;
    up: any;
    down: any;
    total: any;
    createdAt: any;
    updatedAt: any;
  }>;
};

export const BuyPackageDocument = gql`
  mutation buyPackage($type: PackageType!) {
    buyPackage(data: { type: $type })
  }
`;
export const LoginDocument = gql`
  mutation login($password: String!, $phone: String!) {
    login(data: { password: $password, phone: $phone }) {
      accessToken
      refreshToken
      user {
        id
        firstname
        lastname
      }
    }
  }
`;
export const RefreshTokenDocument = gql`
  mutation refreshToken($token: JWT!) {
    refreshToken(token: $token) {
      accessToken
      refreshToken
    }
  }
`;
export const SignUpDocument = gql`
  mutation SignUp($phone: String!, $password: String!) {
    signup(data: { password: $password, phone: $phone }) {
      user {
        firstname
        lastname
        phone
        role
      }
      accessToken
      refreshToken
    }
  }
`;
export const ClientStatsDocument = gql`
  query ClientStats($email: String, $id: String) {
    clientStats(filters: { email: $email, id: $id }) {
      id
      email
      enable
      expiryTime
      up
      down
      total
      createdAt
      updatedAt
    }
  }
`;

export type SdkFunctionWrapper = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string,
  operationType?: string,
) => Promise<T>;

const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    buyPackage(
      variables: BuyPackageMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<BuyPackageMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<BuyPackageMutation>(BuyPackageDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'buyPackage',
        'mutation',
      );
    },
    login(variables: LoginMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<LoginMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<LoginMutation>(LoginDocument, variables, { ...requestHeaders, ...wrappedRequestHeaders }),
        'login',
        'mutation',
      );
    },
    refreshToken(
      variables: RefreshTokenMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<RefreshTokenMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<RefreshTokenMutation>(RefreshTokenDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'refreshToken',
        'mutation',
      );
    },
    SignUp(variables: SignUpMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<SignUpMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<SignUpMutation>(SignUpDocument, variables, { ...requestHeaders, ...wrappedRequestHeaders }),
        'SignUp',
        'mutation',
      );
    },
    ClientStats(
      variables?: ClientStatsQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<ClientStatsQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<ClientStatsQuery>(ClientStatsDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'ClientStats',
        'query',
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Arvan: ResolverTypeWrapper<Arvan>;
  Auth: ResolverTypeWrapper<Auth>;
  BigNumber: ResolverTypeWrapper<Scalars['BigNumber']['output']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  BuyPackageInput: BuyPackageInput;
  ChangePasswordInput: ChangePasswordInput;
  ClientStat: ResolverTypeWrapper<ClientStat>;
  CreateArvanAccountInput: CreateArvanAccountInput;
  CreateDomainInput: CreateDomainInput;
  CreateServerInput: CreateServerInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Dns: ResolverTypeWrapper<Dns>;
  DnsValue: ResolverTypeWrapper<DnsValue>;
  Domain: ResolverTypeWrapper<Domain>;
  DomainState: DomainState;
  DomainsFiltersInput: DomainsFiltersInput;
  GetClientStatsFiltersInput: GetClientStatsFiltersInput;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  IssueCertInput: IssueCertInput;
  JWT: ResolverTypeWrapper<Scalars['JWT']['output']>;
  LoginInput: LoginInput;
  Mutation: ResolverTypeWrapper<{}>;
  PackageType: PackageType;
  Query: ResolverTypeWrapper<{}>;
  Role: Role;
  Server: ResolverTypeWrapper<Server>;
  ServerCountry: ServerCountry;
  SignupInput: SignupInput;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Token: ResolverTypeWrapper<Token>;
  UpdateDnsIpInput: UpdateDnsIpInput;
  UpdateDnsPortInput: UpdateDnsPortInput;
  UpdateUserInput: UpdateUserInput;
  UpstreamHttps: UpstreamHttps;
  User: ResolverTypeWrapper<User>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Arvan: Arvan;
  Auth: Auth;
  BigNumber: Scalars['BigNumber']['output'];
  Boolean: Scalars['Boolean']['output'];
  BuyPackageInput: BuyPackageInput;
  ChangePasswordInput: ChangePasswordInput;
  ClientStat: ClientStat;
  CreateArvanAccountInput: CreateArvanAccountInput;
  CreateDomainInput: CreateDomainInput;
  CreateServerInput: CreateServerInput;
  DateTime: Scalars['DateTime']['output'];
  Dns: Dns;
  DnsValue: DnsValue;
  Domain: Domain;
  DomainsFiltersInput: DomainsFiltersInput;
  GetClientStatsFiltersInput: GetClientStatsFiltersInput;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  IssueCertInput: IssueCertInput;
  JWT: Scalars['JWT']['output'];
  LoginInput: LoginInput;
  Mutation: {};
  Query: {};
  Server: Server;
  SignupInput: SignupInput;
  String: Scalars['String']['output'];
  Token: Token;
  UpdateDnsIpInput: UpdateDnsIpInput;
  UpdateDnsPortInput: UpdateDnsPortInput;
  UpdateUserInput: UpdateUserInput;
  User: User;
};

export type ArvanResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Arvan'] = ResolversParentTypes['Arvan'],
> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  nsKeys?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  password?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  token?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tokenExpiredAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AuthResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Auth'] = ResolversParentTypes['Auth'],
> = {
  accessToken?: Resolver<ResolversTypes['JWT'], ParentType, ContextType>;
  refreshToken?: Resolver<ResolversTypes['JWT'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface BigNumberScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigNumber'], any> {
  name: 'BigNumber';
}

export type ClientStatResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ClientStat'] = ResolversParentTypes['ClientStat'],
> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  down?: Resolver<ResolversTypes['BigNumber'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  enable?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  expiryTime?: Resolver<ResolversTypes['BigNumber'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  total?: Resolver<ResolversTypes['BigNumber'], ParentType, ContextType>;
  up?: Resolver<ResolversTypes['BigNumber'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DnsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Dns'] = ResolversParentTypes['Dns'],
> = {
  cloud?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ttl?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  upstream_https?: Resolver<ResolversTypes['UpstreamHttps'], ParentType, ContextType>;
  value?: Resolver<Array<ResolversTypes['DnsValue']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DnsValueResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['DnsValue'] = ResolversParentTypes['DnsValue'],
> = {
  country?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ip?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  port?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  weight?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DomainResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Domain'] = ResolversParentTypes['Domain'],
> = {
  arvanSslState?: Resolver<ResolversTypes['DomainState'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  domain?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  expiredAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  letsEncryptSsl?: Resolver<ResolversTypes['DomainState'], ParentType, ContextType>;
  nsState?: Resolver<ResolversTypes['DomainState'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface JwtScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JWT'], any> {
  name: 'JWT';
}

export type MutationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation'],
> = {
  addArvanAccount?: Resolver<
    ResolversTypes['Arvan'],
    ParentType,
    ContextType,
    RequireFields<MutationAddArvanAccountArgs, 'data'>
  >;
  addDomain?: Resolver<ResolversTypes['Domain'], ParentType, ContextType, RequireFields<MutationAddDomainArgs, 'data'>>;
  addServer?: Resolver<ResolversTypes['Server'], ParentType, ContextType, RequireFields<MutationAddServerArgs, 'data'>>;
  buyPackage?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    RequireFields<MutationBuyPackageArgs, 'data'>
  >;
  changePassword?: Resolver<
    ResolversTypes['User'],
    ParentType,
    ContextType,
    RequireFields<MutationChangePasswordArgs, 'data'>
  >;
  issueCert?: Resolver<ResolversTypes['Domain'], ParentType, ContextType, RequireFields<MutationIssueCertArgs, 'data'>>;
  login?: Resolver<ResolversTypes['Auth'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'data'>>;
  refreshToken?: Resolver<
    ResolversTypes['Token'],
    ParentType,
    ContextType,
    RequireFields<MutationRefreshTokenArgs, 'token'>
  >;
  signup?: Resolver<ResolversTypes['Auth'], ParentType, ContextType, RequireFields<MutationSignupArgs, 'data'>>;
  updateArvanSslStates?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  updateIp?: Resolver<
    Array<ResolversTypes['Dns']>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateIpArgs, 'data'>
  >;
  updateLetsEncryptSslStates?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  updateNsStates?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  updatePort?: Resolver<ResolversTypes['Dns'], ParentType, ContextType, RequireFields<MutationUpdatePortArgs, 'data'>>;
  updateUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'data'>>;
};

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query'],
> = {
  clientStats?: Resolver<Array<ResolversTypes['ClientStat']>, ParentType, ContextType, Partial<QueryClientStatsArgs>>;
  domains?: Resolver<Array<ResolversTypes['Domain']>, ParentType, ContextType, Partial<QueryDomainsArgs>>;
  hello?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<QueryHelloArgs, 'name'>>;
  helloWorld?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  me?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
};

export type ServerResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Server'] = ResolversParentTypes['Server'],
> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  domain?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  ip?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ServerCountry'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TokenResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Token'] = ResolversParentTypes['Token'],
> = {
  accessToken?: Resolver<ResolversTypes['JWT'], ParentType, ContextType>;
  refreshToken?: Resolver<ResolversTypes['JWT'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User'],
> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  firstname?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastname?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phone?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  role?: Resolver<ResolversTypes['Role'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Arvan?: ArvanResolvers<ContextType>;
  Auth?: AuthResolvers<ContextType>;
  BigNumber?: GraphQLScalarType;
  ClientStat?: ClientStatResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Dns?: DnsResolvers<ContextType>;
  DnsValue?: DnsValueResolvers<ContextType>;
  Domain?: DomainResolvers<ContextType>;
  JWT?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Server?: ServerResolvers<ContextType>;
  Token?: TokenResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};
