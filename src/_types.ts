export enum Regions {
  APSE1 = 'ap-southeast-1',
  USE_1 = 'us-east-1',
}

export enum EnvNames {
  DEVELOPMENT = 'dev',
  PRODUCTION = 'prd',
  STAGING = 'stg',
}

export enum GitEnvNames {
  dev = 'dev',
  prd = 'production',
  stg = 'staging',
}

export type Region = 'us-east-1' | 'ap-southeast-1';

export const successStatusMap = {
  Accepted: { statusCode: 202 },
  Created: { statusCode: 201 },
  NoContent: { statusCode: 204 },
  OK: { statusCode: 200 },
};

export const errorStatusMap = {
  AliasExistsException: { statusCode: 400 },
  InternalServerError: { statusCode: 509 },
  NotFound: { statusCode: 404 },
  Unauthorized: { statusCode: 401 },
  UsernameExistsException: { statusCode: 400 },
};

export interface CreateSuccessInput {
  message?: string;
  meta?: Record<string, any>;
  type: keyof typeof successStatusMap;
}

export interface CreateErrorInput {
  message?: string;
  meta?: Record<string, any>;
  type: keyof typeof errorStatusMap;
}
