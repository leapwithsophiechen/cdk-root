import { CreateSuccessInput, successStatusMap } from '_types';

export const createSuccess = ({ message, meta, type }: CreateSuccessInput) => ({
  body: JSON.stringify({
    success: {
      message,
      meta,
      type,
    },
  }),
  headers: {
    'Content-Type': 'application/json',
  },
  statusCode: successStatusMap[type].statusCode,
});
