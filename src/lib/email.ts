// src/lib/email.ts
import { resend } from '@/lib/resend';
import { getInvitationEmailTemplate } from './templates/invitation';
import { InvitationEmailData } from './types';
import { logError } from './../app/utils/logger';
export const sendInvitationEmail = async (
  email: string,
  data: InvitationEmailData
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await resend.emails.send({
      from: `ALIMANA <${process.env.EMAIL_SENDER ?? 'noreply@example.com'}>`,
      to: [email],
      subject: `You're invited to join ${data.name} on ALIMANA`,
      html: getInvitationEmailTemplate(data),
    });

    if (error) {
      // logger.error('Email sending error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    logError(error, 'Email sending error:');
    return { success: false, error: 'Failed to send invitation email' };
  }
};
