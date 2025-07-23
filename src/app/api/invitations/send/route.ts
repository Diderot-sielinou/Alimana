import { type NextRequest, NextResponse } from 'next/server';
import { sendInvitationEmail } from '@/lib/email';
import {
  generateInviteToken,
  createInviteUrl,
  type Invitation,
  InvitationStatus,
} from '@/lib/invitation';
import { type UserRole, getRoleDisplayName } from '@/lib/auth';
import * as Sentry from '@sentry/nextjs';

// In a real app, this would be stored in your database
const invitations: Invitation[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, fullName, role, storeId, name, invitedBy, inviterName } = body;

    // Check if user already has a pending invitation
    const existingInvitation = invitations.find(
      (inv) =>
        inv.email === email && inv.storeId === storeId && inv.status === InvitationStatus.PENDING
    );

    if (existingInvitation) {
      return NextResponse.json({ error: 'User already has a pending invitation' }, { status: 400 });
    }

    // Create invitation
    const token = generateInviteToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days

    const invitation: Invitation = {
      id: `inv_${Date.now()}`,
      email,
      fullName,
      role: role as UserRole,
      storeId,
      name,
      invitedBy,
      invitedAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
      status: InvitationStatus.PENDING,
      token,
    };

    // Store invitation (in real app, save to database)
    invitations.push(invitation);

    // Send email
    const inviteUrl = createInviteUrl(token);
    const emailResult = await sendInvitationEmail(email, {
      inviteeName: fullName,
      inviterName,
      name,
      role: getRoleDisplayName(role as UserRole),
      inviteUrl,
      expiresAt: expiresAt.toISOString(),
    });

    if (!emailResult.success) {
      return NextResponse.json(
        { error: emailResult.error || 'Failed to send invitation email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      invitation: {
        id: invitation.id,
        email: invitation.email,
        fullName: invitation.fullName,
        role: invitation.role,
        status: invitation.status,
        expiresAt: invitation.expiresAt,
      },
    });
  } catch (error) {
    Sentry.captureException(error);
    Sentry.captureMessage('Error sending invitation:');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Export invitations for other API routes to access
export { invitations };
