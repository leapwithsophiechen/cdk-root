import { Stage as CdkStage, StageProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { EnvNames } from '../src/_types';
import { MainStack } from './mainStack';

interface MainStageProps extends StageProps {
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

export class Stage extends CdkStage {
  //
  constructor(scope: Construct, id: string, props: MainStageProps) {
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

    new MainStack(this, `mainStack--${envName}`, {
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
    });
  }
}
