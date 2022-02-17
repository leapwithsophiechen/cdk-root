import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { AwsCustomResource, AwsSdkCall } from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';

interface Props {
  parameterName: string;
  region: string;
}

export class GetStoreValue extends AwsCustomResource {
  //
  public readonly value: string;

  constructor(scope: Construct, name: string, props: Props) {
    const { parameterName, region } = props;

    const onUpdateHandler: AwsSdkCall = {
      action: 'getParameter',
      parameters: {
        Name: parameterName,
      },
      physicalResourceId: {
        id: Date.now().toString(),
      },
      region,
      service: 'SSM',
    };

    const policy = new PolicyStatement({
      actions: ['ssm:*'],
      effect: Effect.ALLOW,
      resources: ['arn:aws:ssm:*:*:parameter/*'],
    });

    super(scope, name, {
      onUpdate: onUpdateHandler,
      policy: { statements: [policy] },
    });

    this.value = this.getResponseFieldReference('Parameter.Value').toString();
  }
}
