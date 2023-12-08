import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'https://arvanvpn.online/api/graphql',
  documents: ['./graphql/**/*.gql'],
  generates: {
    './src/v2ray/arvan.schema.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-graphql-request', 'typescript-resolvers'],
      config: {
        gqlImport: 'graphql-request#gql',
      },
    },
  },
};

export default config;
