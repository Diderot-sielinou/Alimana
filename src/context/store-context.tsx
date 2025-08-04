'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { useAuth } from './auth-context';
import { ICashRegister } from '@/types/cash-register.interface';
import { ICashRegisterSession } from '@/types/cash-register-session.interface';
import { IProduct } from '@/types/product.interface';
import { IPaymentMethod } from '@/types/payment-method.interface';
import { ICategory } from '@/types/category.interface';
import { IRole } from '@/types/role.interface';

interface ShopDataState {
  products: IProduct[];
  categories: ICategory[];
  paymentMethods: IPaymentMethod[];
  cashRegisters: ICashRegister[];
  // permissions?: Permission[];

  roles?: IRole[];
  isLoading: boolean;
}

interface ShopDataContextType extends ShopDataState {
  refreshProducts: () => Promise<void>;
  refreshCategories: () => Promise<void>;
  refreshPaymentMethods: () => Promise<void>;
  refreshCashRegisters: () => Promise<void>;
  findProductByBarcode: (barcode: string) => Promise<IProduct | null>;
  loadInitialData: () => Promise<void>;
  openSession: ICashRegisterSession | null;
  setOpenSession: React.Dispatch<React.SetStateAction<ICashRegisterSession | null>>;
}

const ShopDataContext = createContext<ShopDataContextType | undefined>(undefined);

export const ShopDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { storeContext, hasFetchedMe } = useAuth();
  const [openSession, setOpenSession] = useState<ICashRegisterSession | null>(null);
  const [state, setState] = useState<ShopDataState>({
    products: [],
    categories: [],
    paymentMethods: [],
    cashRegisters: [],
    isLoading: false,
  });

  const fetchProducts = async (storeId: number) => {
    try {
      const response = await api.get(`store/${storeId}/product/all`);
      console.log('✅ Products loaded:', response.data);
      setState((prev) => ({ ...prev, products: response.data }));
    } catch (error) {
      console.error('❌ Failed to load products:', error);
    }
  };

  const fetchCategories = async (storeId: number) => {
    try {
      const response = await api.get(`store/${storeId}/category`);
      console.log('✅ Categories loaded:', response.data);
      setState((prev) => ({ ...prev, categories: response.data }));
    } catch (error) {
      console.error('❌ Failed to load categories:', error);
    }
  };

  const fetchPaymentMethods = async (storeId: number) => {
    try {
      const response = await api.get(`store/${storeId}/payment-methods`);
      console.log('✅ Payment methods loaded:', response.data);
      setState((prev) => ({ ...prev, paymentMethods: response.data }));
    } catch (error) {
      console.error('❌ Failed to load payment methods:', error);
    }
  };

  const fetchCashRegisters = async (storeId: number) => {
    try {
      const response = await api.get(`store/${storeId}/cash-register`);
      console.log('✅ Cash registers loaded:', response.data);
      setState((prev) => ({ ...prev, cashRegisters: response.data }));
    } catch (error) {
      console.error('❌ Failed to load cash registers:', error);
    }
  };

  const loadInitialData = useCallback(async () => {
    if (!storeContext?.storeId) {
      console.warn(' No storeContext.storeId — skipping data load');
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true }));

    await Promise.all([
      fetchProducts(storeContext.storeId),
      fetchCategories(storeContext.storeId),
      fetchPaymentMethods(storeContext.storeId),
      fetchCashRegisters(storeContext.storeId),
    ]);

    setState((prev) => ({ ...prev, isLoading: false }));
  }, [storeContext]);

  useEffect(() => {
    if (hasFetchedMe && storeContext?.storeId) {
      console.log('🔄 Loading shop data for storeId:', storeContext.storeId);
      loadInitialData();
    }
  }, [hasFetchedMe, storeContext, loadInitialData]);

  useEffect(() => {
    console.log('🧪 Products updated:', state.products);
  }, [state.products]);

  const findProductByBarcode = async (barcode: string): Promise<IProduct | null> => {
    if (!storeContext?.storeId) return null;

    try {
      const response = await api.get(
        `store/${storeContext.storeId}/products/search?keyword=${barcode}`
      );
      return response.data.product;
    } catch (error) {
      console.error('❌ Failed to search by barcode:', error);
      return null;
    }
  };

  useEffect(() => {
    console.log('🆕 Products updated:', state.products);
  }, [state.products]);

  useEffect(() => {
    console.log('📁 Categories updated:', state.categories);
  }, [state.categories]);

  useEffect(() => {
    console.log('💳 Payment methods updated:', state.paymentMethods);
  }, [state.paymentMethods]);

  useEffect(() => {
    console.log('🖥️ Cash registers updated:', state.cashRegisters);
  }, [state.cashRegisters]);

  const value: ShopDataContextType = {
    ...state,
    refreshProducts: async () => {
      if (storeContext?.storeId) await fetchProducts(storeContext.storeId);
    },
    refreshCategories: async () => {
      if (storeContext?.storeId) await fetchCategories(storeContext.storeId);
    },
    refreshPaymentMethods: async () => {
      if (storeContext?.storeId) await fetchPaymentMethods(storeContext.storeId);
    },
    refreshCashRegisters: async () => {
      if (storeContext?.storeId) await fetchCashRegisters(storeContext.storeId);
    },
    findProductByBarcode,
    loadInitialData,
    openSession,
    setOpenSession,
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

export const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};
