import { emailTemplates } from '_config';
import { GitEnvNames, Regions } from '_types';
import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
import Log from '@dazn/lambda-powertools-logger';
import * as Sentry from '@sentry/serverless';
import { SNSHandler } from 'aws-lambda';
import AWSXRay from 'aws-xray-sdk-core';
import ejs from 'ejs';
import { createTemplate } from './createTemplate';
import { generateParams } from './generateParams';

//* Environment variables
const dsn = process.env.SENTRY_DSN;
const emailAssetsUrl = process.env.EMAIL_ASSETS_URL;
const envName = process.env.ENV_NAME;
const noReplyAdminEmail = process.env.NO_REPLY_ADMIN_EMAIL;
const sentrySamplingEnabled = process.env.SENTRY_SAMPLING_ENBALED;
const tracesSampleRate = process.env.SENTRY_SAMPLE_RATE;
const verifiedDomainSourceEmail = process.env.VERIFIED_DOMAIN_SOURCE_EMAIL;

//* Interfaces / types
Sentry.AWSLambda.init({
  dsn,
  environment: GitEnvNames[envName],
  tracesSampleRate:
    sentrySamplingEnabled === 'True' ? parseFloat(tracesSampleRate) : undefined,
});

interface ParsedRecord {
  payload: Record<string, string>;
  templateName: keyof typeof emailTemplates;
}

const sesClient = AWSXRay.captureAWSv3Client(
  new SESClient({ region: Regions.USE_1 })
);

const fn: SNSHandler = async (event) => {
  //
  AWSXRay.setLogger(Log);

  const stringifiedPayload = event.Records[0].Sns.Message;

  const parsedRecord = JSON.parse(stringifiedPayload);

  const { payload, templateName } = parsedRecord as ParsedRecord;

  const template = createTemplate(templateName);

  if (payload.email && template) {
    //
    const { email, subject } = payload;

    const html = ejs.render(template, {
      emailAssetsUrl,
      templateValues: payload,
    });

    const emailParams = generateParams({
      ccAdd: [],
      html,
      replyAdd: [noReplyAdminEmail],
      source: verifiedDomainSourceEmail,
      subject: subject,
      toAdd: [email],
    });

    try {
      //
      await sesClient.send(new SendEmailCommand(emailParams));
      //
    } catch (e) {
      //
      //* Non specific exception handling
      Sentry.captureException(e);
    }
  }
};

export const main = Sentry.AWSLambda.wrapHandler(fn);
