import { toast } from 'react-hot-toast';
import axios from 'axios'
// import { Product, Category } from '@/types/product';
// import { PaymentMethod, CashRegister, Sale } from '@/types/pos';
// import { User, Store } from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // 🔐 Gestion du 401 (token expiré → refresh)
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });
        return api(originalRequest); // rejoue la requête avec nouveau token
      } catch (refreshError) {
        toast.error('Votre session a expiré. Veuillez vous reconnecter.');
        window.location.href = '/signin';
        return Promise.reject(refreshError);
      }
    }

    //  Gestion du 403 Forbidden
    if (status === 403) {
      toast.error("Accès refusé. Vous n'avez pas la permission.");
      // Optionnel : redirection automatique
      // window.location.href = '/unauthorized';
    }

    //  Gestion des erreurs serveur (500+)
    if (status >= 500) {
      toast.error('Une erreur interne est survenue. Réessayez plus tard.');
    }

    //  Gestion des erreurs client (400+)
    if (status >= 400 && status < 500 && status !== 403 && status !== 401) {
      const message = error.response?.data?.error || 'Une erreur est survenue.';
      toast.error(message);
    }

    console.error('[API ERROR]', {
      url: originalRequest?.url,
      status,
      data: error.response?.data,
    });

    return Promise.reject(error);
  }

);