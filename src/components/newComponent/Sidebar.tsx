// src/components/layout/Sidebar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Store,
  Package,
  CreditCard,
  Users,
  Mail,
  ShoppingCart,
  Settings,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';

const menuItems = [
  {
    title: 'Tableau de bord',
    href: '/dashboard',
    icon: Store,
  },
  {
    title: 'Infos boutique',
    href: '/dashboard/shop-info',
    icon: Settings,
  },
  {
    title: 'Produits',
    href: '/dashboard/products',
    icon: Package,
  },
  {
    title: 'Point de vente',
    href: '/dashboard/pos',
    icon: ShoppingCart,
  },
  {
    title: 'Caisses',
    href: '/dashboard/cash-registers',
    icon: CreditCard,
  },
  {
    title: 'Rôles & Permissions',
    href: '/dashboard/roles',
    icon: Users,
  },
  {
    title: 'Invitations',
    href: '/dashboard/invitations',
    icon: Mail,
  },
  {
    title: 'Méthodes de paiement',
    href: '/dashboard/payment-methods',
    icon: CreditCard,
  },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { storeContext, logout } = useAuth();

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Store className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-gray-900">ShopManager</h1>
            <p className="text-sm text-gray-500">{storeContext?.roleName}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                    isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          onClick={logout}
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Déconnexion
        </Button>
      </div>
    </div>
  );
};
