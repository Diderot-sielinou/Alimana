// src/interfaces/store-user.interface.ts

import { IUser } from './user.interface';
import { Store } from './auth';
import { IRole } from './role.interface';

export enum StoreUserStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
}

export interface IStoreUser {
  id: number;
  userId: number;
  user?: IUser; // Full user object if eagerly loaded
  storeId: number;
  store?: Store; // Full store object if eagerly loaded
  roleId: number | null; // Nullable
  role?: IRole; // Eagerly loaded, so it should always be present
  status: StoreUserStatus;
  joinedAt: string | null; // Date as string, can be null
  createdAt: string; // Date as string
  updatedAt: string; // Date as string
}

// DTO for creating a StoreUser (e.g., inviting a user to a store)
export interface ICreateStoreUserDto {
  userId: number;
  storeId: number;
  roleId: number;
  status?: StoreUserStatus;
}

// DTO for updating a StoreUser's status or role
export interface IUpdateStoreUserDto {
  roleId?: number;
  status?: StoreUserStatus;
  joinedAt?: string | null;
}
