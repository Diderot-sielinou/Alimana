import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// =============================================================================
// CONFIGURATION
// =============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

// =============================================================================
// API INSTANCE
// =============================================================================

/**
 * Instance Axios configurée pour communiquer avec api.alimana.cc
 */
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  // ✅ CRUCIAL: Permet l'envoi/réception des cookies cross-subdomain
  withCredentials: true,
});

// =============================================================================
// TOKEN MANAGEMENT (Backup pour compatibilité)
// =============================================================================

const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

/**
 * Stocke les tokens dans localStorage (backup si cookies échouent)
 */
export const storeTokens = (accessToken: string, refreshToken?: string): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(TOKEN_KEY, accessToken);
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  } catch (error) {
    console.error('Failed to store tokens:', error);
  }
};

/**
 * Récupère les tokens depuis localStorage
 */
export const getStoredTokens = (): { accessToken: string | null; refreshToken: string | null } => {
  if (typeof window === 'undefined') {
    return { accessToken: null, refreshToken: null };
  }

  try {
    return {
      accessToken: localStorage.getItem(TOKEN_KEY),
      refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
    };
  } catch {
    return { accessToken: null, refreshToken: null };
  }
};

/**
 * Efface les tokens du localStorage
 */
export const clearStoredTokens = (): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to clear tokens:', error);
  }
};

/**
 * Configure le header Authorization
 */
export const setAuthToken = (token: string | null): void => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

/**
 * Efface le token d'authentification
 */
export const clearAuthToken = (): void => {
  delete api.defaults.headers.common['Authorization'];
  clearStoredTokens();
};

// =============================================================================
// REQUEST INTERCEPTOR
// =============================================================================

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Si pas de token dans les headers, essaye depuis localStorage (backup)
    if (!config.headers['Authorization']) {
      const { accessToken } = getStoredTokens();
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// =============================================================================
// RESPONSE INTERCEPTOR - AUTO REFRESH
// =============================================================================

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null): void => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Si erreur 401 et pas déjà en retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Ne pas retry pour les routes d'auth (sauf /auth/user/me et /auth/store/me)
      const url = originalRequest.url || '';
      const isAuthEndpoint =
        url.includes('/auth/login') ||
        url.includes('/auth/register') ||
        url.includes('/auth/refresh') ||
        url.includes('/auth/logout');

      if (isAuthEndpoint) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Si déjà en train de refresh, ajoute à la queue
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // ✅ Appel refresh - les cookies sont envoyés automatiquement avec withCredentials
        const response = await api.post('/auth/refresh', {});

        const { accessToken, refreshToken } = response.data;

        // Stocke aussi dans localStorage (backup)
        if (accessToken) {
          storeTokens(accessToken, refreshToken);
          setAuthToken(accessToken);
        }

        processQueue(null, accessToken);

        // Retry la requête originale
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        clearAuthToken();

        // Redirige vers login
        if (typeof window !== 'undefined') {
          window.location.href = '/signin';
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// =============================================================================
// INITIALIZATION
// =============================================================================

/**
 * Initialise l'API avec le token stocké
 */
export const initializeApi = (): void => {
  const { accessToken } = getStoredTokens();
  if (accessToken) {
    setAuthToken(accessToken);
  }
};

// Auto-initialize côté client
if (typeof window !== 'undefined') {
  initializeApi();
}

export default api;
