import {
  LayoutDashboard,
  ShoppingCart,
  Box,
  BarChart3,
  Warehouse,
  Settings,
  UserPlus,
  CreditCard,
  Tags,
} from 'lucide-react';

export const sidebarLinks = [
  {
    href: '/dashboard/overview',
    label: 'Dashboard',
    icon: LayoutDashboard,
    requiredPermissions: [], // visible à tous connectés
  },
  {
    href: '/dashboard/product',
    label: 'Products',
    icon: Box,
    requiredPermissions: [],
  },
  {
    href: '/dashboard/categories',
    label: 'category',
    icon: Tags,
    requiredPermissions: [],
  },
  {
    href: '/dashboard/post',
    label: 'Sales',
    icon: ShoppingCart,
    requiredPermissions: [],
  },
  {
    href: '/dashboard/cash-registers',
    label: 'sessions',
    icon: CreditCard,
    requiredPermissions: [],
  },
  {
    href: '/dashboard/manage-cash-register',
    label: 'Cash Register',
    icon: CreditCard,
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
