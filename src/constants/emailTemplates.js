/**
 * Default Email Templates for Pacific Discovery Network
 */

const SITE_URL = 'https://pacificdiscoverynetwork.com';

export const DEFAULT_EMAIL_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pacific Discovery Network</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;">
    <tr>
      <td align="center" style="padding:20px 0;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          
          <!-- Banner -->
          <tr>
            <td align="center" style="background-color:#0a1628;padding:40px 20px;border-radius:12px 12px 0 0;">
              <img src="${SITE_URL}/pm_logo.png" alt="Pacific Discovery Network" width="320" style="display:block;max-width:320px;height:auto;" />
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color:#ffffff;padding:40px 30px;">
              <h1 style="margin:0 0 20px;font-size:24px;color:#0a1628;line-height:1.3;">
                Hello {{first_name}},
              </h1>
              <p style="margin:0 0 16px;font-size:16px;color:#333333;line-height:1.6;">
                Your email content goes here. Replace this with your message.
              </p>
              <p style="margin:0 0 16px;font-size:16px;color:#333333;line-height:1.6;">
                You can add more paragraphs, links, and formatting as needed.
              </p>
              <!-- CTA Button -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:30px 0;">
                <tr>
                  <td align="center" style="background-color:#0d4f4f;border-radius:8px;">
                    <a href="${SITE_URL}" target="_blank" style="display:inline-block;padding:14px 32px;color:#ffffff;text-decoration:none;font-size:16px;font-weight:bold;">
                      Visit Pacific Discovery Network
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#0a1628;padding:30px;border-radius:0 0 12px 12px;">
              <p style="margin:0 0 8px;font-size:14px;color:#94a3b8;text-align:center;line-height:1.5;">
                Pacific Discovery Network &mdash; Trusted Pacific business discovery platform
              </p>
              <p style="margin:0;font-size:12px;color:#64748b;text-align:center;line-height:1.5;">
                <a href="${SITE_URL}/unsubscribe?email={{email}}" style="color:#64748b;text-decoration:underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
