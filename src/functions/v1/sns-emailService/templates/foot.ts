/* eslint-disable max-len */
export const templateFoot = /*html*/ `
          <table style="margin-top: 28px; width: 100%; max-width: 448px;" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td>
                <hr style="border-top: 1px solid rgb(243 244 246)">
                <% if (templateValues.sender === "system") { %>
                  <p style="font-size: 12px; color: #4b5563;">
                    This message was automatically sent to <%= templateValues.email %>.
                  </p>
                <% } %>
                <% if (templateValues.sender === "self") { %>
                  <p style="font-size: 12px; color: #4b5563;">
                    This message was sent to <%= templateValues.email %> at your request.
                  </p>
                <% } %>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
