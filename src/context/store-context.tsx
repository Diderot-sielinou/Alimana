'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from './auth-context';
import { ICashRegister } from '@/types/cash-register.interface';
import { ICashRegisterSession } from '@/types/cash-register-session.interface';
import { IProduct } from '@/types/product.interface';
import { IPaymentMethod } from '@/types/payment-method.interface';
import { ICategory } from '@/types/category.interface';
import {
  GetRevenueSummary,
  GetProfitSummary,
  GetSalesSummary,
  GetSalesOverview,
} from '@/types/get-sales-summary.interface';
import { IRole } from '@/types/role.interface';

interface ShopDataState {
  products: IProduct[];
  categories: ICategory[];
  paymentMethods: IPaymentMethod[];
  cashRegisters: ICashRegister[];
  revenueSummary: GetRevenueSummary;
  salesSummary: GetSalesSummary;
  profitSummary: GetProfitSummary;
  salesOverview: GetSalesOverview[];
  // permissions?: Permission[];

  roles?: IRole[];
  isLoading: boolean;
}

interface ShopDataContextType extends ShopDataState {
  refreshProducts: () => Promise<void>;
  refreshCategories: () => Promise<void>;
  refreshPaymentMethods: () => Promise<void>;
  refreshCashRegisters: () => Promise<void>;
  refreshDailyRevenue: () => Promise<void>;
  refreshDailyProfit: () => Promise<void>;
  refreshDailySales: () => Promise<void>;
  refreshSalesOverview: () => Promise<void>;
  findProductByBarcode: (barcode: string) => Promise<IProduct | null>;
  loadInitialData: () => Promise<void>;
  openSession: ICashRegisterSession | null;
  setOpenSession: React.Dispatch<React.SetStateAction<ICashRegisterSession | null>>;
}

const ShopDataContext = createContext<ShopDataContextType | undefined>(undefined);

export const ShopDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { storeContext, hasFetchedMe } = useAuth();
  const pathname = usePathname();
  const [openSession, setOpenSession] = useState<ICashRegisterSession | null>(null);
  const [state, setState] = useState<ShopDataState>({
    products: [],
    categories: [],
    paymentMethods: [],
    cashRegisters: [],
    revenueSummary: {} as GetRevenueSummary,
    salesSummary: {} as GetSalesSummary,
    profitSummary: {} as GetProfitSummary,
    salesOverview: [],
    isLoading: false,
  });

  const fetchProducts = async (storeId: number) => {
    try {
      const response = await api.get(`store/${storeId}/product/all`);
      // console.log('✅ Products loaded:', response.data);
      setState((prev) => ({ ...prev, products: response.data }));
    } catch (error) {
      console.error('❌ Failed to load products:', error);
    }
  };

  const fetchCategories = async (storeId: number) => {
    try {
      const response = await api.get(`store/${storeId}/category`);
      // console.log('✅ Categories loaded:', response.data);
      setState((prev) => ({ ...prev, categories: response.data }));
    } catch (error) {
      console.error('❌ Failed to load categories:', error);
    }
  };

  const fetchPaymentMethods = async (storeId: number) => {
    try {
      const response = await api.get(`store/${storeId}/payment-methods`);
      // console.log('✅ Payment methods loaded:', response.data);
      setState((prev) => ({ ...prev, paymentMethods: response.data }));
    } catch (error) {
      console.error('❌ Failed to load payment methods:', error);
    }
  };

  const fetchCashRegisters = async (storeId: number) => {
    try {
      const response = await api.get(`store/${storeId}/cash-register`);
      // console.log('✅ Cash registers loaded:', response.data);
      setState((prev) => ({ ...prev, cashRegisters: response.data }));
    } catch (error) {
      console.error('❌ Failed to load cash registers:', error);
    }
  };

  const fetchDailyRevenue = async (storeId: number) => {
    try {
      const response = await api.get(`store/${storeId}/analytics/summary/revenue`);
      setState((prev) => ({ ...prev, revenueSummary: response.data }));
    } catch (error) {
      console.warn('⚠️ Analytics endpoint not available - revenue data skipped:', error);
      // Set empty data instead of failing
      setState((prev) => ({ ...prev, revenueSummary: {} as GetRevenueSummary }));
    }
  };

  const fetchDailyProfit = async (storeId: number) => {
    try {
      const response = await api.get(`store/${storeId}/analytics/summary/profit`);
      setState((prev) => ({ ...prev, profitSummary: response.data }));
    } catch (error) {
      console.warn('⚠️ Analytics endpoint not available - profit data skipped:', error);
      // Set empty data instead of failing
      setState((prev) => ({ ...prev, profitSummary: {} as GetProfitSummary }));
    }
  };

  const fetchDailySales = async (storeId: number) => {
    try {
      const response = await api.get(`store/${storeId}/analytics/summary/sales`);
      setState((prev) => ({ ...prev, salesSummary: response.data }));
    } catch (error) {
      console.warn('⚠️ Analytics endpoint not available - sales data skipped:', error);
      // Set empty data instead of failing
      setState((prev) => ({ ...prev, salesSummary: {} as GetSalesSummary }));
    }
  };

  const fetchSalesOverview = async (storeId: number) => {
    try {
      const response = await api.get(`store/${storeId}/analytics/sales-overview`);
      setState((prev) => ({ ...prev, salesOverview: response.data }));
    } catch (error) {
      console.warn('⚠️ Analytics endpoint not available - sales overview skipped:', error);
      // Set empty data instead of failing
      setState((prev) => ({ ...prev, salesOverview: [] }));
    }
  };

  const loadInitialData = useCallback(async () => {
    if (!storeContext?.storeId) {
      console.warn('⚠️ No storeContext.storeId — skipping data load');
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true }));

    // Load essential data first (required for core functionality)
    const essentialDataPromises = [
      fetchProducts(storeContext.storeId),
      fetchCategories(storeContext.storeId),
      fetchPaymentMethods(storeContext.storeId),
      fetchCashRegisters(storeContext.storeId),
    ];

    // Load analytics data separately (optional, can fail without breaking the app)
    const analyticsPromises = [
      fetchDailyRevenue(storeContext.storeId),
      fetchDailyProfit(storeContext.storeId),
      fetchDailySales(storeContext.storeId),
      fetchSalesOverview(storeContext.storeId),
    ];

    try {
      // Wait for essential data
      await Promise.all(essentialDataPromises);
      // console.log('✅ Essential store data loaded successfully');

      // Load analytics data in background (don't wait for it)
      Promise.all(analyticsPromises)
        .then(() => {
          // console.log('✅ Analytics data loaded successfully');
        })
        .catch(() => {
          console.warn('⚠️ Analytics data failed to load - continuing without analytics');
        });
    } catch (error) {
      console.error('❌ Failed to load essential store data:', error);
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [storeContext]);

  // Helper function to determine if current page needs store data
  const needsStoreData = useCallback(() => {
    if (!pathname) return false;

    // Pages that need store data
    const storeDataPages = [
      '/dashboard',
      '/store',
      '/pos',
      '/inventory',
      '/sales',
      '/analytics',
      '/reports',
    ];

    return storeDataPages.some((page) => pathname.startsWith(page));
  }, [pathname]);

  useEffect(() => {
    // Only load store data if:
    // 1. User authentication has been fetched
    // 2. User has a valid store context
    // 3. We're on a page that actually needs store data
    if (hasFetchedMe && storeContext?.storeId && needsStoreData()) {
      // console.log('🔄 Loading shop data for storeId:', storeContext.storeId, 'on page:', pathname);
      loadInitialData();
    } else if (hasFetchedMe && storeContext?.storeId) {
      // console.log('⏭️ Skipping store data load - not needed on page:', pathname);
    }
  }, [hasFetchedMe, storeContext, loadInitialData, needsStoreData, pathname]);

  useEffect(() => {
    // console.log('🧪 Products updated:', state.products);
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
    refreshDailyRevenue: async () => {
      if (storeContext?.storeId) await fetchDailyRevenue(storeContext.storeId);
    },
    refreshDailyProfit: async () => {
      if (storeContext?.storeId) await fetchDailyProfit(storeContext.storeId);
    },
    refreshDailySales: async () => {
      if (storeContext?.storeId) await fetchDailySales(storeContext.storeId);
    },
    refreshSalesOverview: async () => {
      if (storeContext?.storeId) await fetchSalesOverview(storeContext.storeId);
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

// Note: StoreContext and useStore removed as they were unused and causing TypeScript erro
