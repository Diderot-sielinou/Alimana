// lib/nav-items.ts
export interface NavItem {
  label: string;
  path: string;
  icon?: React.ReactNode; // Optional if using Lucide icons
}

export const allNavItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Products', path: '/dashboard/products' },
  { label: 'Sales', path: '/dashboard/sales' },
  { label: 'Analytics', path: '/dashboard/analytics' },
  { label: 'Invite Users', path: '/dashboard/invite-users' },
  { label: 'Inventory', path: '/dashboard/inventory' },
  { label: 'Settings', path: '/dashboard/settings' },
  { label: 'Users', path: '/dashboard/users' },
];
