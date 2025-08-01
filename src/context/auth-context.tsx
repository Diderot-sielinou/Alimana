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
  hasFetchedMe: boolean;
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
  const [hasFetchedMe, setHasFetchedMe] = useState(false);
  const [cashRegisterSessionId, setCashRegisterSessionId] = useState<number | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  const fetchUser = useCallback(async () => {
    try {
      const res = await api.get('/auth/user/me');
      if (!res?.data) throw new Error('Utilisateur non trouvé');
      return res.data as User;
    } catch {
      return null;
    }
  }, []);

  const fetchStoreContext = useCallback(async () => {
    console.log('appeelle de la fonction pour fect storecontext');
    try {
      console.log('appeelle de la fonction pour fect storecontext dans le try');

      const res = await api.get('/auth/store/me'); // renvoie contexte boutique si existant
      console.log('afficge la requete', res);
      if (!res?.data) return null;
      return res.data as StoreContext;
    } catch {
      return null;
    }
  }, []);

  const fetchMe = useCallback(async () => {
    setIsLoading(true);
    try {
      const [userData, storeData] = await Promise.all([fetchUser(), fetchStoreContext()]);
      setUser(userData);
      setStoreContext(storeData);
      setIsAuthenticated(!!userData);
      setHasFetchedMe(true);
      console.log('user', userData);
      console.log('store data', storeData);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      setUser(null);
      setStoreContext(null);
      setIsAuthenticated(false);
      setHasFetchedMe(false);
    } finally {
      setIsLoading(false);
    }
  }, [fetchUser, fetchStoreContext]);

  // Appel initial
  useEffect(() => {
    console.log(hasFetchedMe);
    console.log(user);
    console.log(storeContext);
    // fetchMe();
  }, [fetchMe, hasFetchedMe, storeContext, user]);

  // Redirection selon auth + store context

  useEffect(() => {
    if (!hasFetchedMe || isLoading) return;

    const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

    const safeRedirect = (path: string) => {
      if (pathname !== path) router.replace(path);
    };

    if (isAuthenticated && !storeContext && pathname !== '/select-store') {
      safeRedirect('/select-store');
      return;
    }

    if (isAuthenticated && storeContext && pathname === '/select-store') {
      safeRedirect('/dashboard');
      return;
    }

    if (!isAuthenticated && !isPublic) {
      safeRedirect('/signin');
    }
  }, [isAuthenticated, isLoading, hasFetchedMe, pathname, storeContext, router]);

  const login = useCallback(
    async (credentials: Credentials) => {
      await api.post('/auth/login', credentials);
      toast.success('Sign In');
      await fetchMe();
      router.push('/select-store');
    },
    [fetchMe, router]
  );

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
      toast.success('Logout successful');
    } finally {
      setUser(null);
      setStoreContext(null);
      setIsAuthenticated(false);
      router.push('/signin');
    }
  }, [router]);

  const selectStore = useCallback(
    async (storeUserId: number) => {
      console.log('appeelle de la fonction select pour fect avec', storeUserId);

      const response = await api.post('/auth/select-store', { storeUserId: storeUserId });
      const accessToken = response.data.accessToken;
      localStorage.setItem('accessToken', accessToken);
      console.log(response);
      await fetchMe(); // rafraîchir user + storeContext
      toast.success('Store has been selected');
      router.push('/dashboard');
    },
    [fetchMe, router]
  );

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
      hasFetchedMe,
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
      hasFetchedMe,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
