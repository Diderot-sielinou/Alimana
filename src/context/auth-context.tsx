'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { api, setAuthToken, clearAuthToken, getStoredTokens, storeTokens } from '@/lib/api';
import { StoreContext, User } from '@/types/auth';
import { ISignupValues } from '@/app/signup/page';
import { StoreProfileResponse, UserProfileResponse } from '@/types/store.interface';
import { IUser } from '@/types/user.interface';

// =============================================================================
// CONSTANTS
// =============================================================================
const PUBLIC_PATHS = [
  '/',
  '/signin',
  '/signup',
  '/auth/callback',
  '/auth/callback/google',
  '/accept-invite',
  '/invite',
] as const;

// const AUTH_STORAGE_KEY = 'auth_tokens';

// =============================================================================
// TYPES
// =============================================================================
type PermissionKey = string;

interface Credentials {
  email: string;
  password: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthState {
  user: User | null;
  storeContext: StoreContext | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasFetchedMe: boolean;
}

interface AuthContextType extends AuthState {
  ProfileUser: UserProfileResponse | null;
  storeInfo: StoreProfileResponse | null;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => Promise<void>;
  register: (credentials: ISignupValues) => Promise<void>;
  registerWithGoogle: () => void;
  selectStore: (storeUserId: number) => Promise<void>;
  hasPermission: (key: PermissionKey) => boolean;
  hasAnyPermission: (keys: PermissionKey[]) => boolean;
  hasAllPermissions: (keys: PermissionKey[]) => boolean;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  updateProfile: (updatedData: Partial<IUser>) => Promise<void>;
  hasStoreContext: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  cashRegisterSessionId: number | null;
  setCashRegisterSessionId: React.Dispatch<React.SetStateAction<number | null>>;
  fetchMe: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

// =============================================================================
// CONTEXT
// =============================================================================
const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Vérifie si un path est public
 */
const isPublicPath = (pathname: string): boolean => {
  return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
};

/**
 * Navigation sécurisée - évite les redirections inutiles
 */
const useSafeNavigate = () => {
  const router = useRouter();
  const pathname = usePathname();

  return useCallback(
    (path: string) => {
      if (pathname !== path) {
        router.replace(path);
      }
    },
    [router, pathname]
  );
};

// =============================================================================
// PROVIDER COMPONENT
// =============================================================================
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ---------------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------------
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    storeContext: null,
    isAuthenticated: false,
    isLoading: true,
    hasFetchedMe: false,
  });

  const [ProfileUser, setProfileUser] = useState<UserProfileResponse | null>(null);
  const [storeInfo, setStoreInfo] = useState<StoreProfileResponse | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cashRegisterSessionId, setCashRegisterSessionId] = useState<number | null>(null);
  const [authFlow, setAuthFlow] = useState<'signup' | 'login' | null>(null);

  // Ref pour éviter les doubles appels
  const isFetchingRef = useRef(false);
  const isInitializedRef = useRef(false);

  const router = useRouter();
  const pathname = usePathname();
  const safeNavigate = useSafeNavigate();

  // ---------------------------------------------------------------------------
  // TOKEN MANAGEMENT
  // ---------------------------------------------------------------------------

  /**
   * Sauvegarde les tokens de manière sécurisée
   */
  const saveTokens = useCallback((tokens: AuthTokens) => {
    storeTokens(tokens.accessToken, tokens.refreshToken);
    setAuthToken(tokens.accessToken);
  }, []);

  /**
   * Efface tous les tokens
   */
  const clearTokens = useCallback(() => {
    clearAuthToken();
  }, []);

  // ---------------------------------------------------------------------------
  // API CALLS
  // ---------------------------------------------------------------------------

  /**
   * Récupère les infos utilisateur de base
   */
  const fetchUser = useCallback(async (): Promise<User | null> => {
    try {
      const res = await api.get('/auth/user/me');
      return res?.data ?? null;
    } catch {
      return null;
    }
  }, []);

  /**
   * Récupère le contexte store si disponible
   */
  const fetchStoreContext = useCallback(async (): Promise<StoreContext | null> => {
    try {
      const res = await api.get('/auth/store/me');
      return res?.data ?? null;
    } catch {
      return null;
    }
  }, []);

  /**
   * Récupère le profil utilisateur complet
   */
  const fetchProfileUser = useCallback(async (): Promise<void> => {
    try {
      const response = await api.get('auth/profile/me');
      setProfileUser(response.data);
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  }, []);

  /**
   * Récupère les infos du store
   */
  const fetchStoreInfo = useCallback(async (storeId: number): Promise<void> => {
    try {
      const response = await api.get(`store/profile/${storeId}`);
      setStoreInfo(response.data);
    } catch (error) {
      console.error('Failed to load store info:', error);
    }
  }, []);

  // ---------------------------------------------------------------------------
  // MAIN AUTH FETCH
  // ---------------------------------------------------------------------------

  /**
   * Charge l'état d'authentification complet
   */
  const fetchMe = useCallback(async (): Promise<void> => {
    // Évite les appels concurrents
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    setAuthState((prev) => ({ ...prev, isLoading: true }));

    try {
      // Vérifie si on a un token stocké
      const { accessToken } = getStoredTokens();

      if (!accessToken) {
        setAuthState({
          user: null,
          storeContext: null,
          isAuthenticated: false,
          isLoading: false,
          hasFetchedMe: true,
        });
        return;
      }

      // Configure le token pour les requêtes
      setAuthToken(accessToken);

      // Fetch en parallèle
      const [userData, storeData] = await Promise.all([fetchUser(), fetchStoreContext()]);

      setAuthState({
        user: userData,
        storeContext: storeData,
        isAuthenticated: !!userData,
        isLoading: false,
        hasFetchedMe: true,
      });

      // Charge les données additionnelles si store context existe
      if (storeData?.storeId) {
        await Promise.all([fetchProfileUser(), fetchStoreInfo(storeData.storeId)]);
      }
    } catch (error) {
      console.error('Auth fetch error:', error);
      clearTokens();
      setAuthState({
        user: null,
        storeContext: null,
        isAuthenticated: false,
        isLoading: false,
        hasFetchedMe: true,
      });
    } finally {
      isFetchingRef.current = false;
    }
  }, [fetchUser, fetchStoreContext, fetchProfileUser, fetchStoreInfo, clearTokens]);

  /**
   * Rafraîchit les données utilisateur (après mise à jour)
   */
  const refreshUserData = useCallback(async (): Promise<void> => {
    if (authState.storeContext?.storeId) {
      await Promise.all([fetchProfileUser(), fetchStoreInfo(authState.storeContext.storeId)]);
    }
  }, [authState.storeContext?.storeId, fetchProfileUser, fetchStoreInfo]);

  // ---------------------------------------------------------------------------
  // INITIALIZATION
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (typeof window === 'undefined' || isInitializedRef.current) return;

    isInitializedRef.current = true;
    fetchMe();
  }, [fetchMe]);

  // ---------------------------------------------------------------------------
  // ROUTING PROTECTION
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!authState.hasFetchedMe || authState.isLoading) return;

    const isPublic = isPublicPath(pathname);
    const { isAuthenticated, storeContext } = authState;

    // Non authentifié sur page protégée
    if (!isAuthenticated && !isPublic) {
      safeNavigate('/signin');
      return;
    }

    // Authentifié sans store context
    if (isAuthenticated && !storeContext) {
      if (authFlow === 'signup') {
        safeNavigate('/create-store');
      } else if (pathname !== '/create-store') {
        safeNavigate('/select-store');
      }
      return;
    }

    // Authentifié avec store context sur select-store
    if (isAuthenticated && storeContext && pathname === '/select-store') {
      safeNavigate('/dashboard');
    }

    // Reset authFlow après utilisation
    if (authFlow && isAuthenticated && authState.hasFetchedMe) {
      setAuthFlow(null);
    }
  }, [authState, pathname, authFlow, safeNavigate]);

  // ---------------------------------------------------------------------------
  // AUTH ACTIONS
  // ---------------------------------------------------------------------------

  /**
   * Connexion avec email/password
   */
  const login = useCallback(
    async (credentials: Credentials): Promise<void> => {
      try {
        const response = await api.post('/auth/login', credentials);
        const { accessToken, refreshToken } = response.data;

        // ✅ Sauvegarde les tokens reçus dans le body
        saveTokens({ accessToken, refreshToken });

        toast.success('Connexion réussie');
        setAuthFlow('login');
        await fetchMe();
      } catch (error) {
        toast.error('Échec de la connexion');
        throw error;
      }
    },
    [fetchMe, saveTokens]
  );

  /**
   * Inscription
   */
  const register = useCallback(
    async (credentials: ISignupValues): Promise<void> => {
      try {
        const response = await api.post('/auth/register', credentials);
        const { accessToken, refreshToken } = response.data;

        // ✅ Sauvegarde les tokens reçus dans le body
        saveTokens({ accessToken, refreshToken });

        toast.success('Inscription réussie');
        setAuthFlow('signup');
        await fetchMe();
      } catch (error) {
        toast.error("Échec de l'inscription");
        throw error;
      }
    },
    [fetchMe, saveTokens]
  );

  /**
   * Inscription/Connexion avec Google
   * Note: Redirige vers le backend qui renverra vers /auth/callback avec les tokens
   */
  const registerWithGoogle = useCallback((): void => {
    // Sauvegarde le flow pour le callback
    sessionStorage.setItem('oauth_flow', 'google');

    // Redirige vers le backend
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`;
  }, []);

  /**
   * Sélection d'un store
   */
  const selectStore = useCallback(
    async (storeUserId: number): Promise<void> => {
      try {
        const response = await api.post('/auth/select-store', { storeUserId });
        const { accessToken, refreshToken } = response.data;

        saveTokens({ accessToken, refreshToken });

        await fetchMe();
        toast.success('Store sélectionné');
        router.push('/dashboard');
      } catch (error) {
        toast.error('Échec de la sélection du store');
        throw error;
      }
    },
    [fetchMe, router, saveTokens]
  );

  /**
   * Déconnexion
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      const { refreshToken } = getStoredTokens();
      await api.post('/auth/logout', { refreshToken });
      toast.success('Déconnexion réussie');
    } catch {
      // Ignore les erreurs de logout
    } finally {
      clearTokens();
      setAuthState({
        user: null,
        storeContext: null,
        isAuthenticated: false,
        isLoading: false,
        hasFetchedMe: true,
      });
      setProfileUser(null);
      setStoreInfo(null);
      router.replace('/signin');
    }
  }, [router, clearTokens]);

  /**
   * Mise à jour du profil
   */
  const updateProfile = useCallback(
    async (updatedData: Partial<IUser>): Promise<void> => {
      await api.patch('/auth/profile', updatedData);
      await fetchProfileUser();
      toast.success('Profil mis à jour');
    },
    [fetchProfileUser]
  );

  /**
   * Changement de mot de passe
   */
  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string): Promise<void> => {
      await api.post('/auth/change-password', { currentPassword, newPassword });
      toast.success('Mot de passe modifié');
    },
    []
  );

  // ---------------------------------------------------------------------------
  // PERMISSIONS
  // ---------------------------------------------------------------------------

  const hasPermission = useCallback(
    (key: PermissionKey): boolean => {
      return (authState.storeContext?.permissions ?? []).includes(key);
    },
    [authState.storeContext]
  );

  const hasAnyPermission = useCallback(
    (keys: PermissionKey[]): boolean => {
      return keys.some((k) => hasPermission(k));
    },
    [hasPermission]
  );

  const hasAllPermissions = useCallback(
    (keys: PermissionKey[]): boolean => {
      return keys.every((k) => hasPermission(k));
    },
    [hasPermission]
  );

  // ---------------------------------------------------------------------------
  // CONTEXT VALUE
  // ---------------------------------------------------------------------------

  const value = useMemo<AuthContextType>(
    () => ({
      ...authState,
      ProfileUser,
      storeInfo,
      login,
      logout,
      register,
      registerWithGoogle,
      selectStore,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      changePassword,
      updateProfile,
      hasStoreContext: !!authState.storeContext,
      sidebarOpen,
      setSidebarOpen,
      cashRegisterSessionId,
      setCashRegisterSessionId,
      fetchMe,
      refreshUserData,
    }),
    [
      authState,
      ProfileUser,
      storeInfo,
      login,
      logout,
      register,
      registerWithGoogle,
      selectStore,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      changePassword,
      updateProfile,
      sidebarOpen,
      cashRegisterSessionId,
      fetchMe,
      refreshUserData,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
