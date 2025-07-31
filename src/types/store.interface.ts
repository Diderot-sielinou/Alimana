// src/interfaces/store.interface.ts

import { IStoreUser } from './store-user.interface';
import { ICategory } from './category.interface';
import { IRole } from './role.interface';
import { ICashRegister } from './cash-register.interface';
import { IInvitation } from './invitation.interface';
import { IUser } from './user.interface'; // Assuming basic IUser interface exists
import { IPaymentMethod } from './payment-method.interface';
import { IStoreSetting } from './store-setting.interface';

export interface IStore {
  id: number;
  name: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  email?: string | null; // Optional
  logoUrl?: string | null; // Optional
  websiteUrl?: string | null; // Optional
  profileImageUrl?: string | null; // Optional
  createdAt: string; // Date as string
  updatedAt: string; // Date as string
  ownerId: number;
  owner?: IUser; // Simplified user info if eagerly loaded

  // Lazy-loaded relationships, optional on the frontend
  storeUsers?: IStoreUser[];
  paymentMethods?: IPaymentMethod[];
  categories?: ICategory[];
  roles?: IRole[];
  settings?: IStoreSetting[];
  cashRegisters?: ICashRegister[];
  invitations?: IInvitation[];
}

// DTO for creating a store
export interface ICreateStoreDto {
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  profileImageUrl?: string;
  websiteUrl?: string;
}

// DTO for updating a store
export interface IUpdateStoreDto {
  name?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  profileImageUrl?: string;
  websiteUrl?: string;
}
