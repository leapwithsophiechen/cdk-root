import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { AwsCustomResource, AwsSdkCall } from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';

interface Props {
  overwrite?: boolean;
  parameterName: string;
  parameterValue: string;
  region: string;
  tags?: {
    Key: string;
    Value: string;
  }[];
  tier: 'Standard' | 'Advanced' | 'Intelligent-Tiering';
  type: 'String' | 'StringList' | 'SecureString';
}

export class PutStoreValue extends AwsCustomResource {
  //
  public readonly data: {
    Tier: string;
    Version: number;
  };

  constructor(scope: Construct, name: string, props: Props) {
    const {
      overwrite,
      parameterName,
      parameterValue,
      region,
      tags,
      tier,
      type,
    } = props;

    const onUpdateHandler: AwsSdkCall = {
      action: 'putParameter',
      parameters: {
        Name: parameterName,
        Overwrite: overwrite || false,
        Tags: tags,
        Tier: tier,
        Type: type,
        Value: parameterValue,
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

    this.data = this.getResponseFieldReference('Parameter').toJSON();
  }
}
