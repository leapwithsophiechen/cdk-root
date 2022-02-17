export const accountIds = {
  dev: '840871995003',
  prd: '840871995003',
  stg: '840871995003',
};

export const appName = 'root';
export const orgName = 'sophiechen';
export const repoName = `client-sophie-chen/cdk-${appName}`;

export const defaultDomainNames = {
  dev: {
    domain: 'leapwithsophiechen.com',
    subdomains: {
      api: 'api-dev',
      assets: 'assets-dev',
      graphql: 'graphql-dev',
      marketing: 'dev',
    },
  },
  prd: {
    domain: 'leapwithsophiechen.com',
    subdomains: {
      api: 'api',
      assets: 'assets',
      graphql: 'graphql',
      marketing: 'dev',
    },
  },
  stg: {
    domain: 'leapwithsophiechen.com',
    subdomains: {
      api: 'api-staging',
      assets: 'assets-staging',
      graphql: 'graphql-staging',
      marketing: 'staging',
    },
  },
};

export const deploymentRegions = [
  { regionId: 'use-1', regionName: 'us-east-1' },
  { regionId: 'apse1', regionName: 'ap-southeast-1' },
];

export const sentryDSNs = {
  dev: 'https://5b6e713d8a574e1689bee67146dbb16a@o1141936.ingest.sentry.io/6200769',
  prd: 'https://5b6e713d8a574e1689bee67146dbb16a@o1141936.ingest.sentry.io/6200769',
  stg: 'https://5b6e713d8a574e1689bee67146dbb16a@o1141936.ingest.sentry.io/6200769',
};

export const sentrySamplingEnabled = {
  dev: false,
  prd: false,
  stg: false,
};

export const verifiedDomainSourceEmails = {
  dev: 'admin@leapwithsophiechen.com',
  prd: 'admin@leapwithsophiechen.com',
  stg: 'admin@leapwithsophiechen.com',
};

export const noReplyAdminEmails = {
  dev: 'noreply@leapwithsophiechen.com',
  prd: 'noreply@leapwithsophiechen.com',
  stg: 'noreply@leapwithsophiechen.com',
};

export const snsTopics = {
  EMAIL_SERVICE: 'email-service',
};

export const emailTemplates = {};
