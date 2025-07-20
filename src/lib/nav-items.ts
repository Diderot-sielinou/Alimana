// lib/nav-items.ts
export interface NavItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

export const allNavItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Products', path: '/dashboard/products' },
  { label: 'Sales', path: '/dashboard/sales' },
  { label: 'Analytics', path: '/dashboard/analytics' },
  { label: 'User Management', path: '/dashboard/user-management' },
  { label: 'Inventory', path: '/dashboard/inventory' },
  { label: 'Settings', path: '/dashboard/settings' },
  { label: 'Users', path: '/dashboard/users' },
];
