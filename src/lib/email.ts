import { Resend } from 'resend';
import type { InvitationEmailData } from './invitation';
import * as Sentry from '@sentry/nextjs';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not set in the environment variables');
}

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendInvitationEmail = async (
  email: string,
  data: InvitationEmailData
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await resend.emails.send({
      from: 'ALIMANA <noreply@storehub.com>',
      to: [email],
      subject: `You're invited to join ${data.name} on ALIMANA`,
      html: getInvitationEmailTemplate(data),
    });

    if (error) {
      Sentry.captureException(new Error('Email sending error'));
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    if (error) {
      Sentry.captureException(new Error('Email sending error'));
    }
    return { success: false, error: 'Failed to send invitation email' };
  }
};

const getInvitationEmailTemplate = (data: InvitationEmailData): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>You're invited to join ${data.name}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: bold; color: #2563eb; }
        .content { background: #f8fafc; padding: 30px; border-radius: 8px; margin-bottom: 20px; }
        .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; }
        .footer { text-align: center; color: #6b7280; font-size: 14px; }
        .role-badge { background: #dbeafe; color: #1d4ed8; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">ALIMANA</div>
        </div>
        
        <div class="content">
          <h2>You're invited to join ${data.name}!</h2>
          
          <p>Hi ${data.inviteeName},</p>
          
          <p><strong>${data.inviterName}</strong> has invited you to join <strong>${data.name}</strong> as a <span class="role-badge">${data.role}</span>.</p>
          
          <p>Alimana is a comprehensive store management system that will help you collaborate with your team and manage store operations efficiently.</p>
          
          <p style="text-align: center; margin: 30px 0;">
            <a href="${data.inviteUrl}" class="button">Accept Invitation & Create Account</a>
          </p>
          
          <p><strong>What's next?</strong></p>
          <ul>
            <li>Click the button above to accept your invitation</li>
            <li>Create your secure password</li>
            <li>Start collaborating with your team</li>
          </ul>
          
          <p style="color: #ef4444; font-size: 14px;">
            <strong>Note:</strong> This invitation expires on ${new Date(data.expiresAt).toLocaleDateString()} at ${new Date(data.expiresAt).toLocaleTimeString()}.
          </p>
        </div>
        
        <div class="footer">
          <p>If you didn't expect this invitation, you can safely ignore this email.</p>
          <p>If you have any questions, please contact your store administrator.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
