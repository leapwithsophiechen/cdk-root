#!/usr/bin/env node
import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { Certificates, HostedZone, Pipeline, Stage } from './lib';
import {
  accountIds,
  appName,
  defaultDomainNames,
  deploymentRegions,
  noReplyAdminEmails,
  orgName,
  sentryDSNs,
  sentrySamplingEnabled,
  snsTopics,
  verifiedDomainSourceEmails,
} from './src/_config';
import { EnvNames, Regions } from './src/_types';

const app = new App();

//* Manual deployments
new HostedZone(app, `${appName}--hostedZone--leapwithsophiechen`, {
  domain: defaultDomainNames[EnvNames.DEVELOPMENT].domain,
  env: { account: accountIds[EnvNames.DEVELOPMENT], region: Regions.USE_1 },
});

deploymentRegions.forEach((region) => {
  new Certificates(
    app,
    `${appName}--certificate--leapwithsophiechen--${region.regionId}`,
    {
      domain: defaultDomainNames[EnvNames.DEVELOPMENT].domain,
      env: {
        account: accountIds[EnvNames.DEVELOPMENT],
        region: region.regionName,
      },
      region: region.regionName,
    }
  );
});

//* Deploying 'dev' stage from local dev environment
new Stage(app, `${appName}-`, {
  appName,
  defaultApiSubdomain: defaultDomainNames[EnvNames.DEVELOPMENT].subdomains.api,
  defaultAssetSubdomain:
    defaultDomainNames[EnvNames.DEVELOPMENT].subdomains.assets,
  defaultDomain: defaultDomainNames[EnvNames.DEVELOPMENT].domain,
  defaultGraphqlSubdomain:
    defaultDomainNames[EnvNames.DEVELOPMENT].subdomains.graphql,
  env: {
    account: accountIds[EnvNames.DEVELOPMENT],
    region: Regions.APSE1,
  },
  envName: EnvNames.DEVELOPMENT,
  marketingSubdomain:
    defaultDomainNames[EnvNames.DEVELOPMENT].subdomains.marketing,
  noReplyAdminEmail: noReplyAdminEmails[EnvNames.DEVELOPMENT],
  orgName,
  sentryDSN: sentryDSNs[EnvNames.DEVELOPMENT],
  sentrySamplingEnabled: sentrySamplingEnabled[EnvNames.DEVELOPMENT],
  snsTopics,
  verifiedDomainSourceEmail: verifiedDomainSourceEmails[EnvNames.DEVELOPMENT],
});

//* Deploying 'staging' stage with pipeline
new Pipeline(app, `${appName}--pipeline--${EnvNames.STAGING}`, {
  env: { account: accountIds[EnvNames.STAGING], region: Regions.APSE1 },
  envName: EnvNames.STAGING,
});

//* Deploying 'production' stage with pipeline
new Pipeline(app, `${appName}--pipeline--${EnvNames.PRODUCTION}`, {
  env: { account: accountIds[EnvNames.PRODUCTION], region: Regions.APSE1 },
  envName: EnvNames.PRODUCTION,
});
