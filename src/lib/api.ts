// import { toast } from 'react-hot-toast';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Intercepteur de réponses ---
// api.interceptors.response.use(
//   (response) => response, // Si la réponse est un succès, la laisser passer
//   async (error) => {
//     const originalRequest = error.config;
//     const status = error.response?.status;

//     //  Gestion du 401 (token expiré → refresh)
//     // Cette logique suppose que le backend renvoie un 401 lorsque le token d'accès est expiré
//     // et qu'il y a un mécanisme de token de rafraîchissement (refresh token) dans les cookies.
//     if (status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true; // Marque la requête comme ayant déjà tenté un refresh
//       try {
//         // Appelle l'endpoint de rafraîchissement du token sur le backend.
//         // Le backend doit lire le refresh token du cookie, générer un nouveau token d'accès,
//         // et le renvoyer dans un nouveau cookie (HttpOnly).
//         await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });

//         // Si le refresh est réussi, rejoue la requête originale qui a échoué.
//         // Axios inclura automatiquement les nouveaux cookies si le backend les a définis.
//         return api(originalRequest);
//       } catch (refreshError) {
//         // Si le refresh échoue (ex: refresh token expiré ou invalide),
//         // l'utilisateur doit se reconnecter complètement.
//         toast.error('Votre session a expiré. Veuillez vous reconnecter.');
//         if (typeof window !== 'undefined') { // Vérifie si on est côté client
//           window.location.href = '/signin'; // Redirection vers la page de connexion
//         }
//         return Promise.reject(refreshError); // Rejette l'erreur pour la gestion ultérieure
//       }
//     }

//     //  Gestion du 403 Forbidden
//     // Indique que l'utilisateur est authentifié mais n'a pas les permissions nécessaires.
//     if (status === 403) {
//       toast.error("Accès refusé. Vous n'avez pas la permission pour cette action.");
//       //  : redirection automatique vers une page "Accès non autorisé"
//       if (typeof window !== 'undefined') {
//         window.location.href = '/unauthorized';
//       }
//     }

//     //  Gestion des erreurs serveur (500+)
//     // Erreurs internes du serveur.
//     if (status >= 500) {
//       toast.error('Une erreur interne est survenue. Veuillez réessayer plus tard.');
//     }

//     //  Gestion des erreurs client (400-499, hors 401/403 déjà gérés)
//     // Erreurs dues à des requêtes mal formées, données invalides, etc.
//     if (status >= 400 && status < 500 && status !== 403 && status !== 401) {
//       const message = error.response?.data?.error || error.response?.data?.message || 'Une erreur est survenue.';
//       toast.error(message);
//     }

//     // Log l'erreur pour le débogage
//     console.error('[API ERROR]', {
//       url: originalRequest?.url,
//       status,
//       data: error.response?.data,
//       message: error.message,
//     });

//     // Rejette la promesse pour que le code appelant puisse la gérer
//     return Promise.reject(error);
//   }

// );
