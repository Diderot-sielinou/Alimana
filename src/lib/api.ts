/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
// import { toast } from 'react-hot-toast';
// import { Product, Category } from '@/types/product';
// import { PaymentMethod, CashRegister, Sale } from '@/types/pos';
// import { User, Store } from '@/types/auth';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

// export const api = axios.create({
//   baseURL: API_BASE_URL,
//   withCredentials: true,
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// --- Intercepteur de réponses ---
// api.interceptors.response.use(
//   (response) => response,

//   async (error) => {
//     const originalRequest = error.config;
//     const status = error.response?.status;

//     // 🔐 Gestion du 401 (token expiré → refresh)
//     if (status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });
//         return api(originalRequest); // rejoue la requête avec nouveau token
//       } catch (refreshError) {
//         toast.error('Votre session a expiré. Veuillez vous reconnecter.');
//         window.location.href = '/signin';
//         return Promise.reject(refreshError);
//       }
//     }

//     //  Gestion du 403 Forbidden
//     if (status === 403) {
//       toast.error("Accès refusé. Vous n'avez pas la permission.");
//       // Optionnel : redirection automatique
//       // window.location.href = '/unauthorized';
//     }

//     //  Gestion des erreurs serveur (500+)
//     if (status >= 500) {
//       toast.error('Une erreur interne est survenue. Réessayez plus tard.');
//     }

//     //  Gestion des erreurs client (400+)
//     if (status >= 400 && status < 500 && status !== 403 && status !== 401) {
//       const message = error.response?.data?.error || 'Une erreur est survenue.';
//       toast.error(message);
//     }

//     console.error('[API ERROR]', {
//       url: originalRequest?.url,
//       status,
//       data: error.response?.data,
//     });

//     return Promise.reject(error);
//   }

// );

export const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});
// Données simulées
const mockData = {
  users: [
    {
      id: 1,
      email: 'admin@shop.com',
      firstName: 'Admin',
      lastName: 'Shop',
      role: {
        id: 1,
        name: 'Admin',
        permissions: [
          { id: 1, name: 'manage_products', resource: 'products', action: 'manage' },
          { id: 2, name: 'manage_sales', resource: 'sales', action: 'manage' },
          { id: 3, name: 'manage_users', resource: 'users', action: 'manage' },
        ],
      },
      stores: [
        {
          id: 1,
          name: 'Ma Boutique',
          currency: 'XAF',
          timezone: 'Africa/Douala',
          address: '123 Rue du Commerce, Yaoundé',
          phone: '+237 6XX XXX XXX',
          email: 'contact@maboutique.cm',
        },
      ],
    },
  ],
  products: [
    {
      id: 1,
      name: 'Eau Minérale',
      barcode: '12345678',
      price: 500,
      stock: 100,
      categoryId: 1,
      isActive: true,
      category: { id: 1, name: 'Boissons', color: '#EF4444' },
    },
    {
      id: 2,
      name: 'Jus de Fruits',
      barcode: '87654321',
      price: 1000,
      stock: 50,
      categoryId: 1,
      isActive: true,
      category: { id: 1, name: 'Boissons', color: '#EF4444' },
    },
    {
      id: 3,
      name: 'Chips',
      barcode: '11223344',
      price: 250,
      stock: 200,
      categoryId: 2,
      isActive: true,
      category: { id: 2, name: 'Snacks', color: '#22C55E' },
    },
    {
      id: 4,
      name: 'Chocolat',
      barcode: '44332211',
      price: 750,
      stock: 80,
      categoryId: 2,
      isActive: true,
      category: { id: 2, name: 'Snacks', color: '#22C55E' },
    },
    {
      id: 5,
      name: 'Yaourt',
      barcode: '98765432',
      price: 400,
      stock: 30,
      categoryId: 3,
      isActive: true,
      category: { id: 3, name: 'Produits Frais', color: '#3B82F6' },
    },
    {
      id: 6,
      name: 'Riz 1kg',
      barcode: '65432109',
      price: 2500,
      stock: 120,
      categoryId: 4,
      isActive: true,
      category: { id: 4, name: 'Épicerie', color: '#F59E0B' },
    },
    {
      id: 7,
      name: 'Lait 1L',
      barcode: '10293847',
      price: 1200,
      stock: 40,
      categoryId: 3,
      isActive: true,
      category: { id: 3, name: 'Produits Frais', color: '#3B82F6' },
    },
    {
      id: 8,
      name: 'Savon',
      barcode: '20394857',
      price: 800,
      stock: 60,
      categoryId: 4,
      isActive: true,
      category: { id: 4, name: 'Épicerie', color: '#F59E0B' },
    },
    {
      id: 9,
      name: "Jus d'orange",
      barcode: '30495867',
      price: 900,
      stock: 70,
      categoryId: 1,
      isActive: true,
      category: { id: 1, name: 'Boissons', color: '#EF4444' },
    },
    {
      id: 10,
      name: 'Biscuits',
      barcode: '40596877',
      price: 300,
      stock: 150,
      categoryId: 2,
      isActive: true,
      category: { id: 2, name: 'Snacks', color: '#22C55E' },
    },
  ],
  categories: [
    { id: 1, name: 'Boissons', description: 'Boissons diverses', color: '#3b82f6', isActive: true },
    {
      id: 2,
      name: 'Boulangerie',
      description: 'Produits de boulangerie',
      color: '#f59e0b',
      isActive: true,
    },
    {
      id: 3,
      name: 'Épicerie',
      description: "Produits d'épicerie",
      color: '#10b981',
      isActive: true,
    },
  ],
  paymentMethods: [
    { id: 1, name: 'Espèces', type: 'cash' as const, isActive: true, requiresReference: false },
    {
      id: 2,
      name: 'Mobile Money',
      type: 'mobile' as const,
      isActive: true,
      requiresReference: true,
    },
    {
      id: 3,
      name: 'Carte Bancaire',
      type: 'card' as const,
      isActive: true,
      requiresReference: false,
    },
    {
      id: 4,
      name: 'Virement',
      type: 'bank_transfer' as const,
      isActive: true,
      requiresReference: true,
    },
  ],
  cashRegisters: [
    {
      id: 1,
      name: 'Caisse Principale',
      location: 'Entrée',
      isActive: true,
      currentSession: {
        id: 1,
        cashRegisterId: 1,
        initialCash: 50000,
        openedByStoreUserId: 1,
        openedAt: '2024-01-01T08:00:00Z',
        status: 'open' as const,
      },
    },

    {
      id: 1,
      name: 'Caisse Principale',
      location: 'Comptoir 1',
      storeId: 1,
      isActive: true,
      currentSession: {
        // Assurez-vous d'avoir une session ouverte pour tester
        id: 101,
        cashRegisterId: 1,
        openedByStoreUserId: 1,
        openedAt: new Date().toISOString(),
        status: 'open', // IMPORTANT : doit être 'open'
        initialCash: 50000,
        closingCash: null,
        closedAt: null,
      },
    },
    {
      id: 1,
      name: 'Caisse Principale',
      location: 'Comptoir 1',
      storeId: 1,
      isActive: true,
      currentSession: {
        // Exemple de session ouverte par défaut pour le test
        id: 101,
        cashRegisterId: 1,
        openedByStoreUserId: 1,
        openedAt: new Date(Date.now() - 3600 * 1000).toISOString(), // Il y a 1 heure
        status: 'open',
        initialCash: 50000,
        closingCash: null,
        closedAt: null,
        currentCash: 50000, // Mis à jour avec les ventes
        salesCount: 0,
        totalSalesAmount: 0,
      },
    },
    {
      id: 2,
      name: 'Caisse Secondaire',
      location: 'Entrée',
      storeId: 1,
      isActive: true,
      currentSession: null, // Celle-ci est fermée
    },
    {
      id: 3,
      name: 'Caisse Rapide',
      location: 'Drive-Thru',
      storeId: 1,
      isActive: false, // Inactive
      currentSession: null,
    },
    // {
    //   id: 2,
    //   name: 'Caisse Express',
    //   location: 'Sortie',
    //   isActive: true
    // }
  ],
};

// Intercepteur pour simulation d'API
api.interceptors.request.use(
  (config) => {
    // Simulation d'un délai réseau
    return new Promise((resolve) => {
      setTimeout(() => resolve(config), Math.random() * 500 + 200);
    });
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.config?.url) {
      // Simulation des réponses API
      const url = error.config.url;
      const method = error.config.method?.toLowerCase();

      // Routes d'authentification
      if (url === '/auth/signin' && method === 'post') {
        const { email, password } = JSON.parse(error.config.data || '{}');
        const user = mockData.users.find((u) => u.email === email);

        if (user && password === 'password') {
          return Promise.resolve({
            data: {
              user,
              token: 'mock-jwt-token-' + user.id,
            },
          });
        } else {
          return Promise.reject({
            response: {
              status: 401,
              data: { message: 'Email ou mot de passe incorrect' },
            },
          });
        }
      }

      if (url === '/auth/me' && method === 'get') {
        return Promise.resolve({
          data: { user: mockData.users[0] },
        });
      }

      // Routes produits
      if (url === '/products' && method === 'get') {
        return Promise.resolve({
          data: {
            products: mockData.products,
            total: mockData.products.length,
            page: 1,
            limit: 50,
          },
        });
      }

      if (url.startsWith('/products/by-barcode/') && method === 'get') {
        const barcode = url.split('/').pop();
        const product = mockData.products.find((p) => p.barcode === barcode);

        if (product) {
          return Promise.resolve({ data: { product } });
        } else {
          return Promise.reject({
            response: {
              status: 404,
              data: { message: 'Produit non trouvé' },
            },
          });
        }
      }

      // Routes catégories
      if (url === '/categories' && method === 'get') {
        return Promise.resolve({
          data: { categories: mockData.categories },
        });
      }

      // Routes méthodes de paiement
      if (url === '/payment-methods' && method === 'get') {
        return Promise.resolve({
          data: { paymentMethods: mockData.paymentMethods },
        });
      }

      // Routes caisses
      if (url === '/cash-registers' && method === 'get') {
        return Promise.resolve({
          data: { cashRegisters: mockData.cashRegisters },
        });
      }

      // Route de vente
      if (url === '/sales' && method === 'post') {
        const saleData = JSON.parse(error.config.data || '{}');
        const sale = {
          id: Date.now(),
          ...saleData,
          totalAmount:
            saleData.saleItems.reduce(
              (sum: number, item: any) => sum + (item.quantity * item.price - item.itemDiscount),
              0
            ) - saleData.discountAmount,
          receipt: generateReceipt(saleData),
          createdAt: new Date().toISOString(),
        };

        return Promise.resolve({
          data: { sale },
        });
      }
    }

    return Promise.reject(error);
  }
);

const generateReceipt = (saleData: any): string => {
  const store = mockData.users[0].stores[0];
  const date = new Date().toLocaleString('fr-FR', {
    timeZone: store.timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  let receipt = `
=================================
        ${store.name}
=================================
${store.address}
Tel: ${store.phone}
Email: ${store.email}

Date: ${date}
Ticket #: ${Date.now()}
---------------------------------
`;

  // Ajouter les lignes des produits
  saleData.saleItems.forEach((item: any) => {
    const product = mockData.products.find((p) => p.id === item.productId);
    if (product) {
      receipt += `
${product.name} x${item.quantity} - ${item.quantity * product.price - item.itemDiscount} XAF`;
    }
  });

  // Calcul du sous-total
  const subtotal = saleData.saleItems.reduce((sum: number, item: any) => {
    const product = mockData.products.find((p) => p.id === item.productId);
    return sum + (item.quantity * (product?.price || 0) - item.itemDiscount);
  }, 0);

  receipt += `
---------------------------------
Sous-total:          ${subtotal} XAF`;

  if (saleData.discountAmount > 0) {
    receipt += `
Remise:              ${saleData.discountAmount} XAF`;
  }

  const total = subtotal - saleData.discountAmount;

  receipt += `
TOTAL:               ${total} XAF

---------------------------------
PAIEMENTS:`;

  saleData.payments.forEach((payment: any) => {
    const method = mockData.paymentMethods.find((m) => m.id === payment.paymentMethodId);
    receipt += `
${method?.name}:           ${payment.amount} XAF`;
    if (payment.transactionReference) {
      receipt += `
Réf: ${payment.transactionReference}`;
    }
  });

  if (saleData.notes) {
    receipt += `

Notes: ${saleData.notes}`;
  }

  receipt += `

=================================
    Merci de votre visite !
=================================`;

  return receipt;
};
