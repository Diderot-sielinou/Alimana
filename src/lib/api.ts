// src/lib/api.ts

import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// ✅ Création d’une instance axios configurée
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Cookies envoyés automatiquement
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Intercepteur de réponses pour gestion centralisée des erreurs
api.interceptors.response.use(
  (response) => response, // Laisse passer les réponses valides
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const isClientSide = typeof window !== 'undefined';

    // 🔄 Tentative de refresh si 401 non encore réessayé
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });
        return api(originalRequest); // Rejoue la requête d’origine
      } catch (refreshError) {
        if (isClientSide) {
          toast.error('Session expirée. Veuillez vous reconnecter.');
          window.location.href = '/signin';
        }
        return Promise.reject(refreshError);
      }
    }

    // ❌ 403 : Accès interdit
    if (status === 403 && isClientSide) {
      toast.error("Accès refusé. Vous n'avez pas la permission.");
      window.location.href = '/unauthorized';
    }

    // ❌ 500+ : Erreur serveur
    if (status >= 500) {
      toast.error('Erreur interne du serveur. Réessayez plus tard.');
    }

    // ❌ 400-499 hors 401/403 : Mauvaise requête
    if (status >= 400 && status < 500 && status !== 401 && status !== 403) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Erreur lors de la requête.';
      toast.error(message);
    }

    // 🐞 Log complet pour le débogage (dev seulement)
    if (process.env.NODE_ENV === 'development') {
      console.error('[API ERROR]', {
        url: originalRequest?.url,
        status,
        method: originalRequest?.method,
        data: error.response?.data,
        message: error.message,
      });
    }

    return Promise.reject(error); // Laisse les composants gérer l’échec
  }
);
