import { SecretValue, Stack, StackProps } from 'aws-cdk-lib';
import {
  CodePipeline,
  CodePipelineSource,
  ManualApprovalStep,
  ShellStep,
} from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { GetStoreValue } from '../customResources';
import {
  appName,
  defaultDomainNames,
  noReplyAdminEmails,
  orgName,
  repoName,
  sentryDSNs,
  sentrySamplingEnabled,
  snsTopics,
  verifiedDomainSourceEmails,
} from '../src/_config';
import { EnvNames, GitEnvNames, Regions } from '../src/_types';
import { Stage } from './stage';

interface PipelineProps extends StackProps {
  envName: EnvNames;
}

export class Pipeline extends Stack {
  //
  constructor(scope: Construct, id: string, props: PipelineProps) {
    super(scope, id, props);

    const { envName } = props;

    const accessToken = new GetStoreValue(this, 'accessToken', {
      parameterName: `/github-pat/cdk-${appName}`,
      region: Regions.APSE1,
    });

    const pipeline = new CodePipeline(this, 'pipeline', {
      crossAccountKeys: true,
      dockerEnabledForSynth: true,
      pipelineName: `${appName}--pipeline--${envName}`,
      synth: new ShellStep('synth', {
        commands: ['npm ci', 'npm run build', 'npx cdk synth'],
        input: CodePipelineSource.gitHub(repoName, GitEnvNames[envName], {
          authentication: SecretValue.plainText(accessToken.value),
        }),
      }),
      synthCodeBuildDefaults: {
        buildEnvironment: {
          privileged: true,
        },
      },
    });

    //* Uncomment below after pipelines instantiation

    const pre = [];

    if (envName === EnvNames.PRODUCTION) {
      //
      const manualApproval = new ManualApprovalStep('manualApproval', {
        comment: `cdk-${appName}--pipeline--prd requires manual approval.`,
      });

      pre.push(manualApproval);
    }

    // TODO: Create manual approval notification

    pipeline.addStage(
      new Stage(this, `${appName}-`, {
        appName,
        defaultApiSubdomain: defaultDomainNames[envName].subdomains.api,
        defaultAssetSubdomain: defaultDomainNames[envName].subdomains.assets,
        defaultDomain: defaultDomainNames[envName].domain,
        defaultGraphqlSubdomain: defaultDomainNames[envName].subdomains.graphql,
        envName,
        marketingSubdomain: defaultDomainNames[envName].subdomains.marketing,
        noReplyAdminEmail: noReplyAdminEmails[envName],
        orgName,
        sentryDSN: sentryDSNs[envName],
        sentrySamplingEnabled: sentrySamplingEnabled[envName],
        snsTopics,
        verifiedDomainSourceEmail: verifiedDomainSourceEmails[envName],
      }),
      {
        pre,
      }
    );
  }
}
