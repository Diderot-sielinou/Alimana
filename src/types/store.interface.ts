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

/**
 * Interfaces pour les réponses des endpoints d'API.
 */

// -----------------------------------------------------------------------
// Interfaces pour l'endpoint GET /profiles/me
// -----------------------------------------------------------------------

/**
 * Interface pour représenter un magasin dans la réponse du profil utilisateur.
 */
interface UserProfileStore {
  id: number;
  name: string;
}

/**
 * Interface pour représenter un rôle dans la réponse du profil utilisateur.
 */
interface UserProfileRole {
  id: number;
  name: string;
}

/**
 * Interface pour représenter l'affiliation d'un utilisateur à un magasin dans la réponse.
 */
interface UserProfileStoreUser {
  id: number;
  status: 'active' | 'inactive';
  store: UserProfileStore;
  role: UserProfileRole;
}

export enum AuthProvider {
  LOCAL = 'local',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
}

/**
 * Interface principale pour la réponse de l'endpoint GET /users/me.
 */
export interface UserProfileResponse {
  id: number;
  email: string;
  fullName: string;
  avatarUrl?: string;
  phone?: string;
  authProvider?: AuthProvider;

  lastSelectedStoreUserId: number;
  canCreateStore: boolean;
  createdAt: string; // Utilisation d'une chaîne de caractères pour la date
  stores: UserProfileStore[];
  storeUsers: UserProfileStoreUser[];
  currentStoreRole: UserProfileRole;
}

// -----------------------------------------------------------------------
// Interfaces pour l'endpoint GET /stores/profile/:id
// -----------------------------------------------------------------------

/**
 * Interface pour les données de l'utilisateur dans la réponse du profil de magasin.
 */
interface StoreProfileUser {
  id: number;
  email: string;
  fullName: string;
}

/**
 * Interface pour les données du rôle dans la réponse du profil de magasin.
 */
interface StoreProfileRole {
  id: number;
  name: string;
  description: string;
}

/**
 * Interface pour les affiliations des utilisateurs à ce magasin.
 */
interface StoreProfileStoreUser {
  id: number;
  status: 'active' | 'suspended' | 'pending';
  user: StoreProfileUser;
  role: StoreProfileRole;
}

/**
 * Interface principale pour la réponse de l'endpoint GET /stores/:id.
 */
export interface StoreProfileResponse {
  id: number;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  profileImageUrl?: string;
  websiteUrl?: string;
  createdAt: string;
  updatedAt: string;
  ownerId: number;
  storeUsers: StoreProfileStoreUser[];
}
