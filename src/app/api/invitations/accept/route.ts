import { type NextRequest, NextResponse } from 'next/server';
import { invitations } from '../send/route';
import { isInvitationValid, InvitationStatus } from '@/lib/invitation';
import { ROLE_PERMISSIONS, type User } from '@/lib/auth';
import * as Sentry from '@sentry/nextjs';

// In a real app, this would be your user database
const users: User[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    const invitation = invitations.find((inv) => inv.token === token);

    if (!invitation) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
    }

    if (!isInvitationValid(invitation)) {
      return NextResponse.json(
        { error: 'Invitation has expired or is no longer valid' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = users.find((user) => user.email === invitation.email);
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Create user account
    const newUser: User = {
      id: `user_${Date.now()}`,
      email: invitation.email,
      fullName: invitation.fullName,
      role: invitation.role,
      storeId: invitation.storeId,
      name: invitation.name,
      isActive: true,

      permissions: ROLE_PERMISSIONS[invitation.role],
    };

    // Store user (in real app, save to database with hashed password)
    users.push(newUser);

    // Mark invitation as accepted
    invitation.status = InvitationStatus.ACCEPTED;

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role,
        name: newUser.name,
      },
    });
  } catch (error) {
    Sentry.captureException(new Error(`Failed to send invitation: ${error}`));
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Export users for signin to access
export { users };
