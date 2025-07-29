import {
  LayoutDashboard,
  ShoppingCart,
  BarChart3,
  Warehouse,
  Settings,
  UserPlus,
} from 'lucide-react';

export const sidebarLinks = [
  {
    href: '/dashboard/overview',
    label: 'Dashboard',
    icon: LayoutDashboard,
    requiredPermissions: [], 
  },
  {
    href: '/dashboard/sales',
    label: 'Sales',
    icon: ShoppingCart,
    requiredPermissions: [],
  },
  {
    href: '/dashboard/analytics',
    label: 'Analytics',
    icon: BarChart3,
    requiredPermissions: [],
  },
  {
    href: '/dashboard/inventory',
    label: 'Inventory',
    icon: Warehouse,
    requiredPermissions: [],
  },
  {
    href: '/dashboard/user-management',
    label: 'User Management',
    icon: UserPlus,
    requiredPermissions: [], // OU tu peux filtrer par l’un ou l’autre
  },
  {
    href: '/dashboard/settings',
    label: 'Settings',
    icon: Settings,
    requiredPermissions: [],
  },
];
