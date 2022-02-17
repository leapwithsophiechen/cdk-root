/* eslint-disable max-len */
import {
  CorsHttpMethod,
  DomainName,
  HttpApi,
  HttpStage,
  IHttpApi,
} from '@aws-cdk/aws-apigatewayv2-alpha';
import { RemovalPolicy, Stack } from 'aws-cdk-lib';
import { CfnApiMapping, CfnStage } from 'aws-cdk-lib/aws-apigatewayv2';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { CfnRecordSet } from 'aws-cdk-lib/aws-route53';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';
import { GetStoreValue } from '../../customResources';
import { EnvNames, Region, Regions } from '../../src/_types';

interface ApiProps {
  allowOrigins: string[];
  devLocalhostPort?: string;
  domain: string;
  envName: EnvNames;
  subdomain: string;
}

export class Api extends Construct {
  //
  public readonly httpApi: IHttpApi;

  constructor(scope: Construct, id: string, props: ApiProps) {
    super(scope, id);
    //
    const { allowOrigins, devLocalhostPort, domain, envName, subdomain } =
      props;

    const region = Stack.of(this).region as Region;

    // //* Retrieve ssl cert
    const certificate = Certificate.fromCertificateArn(
      this,
      'certificate',
      new GetStoreValue(this, 'certificateARN', {
        parameterName: `/certificate/${domain}/certificateARN`,
        region,
      }).value
    );

    const allowHeaders = [
      'authorization',
      'access-token',
      'content-type',
      'x-amz-date',
      'x-api-key',
      'x-amz-security-token',
      'x-amz-user-agent',
      'x-requested-with',
      'Set-Cookie',
    ];

    const allowMethods = [
      CorsHttpMethod.OPTIONS,
      CorsHttpMethod.POST,
      CorsHttpMethod.GET,
      CorsHttpMethod.PUT,
      CorsHttpMethod.PATCH,
      CorsHttpMethod.DELETE,
    ];

    const combinedAllowOrigins = [...allowOrigins];

    if (envName === EnvNames.DEVELOPMENT && devLocalhostPort) {
      combinedAllowOrigins.push(`http://localhost:${devLocalhostPort}`);
    }

    this.httpApi = new HttpApi(this, 'HttpApi', {
      apiName: `${subdomain}.${domain}`,
      corsPreflight: {
        allowCredentials: true,
        allowHeaders,
        allowMethods,
        allowOrigins: combinedAllowOrigins,
        exposeHeaders: ['Set-Cookie'],
      },
    });

    this.httpApi.applyRemovalPolicy(RemovalPolicy.DESTROY);

    const customApiDomainName = new DomainName(this, 'domainName', {
      certificate,
      domainName: `${subdomain}.${domain}`,
    });

    if (envName === EnvNames.DEVELOPMENT || envName === EnvNames.STAGING) {
      const logGroup = new LogGroup(this, 'logGroup', {
        logGroupName: `${subdomain}.${domain}`,
        retention: RetentionDays.ONE_DAY,
      });

      logGroup.applyRemovalPolicy(RemovalPolicy.DESTROY);

      const stage = new CfnStage(this, 'stage', {
        accessLogSettings: {
          destinationArn: logGroup.logGroupArn,
          format:
            '{ "apiId": "$context.apiId", "awsEndpointRequestId": "$context.awsEndpointRequestId", "domainName": "$context.domainName", "httpMethod": "$context.httpMethod", "identitySourceIp": "$context.identity.sourceIp", "integrationLatency": "$context.integrationLatency", "integrationStatus": "$context.integrationStatus", "path": "$context.path", "requestId": "$context.requestId", "requestTimeEpoch": "$context.requestTimeEpoch", "responseLatency": "$context.responseLatency", "responseLength": "$context.responseLength", "x-correlation-id": "$context.awsEndpointRequestId", "integrationErrorMessage": "$context.integrationErrorMessage" }',
        },
        apiId: this.httpApi.httpApiId,
        autoDeploy: true,
        defaultRouteSettings: {
          detailedMetricsEnabled: true,
          throttlingBurstLimit: 1000,
          throttlingRateLimit: 1000,
        },
        stageName: envName,
      });

      stage.node.addDependency(logGroup);
    }

    if (envName === EnvNames.PRODUCTION) {
      new HttpStage(this, 'stage', {
        httpApi: this.httpApi,
        stageName: envName,
      });
    }

    const apiMapping = new CfnApiMapping(this, 'apiMapping', {
      apiId: this.httpApi.httpApiId,
      domainName: `${subdomain}.${domain}`,
      stage: envName,
    });

    apiMapping.node.addDependency(customApiDomainName);

    const recordSet = new CfnRecordSet(this, 'recordSet', {
      aliasTarget: {
        dnsName: customApiDomainName.regionalDomainName,
        evaluateTargetHealth: true,
        hostedZoneId: customApiDomainName.regionalHostedZoneId,
      },
      hostedZoneId: new GetStoreValue(this, 'hostedZoneId', {
        parameterName: `/hostedZone/${domain}/hostedZoneId`,
        region: Regions.USE_1,
      }).value,
      name: `${subdomain}.${domain}`,
      region,
      setIdentifier: region,
      type: 'A',
    });

    recordSet.node.addDependency(apiMapping);

    new StringParameter(this, 'apiId', {
      parameterName: `/api/${subdomain}.${domain}/${envName}/apiId`,
      stringValue: this.httpApi.httpApiId,
    });
  }
}
