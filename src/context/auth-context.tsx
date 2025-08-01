'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { api } from '@/lib/api';
import { StoreContext, User } from '@/types/auth';
import { ISignupValues } from '@/app/signup/page';

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
  register: (credentials: ISignupValues) => Promise<void>;
  registerWithGoogle: () => Promise<void>;
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
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hasFetchedMe, setHasFetchedMe] = useState(false);
  const [cashRegisterSessionId, setCashRegisterSessionId] = useState<number | null>(null);
  const [authFlow, setAuthFlow] = useState<'signup' | 'login' | null>(null); // 👈 ajouté

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
    try {
      const res = await api.get('/auth/store/me');
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetchMe();
    }
  }, [fetchMe]);

  useEffect(() => {
    console.log(
      `utilisateur authentifier ${JSON.stringify(user)}, isAuthenticated: ${isAuthenticated} flow Auth ${authFlow}`
    );
  }, [authFlow, fetchMe, isAuthenticated, user]);

  useEffect(() => {
    if (!hasFetchedMe || isLoading) return;

    const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
    const safeRedirect = (path: string) => {
      if (pathname !== path) router.replace(path);
    };

    if (!isAuthenticated && !isPublic) {
      safeRedirect('/signin');
      return;
    }

    // if (isAuthenticated ) {
    //   safeRedirect('/select-store');
    //   return;
    // }

    if (isAuthenticated && !storeContext) {
      if (authFlow === 'signup') {
        safeRedirect('/create-store');
      } else {
        safeRedirect('/select-store');
      }
      return;
    }

    if (isAuthenticated && storeContext && pathname === '/select-store') {
      safeRedirect('/dashboard');
    }

    // reset authFlow une fois utilisé
    if (authFlow && isAuthenticated && hasFetchedMe) {
      setAuthFlow(null);
    }
  }, [isAuthenticated, isLoading, hasFetchedMe, pathname, storeContext, router, authFlow]);

  const login = useCallback(
    async (credentials: Credentials) => {
      await api.post('/auth/login', credentials);
      toast.success('Sign In');
      await fetchMe();
    },
    [fetchMe]
  );

  const register = useCallback(
    async (credentials: ISignupValues) => {
      await api.post('/auth/register', credentials);
      toast.success('Inscription réussie');
      setAuthFlow('signup');
      await fetchMe();
    },
    [fetchMe]
  );

  const registerWithGoogle = useCallback(async () => {
    try {
      window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Échec de l'inscription avec Google");
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
      toast.success('Logout successful');
    } finally {
      setUser(null);
      setStoreContext(null);
      setIsAuthenticated(false);
      router.replace('/signin');
    }
  }, [router]);

  const selectStore = useCallback(
    async (storeUserId: number) => {
      const response = await api.post('/auth/select-store', { storeUserId });
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
      register,
      registerWithGoogle,
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
      setSidebarOpen,
      cashRegisterSessionId,
      setCashRegisterSessionId,
      fetchMe,
      hasFetchedMe,
      register,
      registerWithGoogle,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
