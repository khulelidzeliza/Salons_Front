import { CodegenConfig } from '@graphql-codegen/cli';
// process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

const config: CodegenConfig = {
  schema: 'https://localhost:7240/graphql/',
  documents: ['src/**/*.graphql'],
  generates: {
    './src/generated/graphql.ts': {
      preset : undefined,
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-apollo-angular',
      ],
      config: {
        enumsAsTypes: true,
          scalars: {
          DateTime: 'string',  
        },

      },
    },
  },
};

export default config;