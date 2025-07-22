import { type NextRequest, NextResponse } from 'next/server';
import { isInvitationValid } from '@/lib/invitation';
import { invitations } from '../send/route';
import * as Sentry from '@sentry/nextjs';

export async function GET(request: NextRequest, { params }: { params: { token: string } }) {
  try {
    const { token } = params;

    const invitation = invitations.find((inv) => inv.token === token);

    if (!invitation) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
    }

    if (!isInvitationValid(invitation)) {
      return NextResponse.json({ error: 'Invitation has expired or is no longer' });
    }

    return NextResponse.json({
      invitation: {
        id: invitation.id,
        email: invitation.email,
        fullName: invitation.fullName,
        role: invitation.role,
        name: invitation.name,
        invitedAt: invitation.invitedAt,
        expiredAt: invitation.expiresAt,
      },
    });
  } catch (error) {
    Sentry.captureException(error);
    Sentry.captureMessage('Error fetching invitation:');
    return NextResponse.json({ error: 'Internal server error occurred, try again later' });
  }
}
