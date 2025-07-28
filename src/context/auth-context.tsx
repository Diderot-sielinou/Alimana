/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { api } from '@/lib/api';
import { StoreContext, User } from '@/types/auth';

const PUBLIC_PATHS = ['/', '/signin', '/signup', '/auth/callback/google', '/accept-invite'];

type PermissionKey = string;
type Credentials = { email: string; password: string };

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  storeContext: StoreContext | null;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => Promise<void>;
  selectStore: (storeUserId: number) => Promise<void>;
  hasPermission: (key: PermissionKey) => boolean;
  hasAnyPermission: (keys: PermissionKey[]) => boolean;
  hasAllPermissions: (keys: PermissionKey[]) => boolean;
  hasStoreContext: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  cashRegisterSessionId: number | null;
  setCashRegisterSessionId: React.Dispatch<React.SetStateAction<number | null>>;
  fetchMe: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [storeContext, setStoreContext] = useState<StoreContext | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cashRegisterSessionId, setCashRegisterSessionId] = useState<number | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  const fetchMe = useCallback(async () => {
    const suppressErrorToast = !isAuthenticated && !isLoading && pathname === PUBLIC_PATHS[0];

    setIsLoading(true);
    try {
      let res;
      try {
        res = await api.get('/auth/store/me');
      } catch (storeMeError) {
        console.log(storeMeError);
        res = await api.get('/auth/user/me');
      }
      setUser(res.data.user);
      setStoreContext(res.data.storeContext || null);
      setIsAuthenticated(true);
    } catch (error: any) {
      setUser(null);
      setStoreContext(null);
      setIsAuthenticated(false);
      // console.log("authentification echoue") // 💡 L'intercepteur gère déjà les messages, peut être supprimé
      if (process.env.NODE_ENV === 'development' && !suppressErrorToast) {
        console.warn(
          'Authentication fetch failed, user not authenticated.',
          error.response?.data || error.message
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, isLoading, pathname]);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  useEffect(() => {
    if (isLoading) return;
    const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

    if (isAuthenticated && !storeContext && pathname !== '/select-store') {
      router.replace('/select-store');
      return;
    }

    if (isAuthenticated && storeContext && pathname === '/select-store') {
      router.replace('/dashboard');
      return;
    }

    if (!isAuthenticated && !isPublic) {
      router.replace('/signin');
    }
  }, [isAuthenticated, isLoading, pathname, storeContext, router]);

  const login = useCallback(
    async (credentials: Credentials) => {
      try {
        await api.post('/auth/login', credentials, { withCredentials: true });
        await fetchMe();
        toast.success('Connexion réussie');
        // router.push('/select-store');
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Erreur de connexion');
        throw error;
      }
    },
    [fetchMe]
  );

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout', {}, { withCredentials: true });
    } catch (err) {
      console.warn('Erreur logout côté serveur', err);
    } finally {
      setUser(null);
      setStoreContext(null);
      setIsAuthenticated(false);
      router.push('/signin');
    }
  }, [router]);

  const selectStore = useCallback(
    async (storeUserId: number) => {
      try {
        await api.post(
          '/auth/select-store',
          { store_user_id: storeUserId },
          { withCredentials: true }
        );
        await fetchMe();
        toast.success('Boutique sélectionnée');
        router.push('/dashboard');
      } catch (err) {
        toast.error('Échec sélection boutique');
        throw err;
      }
    },
    [fetchMe, router]
  );

  const hasPermission = useCallback(
    (key: PermissionKey) => storeContext?.permissions.includes(key) ?? false,
    [storeContext]
  );

  const hasAnyPermission = useCallback(
    (keys: PermissionKey[]) => keys.some((k) => hasPermission(k)),
    [hasPermission]
  );

  const hasAllPermissions = useCallback(
    (keys: PermissionKey[]) => keys.every((k) => hasPermission(k)),
    [hasPermission]
  );

  const value = useMemo<AuthContextType>(
    () => ({
      isAuthenticated,
      isLoading,
      user,
      storeContext,
      login,
      logout,
      selectStore,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      hasStoreContext: !!storeContext,
      sidebarOpen,
      setSidebarOpen,
      cashRegisterSessionId,
      setCashRegisterSessionId,
      fetchMe,
    }),
    [
      isAuthenticated,
      isLoading,
      user,
      storeContext,
      login,
      logout,
      selectStore,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      sidebarOpen,
      cashRegisterSessionId,
      fetchMe,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
