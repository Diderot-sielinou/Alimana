// src/interfaces/user.interface.ts

export enum AuthProvider {
  LOCAL = 'local',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
}

export interface IUser {
  id: number;
  email: string;
  fullName: string;
  phone: string | null;
  avatarUrl?: string | null; // Optional, can be null
  isActive: boolean;
  authProvider: AuthProvider;
  lastSelectedStoreUserId: number | null; // Nullable
  providerId?: string | null; // Optional, can be null
  canCreateStore: boolean;
  createdAt: string; // Date objects are strings (ISO 8601) on the frontend
}

// DTO for updating a user
export interface IUpdateUserDto {
  email?: string;
  fullName?: string;
  phone?: string;
  avatarUrl?: string | null;
  isActive?: boolean;
  lastSelectedStoreUserId?: number | null;
}
