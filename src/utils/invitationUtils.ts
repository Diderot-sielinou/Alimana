import { InvitationStatus } from '@/types/invitation.interface';

export const getInvitationStatusColor = (status: InvitationStatus): string => {
  switch (status) {
    case InvitationStatus.PENDING:
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case InvitationStatus.ACCEPTED:
      return 'text-green-600 bg-green-50 border-green-200';
    case InvitationStatus.EXPIRED:
      return 'text-red-600 bg-red-50 border-red-200';
    case InvitationStatus.REJECTED:
      return 'text-gray-600 bg-gray-50 border-gray-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

export const getInvitationStatusLabel = (status: InvitationStatus): string => {
  switch (status) {
    case InvitationStatus.PENDING:
      return 'Pending';
    case InvitationStatus.ACCEPTED:
      return 'Accepted';
    case InvitationStatus.EXPIRED:
      return 'Expired';
    case InvitationStatus.REJECTED:
      return 'Rejected';
    default:
      return 'Unknown';
  }
};

export const isInvitationExpired = (expiresAt: string): boolean => {
  return new Date(expiresAt) < new Date();
};

export const formatInvitationDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
