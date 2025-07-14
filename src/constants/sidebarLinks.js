import { LayoutDashboard, ShoppingCart, Box, BarChart, Settings } from 'lucide-react';

export const sidebarLinks = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/dashboard/products',
    label: 'Products',
    icon: Box,
  },
  {
    href: '/dashboard/sales',
    label: 'Sales',
    icon: ShoppingCart,
  },
  {
    href: '/dashboard/analytics',
    label: 'Analytics',
    icon: BarChart,
  },
  {
    href: '/dashboard/settings',
    label: 'Settings',
    icon: Settings,
  },
];
