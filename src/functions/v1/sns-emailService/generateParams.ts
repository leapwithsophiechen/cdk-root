interface Params {
  ccAdd: string[];
  html: string;
  replyAdd?: string[];
  source: string;
  subject: string;
  toAdd: string[];
}

export const generateParams = (params: Params) => {
  const { ccAdd, html, replyAdd, source, subject, toAdd } = params;

  return {
    Destination: {
      CcAddresses: ccAdd || undefined,
      ToAddresses: toAdd,
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: html,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject,
      },
    },
    ReplyToAddresses: replyAdd || undefined,
    Source: source,
  };
};
