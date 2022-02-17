import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Tags } from 'aws-cdk-lib';
import { PublicHostedZone } from 'aws-cdk-lib/aws-route53';
import { ParameterTier, StringParameter } from 'aws-cdk-lib/aws-ssm';

interface HostedZoneProps extends StackProps {
  domain: string;
}

export class HostedZone extends Stack {
  //
  constructor(scope: App, id: string, props: HostedZoneProps) {
    super(scope, id, props);

    const { domain } = props;

    const hostedZone = new PublicHostedZone(this, 'hostedZone', {
      zoneName: domain,
    });

    Tags.of(hostedZone).add('cost', 'value');

    new StringParameter(this, 'hostedZoneId', {
      description: 'hostedZoneId',
      parameterName: `/hostedZone/${domain}/hostedZoneId`,
      stringValue: hostedZone.hostedZoneId,
      tier: ParameterTier.STANDARD,
    });

    new StringParameter(this, 'hostedZoneName', {
      description: 'hostedZoneName',
      parameterName: `/hostedZone/${domain}/hostedZoneName`,
      stringValue: hostedZone.zoneName,
      tier: ParameterTier.STANDARD,
    });
  }
}
