import { apigwProxyInt } from '_middlewares';
import { GitEnvNames } from '_types';
import { createError } from '_utils/createError';
import { createSuccess } from '_utils/createSuccess';

import Log from '@dazn/lambda-powertools-logger';
import * as Sentry from '@sentry/serverless';
import {
  APIGatewayProxyEventV2,
  APIGatewayProxyHandlerV2,
  APIGatewayProxyResultV2,
} from 'aws-lambda';
import AWSXRay from 'aws-xray-sdk-core';
import cookie from 'cookie';

//* Environment varibles
const dsn = process.env.SENTRY_DSN;
const envName = process.env.ENV_NAME;
const sentrySamplingEnabled = process.env.SENTRY_SAMPLING_ENBALED;
const tracesSampleRate = process.env.SENTRY_SAMPLE_RATE;

//* Interfaces / types

Sentry.AWSLambda.init({
  dsn,
  environment: GitEnvNames[envName],
  tracesSampleRate:
    sentrySamplingEnabled === 'True' ? parseFloat(tracesSampleRate) : undefined,
});

const fn: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  //
  AWSXRay.setLogger(Log);

  Log.debug('event', { event });

  const { requestContext } = event;
  const { http } = requestContext;
  const { sourceIp } = http;

  try {
    //
    const newCookie = cookie.serialize('ip', sourceIp, {
      domain: '.ipivot.link',
      path: '/',
      // sameSite: 'none',
    });

    return {
      body: sourceIp,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': newCookie,
      },
      statusCode: 200,
    };

    //
  } catch (e) {
    Sentry.captureException(e);
    return createError({
      type: 'InternalServerError',
    });
  }
};

export const main = Sentry.AWSLambda.wrapHandler(apigwProxyInt(fn), {
  captureTimeoutWarning: false,
});
