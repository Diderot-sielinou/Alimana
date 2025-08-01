import {
  LayoutDashboard,
  ShoppingCart,
  BarChart3,
  Warehouse,
  Settings,
  UserPlus,
  CreditCard,
} from 'lucide-react';

export const sidebarLinks = [
  {
    href: '/dashboard/overview',
    label: 'Dashboard',
    icon: LayoutDashboard,
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
    href: '/dashboard/invitation',
    label: 'Invitation',
    icon: UserPlus,
    requiredPermissions: [],
  },
  {
    href: '/dashboard/settings',
    label: 'Settings',
    icon: Settings,
    requiredPermissions: [],
  },
];
