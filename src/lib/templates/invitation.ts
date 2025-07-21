// src/lib/templates/invitation.ts
import { InvitationEmailData } from '../types';

export function getInvitationEmailTemplate(data: InvitationEmailData): string {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>You're invited to join ${data.name} on ALIMANA</h2>
      <p>Hello,</p>
      <p>${data.inviter} has invited you to join their store on ALIMANA.</p>
      <p>Click the button below to accept the invitation:</p>
      <a href="${data.inviteLink}" style="display: inline-block; padding: 10px 20px; background-color: #6366f1; color: white; text-decoration: none; border-radius: 5px;">Accept Invitation</a>
      <p>If the button doesn't work, use the following link:</p>
      <p><a href="${data.inviteLink}">${data.inviteLink}</a></p>
      <p>Thanks,<br />The ALIMANA Team</p>
    </div>
  `;
}
