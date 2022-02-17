import { Duration, Stack } from 'aws-cdk-lib';
import { Effect, Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { IFunction, Runtime } from 'aws-cdk-lib/aws-lambda';
import { SnsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { Construct } from 'constructs';
import { join } from 'path';
import { EnvNames } from '../../../_types';

interface Props {
  appName: string;
  defaultAssetSubdomain: string;
  defaultDomain: string;
  envName: string;
  noReplyAdminEmail: string;
  sentryDSN: string;
  sentrySamplingEnabled: boolean;
  verifiedDomainSourceEmail: string;
}

const commonLambdaConfig = {
  bundling: {
    minify: true,
  },
  handler: 'main',
  runtime: Runtime.NODEJS_14_X,
  timeout: Duration.seconds(5),
};

const functionIdentifier = 'sns-emailService';
const version = '1';

export class SnsEmailService extends Construct {
  //
  public readonly lambdaFunction: IFunction;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);
    //
    const accountId = Stack.of(this).account;
    const { region } = Stack.of(this);

    const {
      appName,
      defaultAssetSubdomain,
      defaultDomain,
      envName,
      noReplyAdminEmail,
      sentryDSN,
      sentrySamplingEnabled,
      verifiedDomainSourceEmail,
    } = props;

    const environment = {
      EMAIL_ASSETS_URL: `https://${defaultAssetSubdomain}.${defaultDomain}/branding/`,
      ENV_NAME: envName,
      LOG_LEVEL: envName === EnvNames.DEVELOPMENT ? 'DEBUG' : 'WARN',
      NO_REPLY_ADMIN_EMAIL: noReplyAdminEmail,
      REGION: region,
      SENTRY_DSN: sentryDSN,
      SENTRY_SAMPLE_RATE: envName === EnvNames.PRODUCTION ? '0.01' : '1',
      SENTRY_SAMPLING_ENBALED: sentrySamplingEnabled ? 'True' : 'False',
      VERIFIED_DOMAIN_SOURCE_EMAIL: verifiedDomainSourceEmail,
    };

    this.lambdaFunction = new NodejsFunction(this, `lambdaFunction`, {
      entry: join(__dirname, 'handler.ts'),
      environment,
      functionName: `${appName}--${functionIdentifier}--${envName}--v${version}`,
      logRetention:
        envName === EnvNames.PRODUCTION
          ? RetentionDays.ONE_WEEK
          : RetentionDays.ONE_DAY,
      memorySize: 1024,
      ...commonLambdaConfig,
    });

    const topic = Topic.fromTopicArn(
      this,
      'topic',
      `arn:aws:sns:${region}:${accountId}:email-service--${envName}`
    );

    this.lambdaFunction.addEventSource(new SnsEventSource(topic));

    const sesPolicy = new PolicyStatement({
      actions: ['ses:SendEmail', 'ses:SendRawEmail'],
      effect: Effect.ALLOW,
      resources: ['*'],
    });

    this.lambdaFunction.role?.attachInlinePolicy(
      new Policy(this, 'lambdaFunctionPolicy', {
        statements: [sesPolicy],
      })
    );
  }
}
