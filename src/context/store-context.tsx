// src/contexts/ShopDataContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category } from '@/types/product';
import { PaymentMethod, CashRegister } from '@/types/pos';
import { api } from '@/lib/api';
import { useAuth } from './auth-context';

interface ShopDataState {
  products: Product[];
  categories: Category[];
  paymentMethods: PaymentMethod[];
  cashRegisters: CashRegister[];
  isLoading: boolean;
}

interface ShopDataContextType extends ShopDataState {
  refreshProducts: () => Promise<void>;
  refreshCategories: () => Promise<void>;
  refreshPaymentMethods: () => Promise<void>;
  refreshCashRegisters: () => Promise<void>;
  findProductByBarcode: (barcode: string) => Promise<Product | null>;
  loadInitialData: ()=> Promise<void>;
}

const ShopDataContext = createContext<ShopDataContextType | undefined>(undefined);

export const ShopDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { storeContext } = useAuth();
  const [state, setState] = useState<ShopDataState>({
    products: [],
    categories: [],
    paymentMethods: [],
    cashRegisters: [],
    isLoading: false,
  });

  useEffect(() => {
    if (storeContext) {
      loadInitialData();
    }
  }, [storeContext]);

  const loadInitialData = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    await Promise.all([
      refreshProducts(),
      refreshCategories(),
      refreshPaymentMethods(),
      refreshCashRegisters(),
    ]);
    setState(prev => ({ ...prev, isLoading: false }));
  };

  const refreshProducts = async () => {
    try {
      const response = await api.get('/products');
      setState(prev => ({ ...prev, products: response.data.products }));
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  const refreshCategories = async () => {
    try {
      const response = await api.get('/categories');
      setState(prev => ({ ...prev, categories: response.data.categories }));
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const refreshPaymentMethods = async () => {
    try {
      const response = await api.get('/payment-methods');
      setState(prev => ({ ...prev, paymentMethods: response.data.paymentMethods }));
    } catch (error) {
      console.error('Failed to load payment methods:', error);
    }
  };

  const refreshCashRegisters = async () => {
    try {
      const response = await api.get('/cash-registers');
      setState(prev => ({ ...prev, cashRegisters: response.data.cashRegisters }));
    } catch (error) {
      console.error('Failed to load cash registers:', error);
    }
  };

  const findProductByBarcode = async (barcode: string): Promise<Product | null> => {
    try {
      const response = await api.get(`/products/by-barcode/${barcode}`);
      return response.data.product;
    } catch (error) {
      console.log(error)
      return null;
    }
  };

  const value: ShopDataContextType = {
    ...state,
    refreshProducts,
    refreshCategories,
    refreshPaymentMethods,
    refreshCashRegisters,
    findProductByBarcode,
    loadInitialData
  };

  return <ShopDataContext.Provider value={value}>{children}</ShopDataContext.Provider>;
};

export const useShopData = () => {
  const context = useContext(ShopDataContext);
  if (!context) {
    throw new Error('useShopData must be used within a ShopDataProvider');
  }
  return context;
};