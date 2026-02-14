export interface OtpEmailData {
  toEmail: string;
  toName: string;
  otpCode: string;
  purpose: string;
  expiryMinutes: number;
}

export function getOtpEmailTemplate(data: OtpEmailData): {
  subject: string;
  htmlBody: string;
  textBody: string;
} {
  const purposeDisplay = data.purpose.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  const subject = `Your ${purposeDisplay} Code: ${data.otpCode}`;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">${purposeDisplay}</h1>
    </div>
    <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="margin-top: 0;">Hello${data.toName ? ` ${data.toName}` : ''},</p>
        <p>Your verification code is:</p>
        <div style="background: white; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #667eea;">${data.otpCode}</span>
        </div>
        <p style="color: #666; font-size: 14px;">This code will expire in <strong>${data.expiryMinutes} minutes</strong>.</p>
        <p style="color: #666; font-size: 14px;">If you didn't request this code, please ignore this email or contact support if you have concerns.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px; margin-bottom: 0;">This is an automated message. Please do not reply directly to this email.</p>
    </div>
</body>
</html>
  `.trim();

  const textBody = `
${purposeDisplay}

Hello${data.toName ? ` ${data.toName}` : ''},

Your verification code is: ${data.otpCode}

This code will expire in ${data.expiryMinutes} minutes.

If you didn't request this code, please ignore this email or contact support if you have concerns.

This is an automated message. Please do not reply directly to this email.
  `.trim();

  return { subject, htmlBody, textBody };
}
