/* eslint-disable max-len */
export const templateHead = /*html*/ `
<!DOCTYPE html>
<html>
  <head>
    </head>
  <body style="margin: 0; width: 100%; padding: 0; word-break: break-word; -webkit-font-smoothing: antialiased;">
    <table style="width: 100%; font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif; font-size: 16px;" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center" style="padding-top: 32px;">
          <table style="width: 100%; max-width: 448px;" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td>
                <p style="padding-bottom: 12px;">
                  <img src="<%= emailAssetsUrl %>logo.png" width="100" alt="Logo" style="max-width: 100%; vertical-align: middle; line-height: 100%; border: 0;">
                </p>
                <hr style="border-top: 1px solid rgb(243 244 246)">
                <p><%= templateValues.greeting %>,</p>
              </td>
            </tr>
          </table>
`;
