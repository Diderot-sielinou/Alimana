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
  key: string;
  label: string;
  category: string | null;
  name?: string;
  resource?: string;
  action?: string;
  createdAt: Date;
  updatedAt: Date;
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

export interface DefaultShopSettings {
  taxRate: number;
  defaultPaymentMethodId: string;
  receiptHeader: string;
  receiptFooter: string;
  inventoryAlertThreshold: number;
  autoCloseCashRegister: boolean;
  autoCloseTime: string; // Format HH:MM:SS
}

// Informations de base de la boutique
export interface ShopInfo {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  currency: string; // Ex: "XAF"
  timezone: string; // Ex: "Africa/Douala"
  defaultSettings: DefaultShopSettings;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
}
