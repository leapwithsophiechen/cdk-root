import correlationIds from '@dazn/lambda-powertools-middleware-correlation-ids';
import logTimeout from '@dazn/lambda-powertools-middleware-log-timeout';
import sampleLogging from '@dazn/lambda-powertools-middleware-sample-logging';
import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import httpEventNormalizer from '@middy/http-event-normalizer';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { supplementCsv } from './supplmentCsv';

const AWS_REGION = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION;
const FUNCTION_NAME = process.env.AWS_LAMBDA_FUNCTION_NAME;
const FUNCTION_VERSION = process.env.AWS_LAMBDA_FUNCTION_VERSION;
const ENV = process.env.ENVIRONMENT || process.env.STAGE;

if (process.env.DATADOG_PREFIX === undefined) {
  process.env.DATADOG_PREFIX = `${FUNCTION_NAME}.`;
}

process.env.DATADOG_TAGS = supplementCsv({
  additional: {
    awsRegion: AWS_REGION,
    environment: ENV,
    functionName: FUNCTION_NAME,
    functionVersion: FUNCTION_VERSION,
  },
  existing: process.env.DATADOG_TAGS,
});

export const apigwProxyInt = (handler: APIGatewayProxyHandlerV2) =>
  middy(handler)
    .use(correlationIds({ sampleDebugLogRate: 0.01 }))
    .use(sampleLogging({ sampleRate: 0.01 }))
    .use(logTimeout())
    .use(httpEventNormalizer())
    .use(httpErrorHandler());
