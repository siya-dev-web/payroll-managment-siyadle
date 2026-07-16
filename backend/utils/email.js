import nodemailer from "nodemailer";

/**
 * Creates a nodemailer transporter from environment variables.
 * Works with Gmail App Passwords, Outlook, or any SMTP provider.
 */
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "465", 10),
    secure: process.env.EMAIL_PORT === "465" || !process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

/**
 * Send a password reset email.
 * The token is embedded only inside the URL — it is never displayed visibly.
 *
 * @param {string} toEmail    Recipient email address
 * @param {string} toName     Recipient full name
 * @param {string} rawToken   The raw (unhashed) reset token
 */
export async function sendPasswordResetEmail(toEmail, toName, rawToken) {
  const transporter = createTransporter();
  const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:3000";
  const resetLink = `${clientOrigin}/reset-password?token=${rawToken}`;
  const expiryMinutes = 60;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset Your Password</title>
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0"
               style="background:#ffffff;border-radius:12px;border:1px solid #e2e8f0;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:#004ac6;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">
                PayRoll Pro
              </h1>
              <p style="margin:6px 0 0;color:#b4c5ff;font-size:13px;">
                Enterprise Payroll Management
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 8px;font-size:16px;color:#191b23;font-weight:600;">
                Hi ${toName},
              </p>
              <p style="margin:0 0 24px;font-size:14px;color:#434655;line-height:1.6;">
                We received a request to reset the password for your PayRoll Pro account.
                Click the button below to choose a new password.
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:8px 0 32px;">
                    <a href="${resetLink}"
                       style="display:inline-block;background:#004ac6;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 36px;border-radius:10px;letter-spacing:0.2px;">
                      Reset My Password
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 24px;font-size:13px;color:#434655;line-height:1.6;">
                This link will expire in <strong>${expiryMinutes} minutes</strong>.
                If you did not request a password reset, you can safely ignore this email —
                your password will not be changed.
              </p>

              <!-- Security note -->
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="background:#fff8e1;border-left:4px solid #f59e0b;border-radius:4px;margin-bottom:24px;">
                <tr>
                  <td style="padding:12px 16px;">
                    <p style="margin:0;font-size:12px;color:#92400e;">
                      <strong>Security tip:</strong> PayRoll Pro will never ask for your
                      password via email or phone.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:13px;color:#737686;line-height:1.6;">
                If the button above does not work, copy and paste this URL into your browser:
                <br />
                <a href="${resetLink}"
                   style="color:#004ac6;word-break:break-all;">${resetLink}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #e2e8f0;background:#faf8ff;">
              <p style="margin:0;font-size:12px;color:#737686;text-align:center;">
                &copy; 2024 PayRoll Pro. All rights reserved.<br />
                This is an automated email — please do not reply directly to this message.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();

  await transporter.sendMail({
    from: `"PayRoll Pro" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Reset Your PayRoll Pro Password",
    html,
    text: [
      `Hi ${toName},`,
      ``,
      `We received a request to reset your PayRoll Pro password.`,
      `Click the "Reset My Password" button in this email to proceed.`,
      ``,
      `This link expires in ${expiryMinutes} minutes.`,
      `If you did not request this, ignore this email — your password will not change.`,
      ``,
      `— PayRoll Pro`,
    ].join("\n"),
  });
}

/**
 * Send an email verification email.
 *
 * @param {string} toEmail           Recipient email address
 * @param {string} toName            Recipient full name
 * @param {string} verificationToken The raw verification token
 */
export async function sendVerificationEmail(toEmail, toName, verificationToken) {
  const transporter = createTransporter();
  const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:3000";
  const verifyLink = `${clientOrigin}/verify-email?token=${verificationToken}`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Verify Your Email</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0"
               style="background:#ffffff;border-radius:12px;border:1px solid #e2e8f0;overflow:hidden;">
          <tr>
            <td style="background:#004ac6;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">
                PayRoll Pro
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 8px;font-size:16px;color:#191b23;font-weight:600;">
                Hi ${toName},
              </p>
              <p style="margin:0 0 24px;font-size:14px;color:#434655;line-height:1.6;">
                Thanks for registering. Please verify your email address to activate
                your account.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:8px 0 32px;">
                    <a href="${verifyLink}"
                       style="display:inline-block;background:#004ac6;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 36px;border-radius:10px;">
                      Verify My Email
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0;font-size:13px;color:#737686;">
                If you did not create an account, you can safely ignore this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #e2e8f0;background:#faf8ff;">
              <p style="margin:0;font-size:12px;color:#737686;text-align:center;">
                &copy; 2024 PayRoll Pro. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();

  await transporter.sendMail({
    from: `"PayRoll Pro" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Verify Your PayRoll Pro Email Address",
    html,
    text: [
      `Hi ${toName},`,
      ``,
      `Verify your email by visiting:`,
      `${verifyLink}`,
      ``,
      `— PayRoll Pro`,
    ].join("\n"),
  });
}
