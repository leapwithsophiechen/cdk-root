/* eslint-disable max-len */
export const adminUserAdded = /*html*/ `
  <table style="width: 100%; max-width: 448px;" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td>
        <p style="line-height: 24px;">
          You have been given access to the admin portal. <br>Enter the following
          temporary password to login:
        </p>
        <p style="padding-top: 32px; padding-bottom: 32px;">
          <span style="border-radius: 8px; border-width: 1px; border-style: solid; border-color: #3b82f6; background-color: #dbeafe; padding-left: 32px; padding-right: 32px; padding-top: 20px; padding-bottom: 20px; font-weight: 700;"><%= templateValues.password %></span>
        </p>
        <p>This password is valid until <%= templateValues.passwordExpiry %>.</p>
        <div style="margin-top: 48px;">
          <a href="<%= adminUrl %>" style="font-weight: 700; color: #ffffff; text-decoration: none;">
            <p style="width: 100%; border-radius: 8px; background-color: #2563eb; padding-left: 16px; padding-right: 16px; padding-top: 12px; padding-bottom: 12px; text-align: center; font-weight: 700; color: #ffffff;">
              Login
            </p>
          </a>
        </div>
        <p style="margin-top: 48px; font-weight: 700;">Temporary password expired?</p>
        <p>
          Contact an <a href="" style="color: #2563eb;">administrator</a>.
        </p>
      </td>
    </tr>
  </table>
`;
