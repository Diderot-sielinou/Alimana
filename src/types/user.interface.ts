// src/types/user.interface.ts

import { AuthProvider } from './store.interface';

export interface IUser {
  id: number;
  email: string;
  fullName: string;
  avatarUrl?: string;
  phone?: string;
  authProvider?: AuthProvider;
  canCreateStore: boolean;
  createdAt: string;
  updatedAt: string;
}

// DTO for creating a user
export interface ICreateUserDto {
  email: string;
  fullName: string;
  password: string;
  canCreateStore?: boolean;
}

// DTO for updating a user
export interface IUpdateUserDto {
  fullName?: string;
  canCreateStore?: boolean;
}
