import { App, Stack, StackProps } from 'aws-cdk-lib';
import { DnsValidatedCertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { HostedZone } from 'aws-cdk-lib/aws-route53';
import { ParameterTier, StringParameter } from 'aws-cdk-lib/aws-ssm';
import { GetStoreValue } from '../customResources';
import { Regions } from '../src/_types';

interface CertificateProps extends StackProps {
  domain: string;
  region: string;
}

export class Certificates extends Stack {
  //
  constructor(scope: App, id: string, props: CertificateProps) {
    super(scope, id, props);

    const { domain, region } = props;

    const hostedZone = HostedZone.fromHostedZoneAttributes(this, 'hostedZone', {
      hostedZoneId: new GetStoreValue(this, 'hostedZoneId', {
        parameterName: `/hostedZone/${domain}/hostedZoneId`,
        region: Regions.USE_1,
      }).value,
      zoneName: new GetStoreValue(this, 'hostedZoneName', {
        parameterName: `/hostedZone/${domain}/hostedZoneName`,
        region: Regions.USE_1,
      }).value,
    });

    const certificate = new DnsValidatedCertificate(this, `certificate}`, {
      domainName: domain,
      hostedZone,
      region,
      subjectAlternativeNames: [`*.${domain}`],
    });

    const certificateARN = new StringParameter(
      this,
      'primaryDomainCertificateARN',
      {
        description: 'primaryDomainCertificateARN',
        parameterName: `/certificate/${domain}/certificateARN`,
        stringValue: certificate.certificateArn,
        tier: ParameterTier.STANDARD,
      }
    );

    certificateARN.node.addDependency(certificate);
  }
}
