'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/sidebar';

export const dash = {
  title: 'Dashboard',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: 'Home' },
    { href: '/dashboard/sales', label: 'Sales', icon: 'ShoppingCart' },
    { href: '/analytics', label: 'Analytics', icon: 'BarChart' },
    { href: '/sales-reports', label: 'Sales Reports', icon: 'FileText' },
    { href: '/inventory-reports', label: 'Inventory Reports', icon: 'Box' },
    { href: '/expense-reports', label: 'Expense Reports', icon: 'Wallet' },
    { href: '/system-settings', label: 'System Settings', icon: 'Settings' },
    { href: '/user-management', label: 'User Management', icon: 'Users' },
  ];

  return (
    <div className="flex">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} links={links} />
      <main>{children}</main>
    </div>
  );
}
