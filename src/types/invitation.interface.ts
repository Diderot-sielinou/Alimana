// src/interfaces/invitation.interface.ts

import { Store } from './auth';
import { IRole } from './role.interface';
import { IStoreUser } from './store-user.interface';

export enum InvitationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

export interface IInvitation {
  id: number;
  email: string;
  storeId: number;
  store?: Store;
  roleId: number;
  role?: IRole;
  invitedById: number;
  invitedBy?: IStoreUser;
  token: string;
  status: InvitationStatus;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

// Frontend-specific types for forms
export interface CreateInvitationRequest {
  email: string;
  roleId: number;
}

export interface InvitationFormData {
  email: string;
  roleId: string; // String for form handling, converted to number
}

export interface AcceptInvitationRequest {
  token: string;
  password: string;
}
