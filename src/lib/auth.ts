// src/lib/auth.api.ts
import { apiRequest } from './api';

// 🔐 Login with email/password
export async function signIn(email: string, password: string) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

// 📝 Register new user
export async function signUp(data: {
  fullName: string;
  phone?: string;
  email: string;
  password?: string;
  avatar?: string;
  authProvider?: string;
  provider?: string;
  isActive?: boolean;
  canCreateStore?: boolean;
}) {
  return apiRequest('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });
}

export function signUpWithGoogle() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  window.location.href = `${API_BASE_URL}/api/auth/google`;
}

// 🌐 Google OAuth Sign-In (redirect to backend)
export function signInWithGoogle() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  window.location.href = `${API_BASE_URL}/api/auth/google`;
}

// 🛒 Select a store after login
export async function selectStore(storeUserId: number) {
  return apiRequest('/api/auth/select-store', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ storeUserId }),
    credentials: 'include',
  });
}

// 🔁 Refresh access token using refresh token cookie
export async function refreshToken() {
  return apiRequest('/api/auth/refresh', {
    method: 'POST',
    credentials: 'include',
  });
}

// 🚪 Logout user (clears all auth cookies)
export async function logout() {
  return apiRequest('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });
}

// 👤 Get user profile using access token
export async function getUserProfile() {
  return apiRequest('/api/auth/profile', {
    method: 'GET',
    credentials: 'include',
  });
}

// 🏪 Get store-specific dashboard
export async function getStoreDashboard() {
  return apiRequest('/api/auth/store-dashboard', {
    method: 'GET',
    credentials: 'include',
  });
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  storeId: string;
  name: string;
  isActive: boolean;
  permissions: Permission[];
}

export enum UserRole {
  ADMIN = 'admin',
  STORE_MANAGER = 'store_manager',
  SALESPERSON = 'salesperson',
  CASHIER = 'cashier',
}

export enum Permission {
  // User Management
  MANAGE_USERS = 'manage_users',
  INVITE_USERS = 'invite_users',
  VIEW_USERS = 'view_users',

  // Product Management
  MANAGE_PRODUCTS = 'manage_products',
  ADD_PRODUCTS = 'add_products',
  EDIT_PRODUCTS = 'edit_products',
  DELETE_PRODUCTS = 'delete_products',
  VIEW_PRODUCTS = 'view_products',

  // Inventory Management
  MANAGE_INVENTORY = 'manage_inventory',
  VIEW_INVENTORY = 'view_inventory',
  UPDATE_STOCK = 'update_stock',

  // Sales & Orders
  MANAGE_ORDERS = 'manage_orders',
  VIEW_ORDERS = 'view_orders',
  PROCESS_ORDERS = 'process_orders',
  CANCEL_ORDERS = 'cancel_orders',

  // Sales Management
  MAKE_SALES = 'make_sales',
  VIEW_SALES = 'view_sales',
  MANAGE_SALES = 'manage_sales',

  // Analytics & Reports
  VIEW_ANALYTICS = 'view_analytics',
  VIEW_REPORTS = 'view_reports',
  EXPORT_DATA = 'export_data',

  // Store Settings
  MANAGE_STORE_SETTINGS = 'manage_store_settings',
  VIEW_STORE_SETTINGS = 'view_store_settings',
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    // Full access to everything
    Permission.MANAGE_USERS,
    Permission.INVITE_USERS,
    Permission.VIEW_USERS,
    Permission.MANAGE_PRODUCTS,
    Permission.ADD_PRODUCTS,
    Permission.EDIT_PRODUCTS,
    Permission.DELETE_PRODUCTS,
    Permission.VIEW_PRODUCTS,
    Permission.MANAGE_INVENTORY,
    Permission.VIEW_INVENTORY,
    Permission.UPDATE_STOCK,
    Permission.MANAGE_ORDERS,
    Permission.VIEW_ORDERS,
    Permission.PROCESS_ORDERS,
    Permission.CANCEL_ORDERS,
    Permission.MAKE_SALES,
    Permission.VIEW_SALES,
    Permission.MANAGE_SALES,
    Permission.VIEW_ANALYTICS,
    Permission.VIEW_REPORTS,
    Permission.EXPORT_DATA,
    Permission.MANAGE_STORE_SETTINGS,
    Permission.VIEW_STORE_SETTINGS,
  ],
  [UserRole.STORE_MANAGER]: [
    Permission.VIEW_USERS,
    Permission.MANAGE_PRODUCTS,
    Permission.ADD_PRODUCTS,
    Permission.EDIT_PRODUCTS,
    Permission.VIEW_PRODUCTS,
    Permission.MANAGE_INVENTORY,
    Permission.VIEW_INVENTORY,
    Permission.UPDATE_STOCK,
    Permission.MANAGE_ORDERS,
    Permission.VIEW_ORDERS,
    Permission.PROCESS_ORDERS,
    Permission.CANCEL_ORDERS,
    Permission.VIEW_SALES,
    Permission.MANAGE_SALES,
    Permission.VIEW_ANALYTICS,
    Permission.VIEW_REPORTS,
    Permission.VIEW_STORE_SETTINGS,
  ],
  [UserRole.SALESPERSON]: [
    Permission.VIEW_PRODUCTS,
    Permission.VIEW_INVENTORY,
    Permission.VIEW_ORDERS,
    Permission.PROCESS_ORDERS,
    Permission.MAKE_SALES,
    Permission.VIEW_SALES,
  ],
  [UserRole.CASHIER]: [
    Permission.VIEW_PRODUCTS,
    Permission.VIEW_ORDERS,
    Permission.PROCESS_ORDERS,
    Permission.MAKE_SALES,
  ],
};

export const getRoleDisplayName = (role: UserRole): string => {
  const roleNames = {
    [UserRole.ADMIN]: 'Administrator',
    [UserRole.STORE_MANAGER]: 'Store Manager',
    [UserRole.SALESPERSON]: 'Salesperson',
    [UserRole.CASHIER]: 'Cashier',
  };
  return roleNames[role];
};

export const hasPermission = (user: User, permission: Permission): boolean => {
  return user.permissions.includes(permission);
};

export const hasAnyPermission = (user: User, permissions: Permission[]): boolean => {
  return permissions.some((permission) => user.permissions.includes(permission));
};
