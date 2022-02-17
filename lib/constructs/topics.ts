import { Topic } from 'aws-cdk-lib/aws-sns';
import { Construct } from 'constructs';

interface TopicsProps {
  envName: string;
  snsTopics: Record<string, string>;
}

export class Topics extends Construct {
  //
  constructor(scope: Construct, id: string, props: TopicsProps) {
    super(scope, id);
    //
    const { envName, snsTopics } = props;

    const keys = Object.keys(snsTopics);

    keys.forEach((key) => {
      //
      new Topic(this, key, {
        contentBasedDeduplication: undefined,
        displayName: `${snsTopics[key]}--${envName}`,
        fifo: undefined,
        topicName: `${snsTopics[key]}--${envName}`,
      });
    });
  }
}
