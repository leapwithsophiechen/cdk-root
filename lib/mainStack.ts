import {
  HttpMethod,
  HttpRoute,
  HttpRouteKey,
} from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import { Stack as CdkStack, StackProps as CdkStackProps } from 'aws-cdk-lib';
import { HttpMethods } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { EnvNames } from '../src/_types';
import { ApiGetClientIp, SnsEmailService } from '../src/functions/v1';
import { Api, Distribution, Topics } from './constructs';

interface StackProps extends CdkStackProps {
  appName: string;
  defaultApiSubdomain: string;
  defaultAssetSubdomain: string;
  defaultDomain: string;
  defaultGraphqlSubdomain: string;
  envName: EnvNames;
  marketingSubdomain: string;
  noReplyAdminEmail: string;
  orgName: string;
  sentryDSN: string;
  sentrySamplingEnabled: boolean;
  snsTopics: Record<string, string>;
  verifiedDomainSourceEmail: string;
}

export class MainStack extends CdkStack {
  //
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const {
      appName,
      defaultApiSubdomain,
      defaultAssetSubdomain,
      defaultDomain,
      defaultGraphqlSubdomain,
      envName,
      marketingSubdomain,
      noReplyAdminEmail,
      orgName,
      sentryDSN,
      sentrySamplingEnabled,
      snsTopics,
      verifiedDomainSourceEmail,
    } = props;

    //* Asset distribution
    new Distribution(this, 'assetsDist', {
      allowedMethods: [HttpMethods.PUT, HttpMethods.POST, HttpMethods.GET],
      appName,
      domain: defaultDomain,
      envName,
      orgName,
      subdomain: defaultAssetSubdomain,
    });

    //* Api
    const api = new Api(this, 'api', {
      allowOrigins: [`https://${marketingSubdomain}.${defaultDomain}`],
      devLocalhostPort: '3000',
      domain: defaultDomain,
      envName,
      subdomain: defaultApiSubdomain,
    });

    //* Topics
    const topics = new Topics(this, 'topics', {
      envName,
      snsTopics: snsTopics,
    });

    const emailService = new SnsEmailService(this, 'snsEmailService', {
      appName,
      defaultAssetSubdomain,
      defaultDomain,
      envName,
      noReplyAdminEmail,
      sentryDSN,
      sentrySamplingEnabled,
      verifiedDomainSourceEmail,
    });

    emailService.node.addDependency(topics);

    new HttpRoute(this, `GET services/ip`, {
      httpApi: api.httpApi,
      integration: new HttpLambdaIntegration(
        'lambdaIntegration',
        new ApiGetClientIp(this, 'apiGetClientIp', {
          appName,
          envName,
          sentryDSN,
          sentrySamplingEnabled,
        }).lambdaFunction
      ),
      routeKey: HttpRouteKey.with('/v1/services/ip', HttpMethod.GET),
    });
  }
}
