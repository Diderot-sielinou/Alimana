import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// =============================================================================
// CONSTANTS
// =============================================================================
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
const TOKEN_STORAGE_KEY = 'auth_tokens';

interface StoredTokens {
  accessToken: string | null;
  refreshToken: string | null;
}

// =============================================================================
// TOKEN STORAGE HELPERS
// =============================================================================

/**
 * Stocke les tokens dans localStorage
 */
export const storeTokens = (accessToken: string, refreshToken: string): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify({ accessToken, refreshToken }));
  } catch (error) {
    console.error('Failed to store tokens:', error);
  }
};

/**
 * Récupère les tokens depuis localStorage
 */
export const getStoredTokens = (): StoredTokens => {
  if (typeof window === 'undefined') {
    return { accessToken: null, refreshToken: null };
  }

  try {
    const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!stored) return { accessToken: null, refreshToken: null };

    return JSON.parse(stored) as StoredTokens;
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
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    // Cleanup legacy key if exists
    localStorage.removeItem('accessToken');
  } catch (error) {
    console.error('Failed to clear tokens:', error);
  }
};

// =============================================================================
// API INSTANCE
// =============================================================================

/**
 * Instance Axios configurée
 */
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  // ✅ Toujours envoyer les cookies (pour les cas où le domaine est partagé)
  withCredentials: true,
});

// =============================================================================
// TOKEN MANAGEMENT
// =============================================================================

/**
 * Configure le token d'authentification pour les requêtes
 */
export const setAuthToken = (token: string | null): void => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

/**
 * Efface le token et le storage
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
    // Si pas de token dans les headers, essaye de le récupérer du storage
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
// RESPONSE INTERCEPTOR - TOKEN REFRESH
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
      // Ne pas retry pour les routes d'auth
      const isAuthRoute = originalRequest.url?.includes('/auth/');
      if (isAuthRoute && !originalRequest.url?.includes('/auth/user/me')) {
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
        const { refreshToken } = getStoredTokens();

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // ✅ Envoie le refresh token dans le body (cross-domain compatible)
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken },
          { withCredentials: true }
        );

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

        // Stocke les nouveaux tokens
        storeTokens(newAccessToken, newRefreshToken);
        setAuthToken(newAccessToken);

        // Process la queue avec le nouveau token
        processQueue(null, newAccessToken);

        // Retry la requête originale
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Échec du refresh - déconnexion
        processQueue(refreshError as Error, null);
        clearAuthToken();

        // Redirige vers login si côté client
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
 * Initialise l'API avec le token stocké (à appeler au démarrage de l'app)
 */
export const initializeApi = (): void => {
  const { accessToken } = getStoredTokens();
  if (accessToken) {
    setAuthToken(accessToken);
  }
};

// Auto-initialize si côté client
if (typeof window !== 'undefined') {
  initializeApi();
}

export default api;
