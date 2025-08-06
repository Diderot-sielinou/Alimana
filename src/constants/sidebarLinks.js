import {
  LayoutDashboard,
  ShoppingCart,
  Box,
  BarChart3,
  Warehouse,
  Settings,
  UserPlus,
  FileText,
  CreditCard,
  Badge,
  Tags,
  User,
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
    label: 'Category',
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
    label: 'Sessions',
    icon: CreditCard,
    requiredPermissions: [],
  },
  {
    href: '/dashboard/roles',
    label: 'Roles',
    icon: Badge,
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
    href: '/dashboard/invitation',
    label: 'Invitation',
    icon: UserPlus,
    requiredPermissions: [],
  },
  {
    href: '/dashboard/profile',
    label: 'Profile',
    icon: User,
    requiredPermissions: [],
  },

  {
    href: '/dashboard/settings',
    label: 'Settings',
    icon: Settings,
    requiredPermissions: [],
  },
  {
    href: '/dashboard/reports',
    label: 'Reports',
    icon: FileText,
    requiredPermissions: [],
  },
];
