// src/lib/api.ts
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// On crée d'abord une instance sans token
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur requête (défini après création, donc côté client uniquement)
if (typeof window !== 'undefined') {
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}

// Intercepteur réponse
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const isClientSide = typeof window !== 'undefined';

    // Éviter une boucle infinie sur /auth/refresh
    if (originalRequest.url?.endsWith('/auth/refresh')) {
      if (isClientSide) {
        toast.error('Session expirée. Veuillez vous reconnecter.');
        window.location.href = '/signin';
      }
      return Promise.reject(error);
    }

    // Tentative de refresh automatique
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });
        return api(originalRequest);
      } catch (refreshError) {
        if (isClientSide) {
          if (window.location.pathname !== '/signin') {
            toast.error('Session expirée. Veuillez vous reconnecter.');
          }
          window.location.href = '/signin';
        }
        return Promise.reject(refreshError);
      }
    }

    if (status === 403 && isClientSide) {
      toast.error("Accès refusé. Vous n'avez pas la permission.");
      window.location.href = '/unauthorized';
    }

    if (status >= 500) {
      toast.error('Erreur interne du serveur. Réessayez plus tard.');
    }

    if (status >= 400 && status < 500 && status !== 401 && status !== 403) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Erreur lors de la requête.';
      toast.error(message);
    }

    if (process.env.NODE_ENV === 'development') {
      console.error('[API ERROR]', {
        url: originalRequest?.url,
        status,
        method: originalRequest?.method,
        data: error.response?.data,
        message: error.message,
      });
    }

    return Promise.reject(error);
  }
);
