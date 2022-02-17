import { Duration, Stack } from 'aws-cdk-lib';
import { Effect, Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { IFunction, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import { join } from 'path';
import { EnvNames } from '../../../_types';

interface Props {
  appName: string;
  envName: string;
  sentryDSN: string;
  sentrySamplingEnabled: boolean;
}

const commonLambdaConfig = {
  bundling: {
    minify: true,
  },
  handler: 'main',
  runtime: Runtime.NODEJS_14_X,
  timeout: Duration.seconds(5),
};

const functionIdentifier = 'api-getCientIp';
const version = '1';

export class ApiGetClientIp extends Construct {
  //
  public readonly lambdaFunction: IFunction;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);
    //
    const accountId = Stack.of(this).account;
    const { region } = Stack.of(this);

    const { appName, envName, sentryDSN, sentrySamplingEnabled } = props;

    const environment = {
      ENV_NAME: envName,
      LOG_LEVEL: envName === EnvNames.DEVELOPMENT ? 'DEBUG' : 'WARN',
      REGION: region,
      SENTRY_DSN: sentryDSN,
      SENTRY_SAMPLE_RATE: envName === EnvNames.PRODUCTION ? '0.01' : '1',
      SENTRY_SAMPLING_ENBALED: sentrySamplingEnabled ? 'True' : 'False',
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

    // const cognitoPolicy = new PolicyStatement({
    //   actions: ['cognito-idp:*'],
    //   effect: Effect.ALLOW,
    //   resources: [
    //     `arn:aws:cognito-idp:${region}:${accountId}:userpool/${poolId}`,
    //   ],
    // });

    // this.lambdaFunction.role?.attachInlinePolicy(
    //   new Policy(this, 'lambdaFunctionPolicy', {
    //     statements: [cognitoPolicy],
    //   })
    // );
  }
}
