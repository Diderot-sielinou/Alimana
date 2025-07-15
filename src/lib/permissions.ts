// lib/permissions.ts
export type Role = 'admin' | 'manager' | 'cashier';

export const dashboardPermissions: Record<Role, string[]> = {
  admin: ['dashboard', 'invite-users', 'products', 'sales', 'analytics', 'users', 'settings'],
  manager: ['dashboard', 'products', 'sales', 'analytics'],
  cashier: ['dashboard', 'products', 'sales', 'analytics'],
};
