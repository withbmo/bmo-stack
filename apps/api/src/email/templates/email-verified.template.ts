export interface EmailVerifiedData {
  toEmail: string;
  toName: string;
}

export function getEmailVerifiedTemplate(data: EmailVerifiedData): {
  subject: string;
  htmlBody: string;
  textBody: string;
} {
  const subject = 'Email Verified Successfully';

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 30px; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Email Verified!</h1>
    </div>
    <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
	        <p style="margin-top: 0;">Hi ${data.toName},</p>
	        <p>Your email address has been successfully verified. You now have full access to all features.</p>
        <div style="text-align: center; margin: 20px 0;">
            <span style="font-size: 48px;">&#10004;</span>
        </div>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px; margin-bottom: 0;">This is an automated message. Please do not reply directly to this email.</p>
    </div>
</body>
</html>
  `.trim();

  const textBody = `
Email Verified!

	Hi ${data.toName},

	Your email address has been successfully verified. You now have full access to all features.

This is an automated message. Please do not reply directly to this email.
  `.trim();

  return { subject, htmlBody, textBody };
}
