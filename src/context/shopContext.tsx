'use client'; // Indicates that this file is a Client Component

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Definition of the shop data type
type ShopData = {
  id: string;
  name: string;
  currency: string;
  timezone: string;
};

// Initial value of the context
type ShopContextType = {
  shopData: ShopData | null;
  loadingShop: boolean;
  updateShopInfo: (newInfo: Partial<ShopData>) => void;
};

// Create the context with explicit type or null by default
const ShopContext = createContext<ShopContextType | undefined>(undefined);

// Expected props for the provider
type ShopProviderProps = {
  children: ReactNode;
};

export function ShopProvider({ children }: ShopProviderProps) {
  const [shopData, setShopData] = useState<ShopData | null>(null);
  const [loadingShop, setLoadingShop] = useState<boolean>(false);

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const mockData: ShopData = {
          id: 'shop1',
          name: 'My Next.js Shop',
          currency: 'FCFA',
          timezone: 'Africa/Douala',
        };
        setShopData(mockData);
      } catch (error) {
        console.error('Error while loading shop data:', error);
      } finally {
        setLoadingShop(false);
      }
    };

    fetchShopData();
  }, []);

  const updateShopInfo = (newInfo: Partial<ShopData>) => {
    setShopData((prev) => (prev ? { ...prev, ...newInfo } : null));
    // Optional: API call to persist changes
  };

  const shopContextValue: ShopContextType = {
    shopData,
    loadingShop,
    updateShopInfo,
  };

  if (loadingShop) {
    return <div>Loading shop data...</div>;
  }

  return <ShopContext.Provider value={shopContextValue}>{children}</ShopContext.Provider>;
}

export const useShop = (): ShopContextType => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
