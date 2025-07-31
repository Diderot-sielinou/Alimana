import {
  LayoutDashboard,
  ShoppingCart,
  Box,
  BarChart3,
  Warehouse,
  Settings,
  UserPlus,
  CreditCard,
} from 'lucide-react';
//   {
//     href: '/dashboard',
//     label: 'Dashboard',
//     icon: LayoutDashboard,
//   },
//   {
//     href: '/dashboard/products',
//     label: 'Products',
//     icon: Box,
//   },
//   {
//     href: '/dashboard/sales',
//     label: 'Sales',
//     icon: ShoppingCart,
//   },
//   {
//     href: '/dashboard/analytics',
//     label: 'Analytics',
//     icon: BarChart3,
//   },
//   {
//     href: '/dashboard/inventory',
//     label: 'Inventory',
//     icon: Warehouse,
//   },
//   {
//     href: '/dashboard/user-management',
//     label: 'User Management',
//     icon: UserPlus,
//   },
//   {
//     href: '/dashboard/settings',
//     label: 'Settings',
//     icon: Settings,
//   },
// ];
export const sidebarLinks = [
  {
    href: '/dashboard/overview',
    label: 'Dashboard',
    icon: LayoutDashboard,
    requiredPermissions: [], // visible à tous connectés
  },
  {
    href: '/dashboard/products',
    label: 'Products',
    icon: Box,
    requiredPermissions: [],
  },
  // {
  //   href: '/dashboard/sales',
  //   label: 'Sales',
  //   icon: ShoppingCart,
  //   requiredPermissions: [],
  // },
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
