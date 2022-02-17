import { CreateErrorInput, errorStatusMap } from '_types';

export const createError = ({ message, meta, type }: CreateErrorInput) => ({
  body: JSON.stringify({
    error: {
      message,
      meta,
      type,
    },
  }),
  headers: {
    'Content-Type': 'application/json',
  },
  statusCode: errorStatusMap[type].statusCode,
});
