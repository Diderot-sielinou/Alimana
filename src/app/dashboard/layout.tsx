'use client';

import React, { useState } from 'react';
import { Bell, Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Sidebar from '@/components/sidebar';

export const dash = {
  title: 'Dashboard',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // État d'ouverture du sidebar
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
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} links={links} />

      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-3">
            <button className="md:hidden text-orange-700" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <Link href="/" className="text-xl font-semibold text-orange-700 hover:text-orange-900">
              ALIMANA
            </Link>
            <div className="flex items-center space-x-4">
              <button className="text-orange-700 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
              </button>
              <Image
                src="https://images.unsplash.com/photo-1644904105846-095e45fca990?w=500"
                alt="User"
                width={32}
                height={32}
                className="rounded-full"
              />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6 bg-gray-50 min-h-screen">{children}</main>
      </div>
    </div>
  );
}
