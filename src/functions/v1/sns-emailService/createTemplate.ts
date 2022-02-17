import { emailTemplates } from '_config';
import { adminUserAdded } from './templates/adminUserAdded';
import { adminUserRemoved } from './templates/adminUserRemoved';
import { templateFoot } from './templates/foot';
import { templateHead } from './templates/head';

type TemplateName = keyof typeof emailTemplates;

export const createTemplate = (templateName: TemplateName) =>
  //
  //* Admin user added
  // if (templateName === emailTemplates.ADMIN_PORTAL_ADMIN_USER_ADDED) {
  //   return templateHead + adminUserAdded + templateFoot;
  // }

  //* Admin user removed
  // if (templateName === emailTemplates.ADMIN_PORTAL_ADMIN_USER_REMOVED) {
  //   return templateHead + adminUserRemoved + templateFoot;
  // }

  null;
