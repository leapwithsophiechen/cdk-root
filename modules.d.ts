declare namespace NodeJS {
  interface ProcessEnv {
    ACCOUNT_ID: string;
    ADMIN_URL: string;
    APP_NAME: string;
    DOMAIN: string;
    EMAIL_ASSETS_URL: string;
    ENV_NAME: 'dev' | 'stg' | 'prd';
    NO_REPLY_ADMIN_EMAIL: string;
    ORG_NAME: string;
    REGION: string;
    SENTRY_SAMPLE_RATE: string;
    SENTRY_SAMPLING_ENBALED: string;
    STAGE: 'dev' | 'stg' | 'prd';
    VERIFIED_DOMAIN_SOURCE_EMAIL: string;
  }
}

declare module '@dazn/lambda-powertools-http-client';
declare module '@dazn/lambda-powertools-middleware-log-timeout';
declare module '@dazn/lambda-powertools-middleware-sample-logging';
