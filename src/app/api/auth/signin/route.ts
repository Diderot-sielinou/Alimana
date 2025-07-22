import { type NextRequest, NextResponse } from 'next/server';
import { users } from '../../invitations/accept/route';
import { ROLE_PERMISSIONS } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Find user (in real app, verify hashed password)
    const user = users.find((u) => u.email === email);

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Account is disabled. Please contact your administrator.' },
        { status: 401 }
      );
    }

    // Add permissions based on role
    const userWithPermissions = {
      ...user,
      permissions: ROLE_PERMISSIONS[user.role],
    };

    return NextResponse.json({
      success: true,
      user: userWithPermissions,
    });
  } catch (error) {
    console.error('Error signing in:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
