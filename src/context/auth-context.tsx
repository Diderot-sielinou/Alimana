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

  /**
   * ⚙️ Fetch l'utilisateur courant
   */
  const fetchMe = useCallback(async () => {
    const suppressErrorToast = pathname === PUBLIC_PATHS[0];

    setIsLoading(true);
    try {
      let res;
      try {
        res = await api.get('/auth/store/me');
      } catch {
        res = await api.get('/auth/user/me');
      }

      console.log(res);
      // ✅ Vérifie la structure retournée
      if (!res?.data?.user) throw new Error('Utilisateur non trouvé');
      setUser(res.data.user);

      setStoreContext(res.data.storeContext || null);
      setIsAuthenticated(true);
    } catch (error: any) {
      setUser(null);
      setStoreContext(null);
      setIsAuthenticated(false);
      if (process.env.NODE_ENV === 'development' && !suppressErrorToast) {
        console.warn('Échec d’authentification', error.response?.data || error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [pathname]);

  /**
   * 🔄 Appel initial de fetchMe
   */
  useEffect(() => {
    // fetchMe();
  }, [fetchMe]);

  /**
   * 🔁 Redirection automatique selon les droits
   */
  useEffect(() => {
    if (isLoading) return;

    const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

    if (isAuthenticated && !storeContext && pathname !== '/select-store') {
      router.replace('/select-store');
    }

    if (isAuthenticated && storeContext && pathname === '/select-store') {
      router.replace('/dashboard');
    }

    if (!isAuthenticated && !isPublic) {
      router.replace('/signin');
    }
  }, [isAuthenticated, isLoading, pathname, storeContext, router]);

  /**
   * 🔐 Login
   */
  const login = useCallback(
    async (credentials: Credentials) => {
      try {
        await api.post('/auth/login', credentials); // no need for withCredentials
        toast.success('Connexion réussie');
        await fetchMe();
        router.push('/select-store');
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Erreur de connexion');
        throw error;
      }
    },
    [fetchMe, router]
  );

  /**
   * 🔓 Logout
   */
  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
      toast.success('Déconnexion réussie');
    } catch (err) {
      console.warn('Erreur logout côté serveur', err);
    } finally {
      setUser(null);
      setStoreContext(null);
      setIsAuthenticated(false);
      router.push('/signin');
    }
  }, [router]);

  /**
   * 🏪 Sélection de boutique
   */
  const selectStore = useCallback(
    async (storeUserId: number) => {
      try {
        await api.post('/auth/select-store', { store_user_id: storeUserId });
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

  /**
   * 🛡️ Permissions
   */
  const hasPermission = useCallback(
    (key: PermissionKey) => (storeContext?.permissions ?? []).includes(key),
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
