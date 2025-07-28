export interface User {
  id: number;
  email: string;
  fullName: string;
  canCreateStore: boolean;
}
type PermissionKey = string;

export interface StoreContext {
  storeUserId: number; // L'ID de l'association user-store
  storeId: number;
  roleId: number;
  roleName: string;
  permissions: PermissionKey[];
  user: {
    id: number;
    email: string;
    fullName: string;
  };
  store: {
    id: number;
    name: string;
    currency?: string;
    timezone?: string;
    address?: string;
    phone?: string;
    email?: string;
  };
}

export interface Permission {
  id: number;
  name: string;
  resource: string;
  action: string;
}

export interface Store {
  id: number;
  name: string;
  currency?: string;
  timezone?: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface AuthState {
  user: User | null;
  currentStore: Store | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
