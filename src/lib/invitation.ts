import type { UserRole } from './auth';

export interface Invitation {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  storeId: string;
  name: string;
  invitedBy: string;
  invitedAt: string;
  expiresAt: string;
  status: InvitationStatus;
  token: string;
}

export enum InvitationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  EXPIRED = 'expired',
  REVOKED = 'revoked',
}

export interface InvitationEmailData {
  inviteeName: string;
  inviterName: string;
  name: string;
  role: string;
  inviteUrl: string;
  expiresAt: string;
}

export const generateInviteToken = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const createInviteUrl = (token: string): string => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}/invite/${token}`;
};

export const isInvitationValid = (invitation: Invitation): boolean => {
  return (
    invitation.status === InvitationStatus.PENDING && new Date(invitation.expiresAt) > new Date()
  );
};
