'use client';

import { AuthProvider } from '@/context/auth-context';
import { AuthProvider2 } from '@/context/AuthContext';
import { DataProvider } from '@/context/DataContext';
import { ShopProvider } from '@/context/shopContext';
import { SidebarProvider } from '@/context/sidebar-context';
import { ShopDataProvider } from '@/context/store-context';
import React, { ReactNode } from 'react';

interface GlobalProvidersProps {
  children: ReactNode;
}

/**
 * Composant qui regroupe tous les fournisseurs de contexte globaux.
 * Ce composant sera importé dans le layout racine de Next.js.
 */
export default function GlobalProviders({ children }: GlobalProvidersProps) {
  return (
    <SidebarProvider>
      <AuthProvider2>
        <AuthProvider>
          <ShopProvider>
            <ShopDataProvider>
              <DataProvider>{children}</DataProvider>
            </ShopDataProvider>
          </ShopProvider>
        </AuthProvider>
      </AuthProvider2>
    </SidebarProvider>
  );
}
