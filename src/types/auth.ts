export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  stores: Store[];
}

export interface Role {
  id: number;
  name: string;
  permissions: Permission[];
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