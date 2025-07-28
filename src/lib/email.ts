// // src/lib/api.ts
// import axios from 'axios';
// import { toast } from 'react-hot-toast';
// import { Product, Category } from '@/types/product';
// import { PaymentMethod, Sale, CashRegister, CashRegisterSession } from '@/types/pos';
// import { Store, User } from '@/types/auth'; // Assurez-vous que User et Store sont importés

// interface MockData {
//   users: User[];
//   stores: Store[];
//   products: Product[];
//   categories: Category[];
//   paymentMethods: PaymentMethod[];
//   cashRegisters: CashRegister[]; // Assurez-vous que c'est là
//   sales: Sale[]; // Pour l'historique des ventes/sessions
// }

// // Données fictives initiales
// let mockData: MockData = {
//   users: [
//     { id: 1, name: 'Admin User', email: 'admin@shop.com', password: 'password', stores: [{ id: 1, name: 'Ma Super Boutique', address: '123 Rue du Commerce', currency: 'XAF', timezone: 'Africa/Douala', isActive: true }] },
//   ],
//   stores: [
//     { id: 1, name: 'Ma Super Boutique', address: '123 Rue du Commerce', currency: 'XAF', timezone: 'Africa/Douala', isActive: true },
//   ],
//   categories: [
//     { id: 1, name: 'Boissons', color: '#EF4444' },
//     { id: 2, name: 'Snacks', color: '#22C55E' },
//     { id: 3, name: 'Produits Frais', color: '#3B82F6' },
//     { id: 4, name: 'Épicerie', color: '#F59E0B' },
//   ],
//   products: [
//     { id: 1, name: 'Eau Minérale', barcode: '12345678', price: 500, stock: 100, categoryId: 1, isActive: true, category: { id: 1, name: 'Boissons', color: '#EF4444' } },
//     { id: 2, name: 'Jus de Fruits', barcode: '87654321', price: 1000, stock: 50, categoryId: 1, isActive: true, category: { id: 1, name: 'Boissons', color: '#EF4444' } },
//     { id: 3, name: 'Chips', barcode: '11223344', price: 250, stock: 200, categoryId: 2, isActive: true, category: { id: 2, name: 'Snacks', color: '#22C55E' } },
//     { id: 4, name: 'Chocolat', barcode: '44332211', price: 750, stock: 80, categoryId: 2, isActive: true, category: { id: 2, name: 'Snacks', color: '#22C55E' } },
//     { id: 5, name: 'Yaourt', barcode: '98765432', price: 400, stock: 30, categoryId: 3, isActive: true, category: { id: 3, name: 'Produits Frais', color: '#3B82F6' } },
//     { id: 6, name: 'Riz 1kg', barcode: '65432109', price: 2500, stock: 120, categoryId: 4, isActive: true, category: { id: 4, name: 'Épicerie', color: '#F59E0B' } },
//     { id: 7, name: 'Lait 1L', barcode: '10293847', price: 1200, stock: 40, categoryId: 3, isActive: true, category: { id: 3, name: 'Produits Frais', color: '#3B82F6' } },
//     { id: 8, name: 'Savon', barcode: '20394857', price: 800, stock: 60, categoryId: 4, isActive: true, category: { id: 4, name: 'Épicerie', color: '#F59E0B' } },
//     { id: 9, name: 'Jus d\'orange', barcode: '30495867', price: 900, stock: 70, categoryId: 1, isActive: true, category: { id: 1, name: 'Boissons', color: '#EF4444' } },
//     { id: 10, name: 'Biscuits', barcode: '40596877', price: 300, stock: 150, categoryId: 2, isActive: true, category: { id: 2, name: 'Snacks', color: '#22C55E' } },
//   ],
//   paymentMethods: [
//     { id: 1, name: 'Espèces', type: 'cash', isActive: true, requiresReference: false },
//     { id: 2, name: 'Carte Bancaire', type: 'card', isActive: true, requiresReference: true },
//     { id: 3, name: 'Mobile Money', type: 'mobile', isActive: true, requiresReference: true },
//   ],
//   cashRegisters: [
//     {
//       id: 1,
//       name: 'Caisse Principale',
//       location: 'Comptoir 1',
//       storeId: 1,
//       isActive: true,
//       currentSession: { // Exemple de session ouverte par défaut pour le test
//         id: 101,
//         cashRegisterId: 1,
//         openedByStoreUserId: 1,
//         openedAt: new Date(Date.now() - 3600 * 1000).toISOString(), // Il y a 1 heure
//         status: 'open',
//         initialCash: 50000,
//         closingCash: null,
//         closedAt: null,
//         currentCash: 50000, // Mis à jour avec les ventes
//         salesCount: 0,
//         totalSalesAmount: 0,
//       },
//     },
//     {
//       id: 2,
//       name: 'Caisse Secondaire',
//       location: 'Entrée',
//       storeId: 1,
//       isActive: true,
//       currentSession: null, // Celle-ci est fermée
//     },
//     {
//       id: 3,
//       name: 'Caisse Rapide',
//       location: 'Drive-Thru',
//       storeId: 1,
//       isActive: false, // Inactive
//       currentSession: null,
//     },
//   ],
//   sales: [], // Pour stocker les ventes enregistrées
// };

// // --- Fonctions utilitaires simulant l'API ---
// export const api = {
//   // ... (vos fonctions existantes pour auth, getShopData, etc.) ...

//   post: async (path: string, data: any): Promise<any> => {
//     // Simuler un délai réseau
//     await new Promise(resolve => setTimeout(resolve, 500));

//     // Logic for authentication, if needed
//     if (path === '/auth/signin') {
//       const user = mockData.users.find(u => u.email === data.email && u.password === data.password);
//       if (user) {
//         return { data: { user } };
//       }
//       throw new Error('Email ou mot de passe incorrect.');
//     }

//     // Simuler les endpoints des sessions de caisse
//     if (path === '/cash-register-sessions/open') {
//       const { cashRegisterId, openedByStoreUserId, initialCash } = data;
//       const register = mockData.cashRegisters.find(cr => cr.id === cashRegisterId);

//       if (!register) throw new Error('Caisse enregistreuse introuvable.');
//       if (register.currentSession?.status === 'open') throw new Error('Cette caisse a déjà une session ouverte.');

//       const newSession: CashRegisterSession = {
//         id: Math.floor(Math.random() * 100000) + 1, // ID aléatoire
//         cashRegisterId,
//         openedByStoreUserId,
//         openedAt: new Date().toISOString(),
//         status: 'open',
//         initialCash,
//         closingCash: null,
//         closedAt: null,
//         currentCash: initialCash, // Solde actuel initialisé
//         salesCount: 0,
//         totalSalesAmount: 0,
//         name: register.name, // Pour référence rapide
//         openedBy: mockData.users.find(u => u.id === openedByStoreUserId),
//       };
//       register.currentSession = newSession;
//       // Ajoutez la session à un historique global si vous voulez un historique persistant pour toutes les sessions
//       // mockData.cashRegisterSessionsHistory.push(newSession);
//       toast.success(`Session ouverte pour ${register.name}.`);
//       return { data: { session: newSession } };
//     }

//     if (path === '/cash-register-sessions/close') {
//       const { sessionId, closingCash, closedByStoreUserId } = data;
//       let foundSession: CashRegisterSession | undefined = undefined;
//       let foundRegister: CashRegister | undefined = undefined;

//       // Trouver la session ouverte par son ID et la caisse associée
//       mockData.cashRegisters.forEach(cr => {
//         if (cr.currentSession && cr.currentSession.id === sessionId && cr.currentSession.status === 'open') {
//           foundSession = cr.currentSession;
//           foundRegister = cr;
//         }
//       });

//       if (!foundSession || !foundRegister) throw new Error('Session de caisse introuvable ou déjà fermée.');

//       foundSession.status = 'closed';
//       foundSession.closingCash = closingCash;
//       foundSession.closedAt = new Date().toISOString();
//       foundSession.closedByStoreUserId = closedByStoreUserId;
//       foundSession.closedBy = mockData.users.find(u => u.id === closedByStoreUserId);

//       // IMPORTANT: Réinitialiser currentSession à null pour la caisse après fermeture
//       foundRegister.currentSession = null;

//       toast.success(`Session ${foundSession.name} fermée.`);
//       return { data: { session: foundSession } };
//     }

//     if (path.startsWith('/cash-register-sessions/history/')) {
//       const registerId = parseInt(path.split('/').pop() || '');
//       // Pour la démo, nous allons simuler un historique simple.
//       // En production, vous auriez une collection dédiée à l'historique des sessions.
//       // Ici, nous allons juste prendre toutes les sessions fermées et l'actuelle si ouverte pour la caisse donnée.
//       const history = mockData.sales // Simulez l'historique de sessions via les sales
//         .filter(sale => {
//             const saleCashRegister = mockData.cashRegisters.find(cr => cr.id === sale.cashRegisterId);
//             return saleCashRegister && saleCashRegister.id === registerId;
//         })
//         .map(sale => { // Créez une session fictive basée sur la vente pour l'affichage
//             return {
//                 id: Math.random() * 1000, // ID fictif
//                 cashRegisterId: registerId,
//                 openedByStoreUserId: sale.createdByStoreUserId,
//                 openedAt: sale.saleDate,
//                 status: 'closed', // Simuler comme fermé pour l'historique
//                 initialCash: 0, // Ne peut pas être déduit ici
//                 closingCash: sale.totalAmount, // Le total de la vente
//                 closedByStoreUserId: sale.createdByStoreUserId,
//                 closedAt: sale.saleDate,
//                 totalSalesAmount: sale.totalAmount,
//                 salesCount: 1,
//                 openedBy: mockData.users.find(u => u.id === sale.createdByStoreUserId),
//                 closedBy: mockData.users.find(u => u.id === sale.createdByStoreUserId),
//             } as CashRegisterSession;
//         });

//         // Ajoutez la session actuelle si elle est ouverte et correspond
//         const currentRegister = mockData.cashRegisters.find(cr => cr.id === registerId);
//         if (currentRegister?.currentSession?.status === 'open') {
//             history.unshift(currentRegister.currentSession); // Ajoute la session ouverte en premier
//         }

//         // Pour un historique réel, vous auriez besoin de plus de données
//         // de vos mockData, ou une structure dédiée aux sessions passées.
//         // Pour l'instant, on va simuler quelques sessions historiques fixes pour une caisse.
//         if (registerId === 1) {
//             history.push({
//                 id: 201, cashRegisterId: 1, openedByStoreUserId: 1, openedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(), status: 'closed', initialCash: 10000, closingCash: 15000, closedByStoreUserId: 1, closedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000 + 8 * 3600 * 1000).toISOString(), totalSalesAmount: 5000, salesCount: 5, openedBy: mockData.users[0], closedBy: mockData.users[0]
//             });
//             history.push({
//                 id: 202, cashRegisterId: 1, openedByStoreUserId: 1, openedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(), status: 'closed', initialCash: 20000, closingCash: 28000, closedByStoreUserId: 1, closedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000 + 10 * 3600 * 1000).toISOString(), totalSalesAmount: 8000, salesCount: 10, openedBy: mockData.users[0], closedBy: mockData.users[0]
//             });
//         }


//       return { data: { history: history.sort((a, b) => new Date(b.openedAt).getTime() - new Date(a.openedAt).getTime()) } };
//     }

//     // Logic for sales
//     if (path === '/sales') {
//       const { storeId, cashRegisterSessionId, createdByStoreUserId, saleItems, payments, notes, discountAmount } = data;

//       // Trouver la session de caisse ouverte correspondante
//       let currentCashRegister: CashRegister | undefined = undefined;
//       let currentSession: CashRegisterSession | undefined = undefined;

//       mockData.cashRegisters.forEach(cr => {
//         if (cr.currentSession && cr.currentSession.id === cashRegisterSessionId) {
//           currentCashRegister = cr;
//           currentSession = cr.currentSession;
//         }
//       });

//       if (!currentSession) {
//         throw new Error('Session de caisse non trouvée ou non ouverte.');
//       }

//       const totalAmount = saleItems.reduce((sum: number, item: any) => sum + (item.quantity * mockData.products.find(p => p.id === item.productId)!.price - item.itemDiscount), 0) - discountAmount;

//       const newSale: Sale = {
//         id: mockData.sales.length + 1,
//         storeId,
//         cashRegisterId: currentCashRegister!.id, // L'ID de la caisse
//         cashRegisterSessionId,
//         saleDate: new Date().toISOString(),
//         totalAmount,
//         discountAmount,
//         notes,
//         createdByStoreUserId,
//         saleItems: saleItems.map((item: any) => ({
//           ...item,
//           product: mockData.products.find(p => p.id === item.productId), // Ajouter l'objet produit complet
//           subtotal: item.quantity * mockData.products.find(p => p.id === item.productId)!.price - item.itemDiscount,
//         })),
//         payments,
//         receipt: `
//           --- REÇU DE VENTE ---
//           Boutique: ${mockData.stores.find(s => s.id === storeId)?.name}
//           Date: ${new Date().toLocaleString()}
//           Session: ${currentSession.name || currentSession.id}

//           Articles:
//           ${saleItems.map((item: any) => {
//             const product = mockData.products.find(p => p.id === item.productId);
//             return `- ${product?.name} x${item.quantity} (${item.productPrice} XAF/u) - ${item.itemDiscount > 0 ? `Remise: ${item.itemDiscount} XAF ` : ''}Sous-total: ${ (item.quantity * product!.price - item.itemDiscount).toLocaleString()} XAF`;
//           }).join('\n')}

//           --------------------
//           Sous-total: ${saleItems.reduce((sum: number, item: any) => sum + (item.quantity * mockData.products.find(p => p.id === item.productId)!.price - item.itemDiscount), 0).toLocaleString()} XAF
//           Remise Globale: ${discountAmount.toLocaleString()} XAF
//           TOTAL PAYÉ: ${totalAmount.toLocaleString()} XAF

//           Paiements:
//           ${payments.map((p: any) => {
//             const method = mockData.paymentMethods.find(pm => pm.id === p.paymentMethodId);
//             return `- ${method?.name}: ${p.amount.toLocaleString()} XAF ${p.transactionReference ? `(${p.transactionReference})` : ''}`;
//           }).join('\n')}

//           Monnaie: ${(payments.reduce((sum: number, p: any) => sum + p.amount, 0) - totalAmount).toLocaleString()} XAF

//           Vendu par: ${mockData.users.find(u => u.id === createdByStoreUserId)?.name}
//           Notes: ${notes || 'Aucune'}

//           Merci de votre achat !
//           --------------------
//         `,
//       };
//       mockData.sales.push(newSale);

//       // Mettre à jour le stock des produits
//       saleItems.forEach((item: any) => {
//         const product = mockData.products.find(p => p.id === item.productId);
//         if (product) {
//           product.stock -= item.quantity;
//         }
//       });

//       // Mettre à jour le solde de la session de caisse
//       if (currentSession) {
//         currentSession.currentCash = (currentSession.currentCash || 0) + totalAmount;
//         currentSession.salesCount = (currentSession.salesCount || 0) + 1;
//         currentSession.totalSalesAmount = (currentSession.totalSalesAmount || 0) + totalAmount;
//       }

//       return { data: { sale: newSale } };
//     }

//     // Logic for fetching shop data
//     if (path === '/shop-data') {
//       return { data: mockData };
//     }

//     // Default: If no specific path matches, return 404 or throw an error
//     throw new Error(`Endpoint non trouvé: ${path}`);
//   },
//   get: async (path: string): Promise<any> => {
//     // Simuler un délai réseau
//     await new Promise(resolve => setTimeout(resolve, 300));

//     if (path === '/shop-data') {
//       return { data: mockData };
//     }

//     if (path.startsWith('/cash-register-sessions/history/')) {
//         const registerId = parseInt(path.split('/').pop() || '');
//         const history = mockData.sales // Simulez l'historique de sessions via les sales
//         .filter(sale => {
//             const saleCashRegister = mockData.cashRegisters.find(cr => cr.id === sale.cashRegisterId);
//             return saleCashRegister && saleCashRegister.id === registerId;
//         })
//         .map(sale => { // Créez une session fictive basée sur la vente pour l'affichage
//             return {
//                 id: Math.random() * 100000 + 1, // ID fictif
//                 cashRegisterId: registerId,
//                 openedByStoreUserId: sale.createdByStoreUserId,
//                 openedAt: sale.saleDate,
//                 status: 'closed', // Simuler comme fermé pour l'historique
//                 initialCash: 0, // Ne peut pas être déduit ici
//                 finalCash: sale.totalAmount, // Le total de la vente
//                 closedByStoreUserId: sale.createdByStoreUserId,
//                 closedAt: sale.saleDate,
//                 totalSalesAmount: sale.totalAmount,
//                 salesCount: 1,
//                 openedBy: mockData.users.find(u => u.id === sale.createdByStoreUserId),
//                 closedBy: mockData.users.find(u => u.id === sale.createdByStoreUserId),
//             } as CashRegisterSession;
//         });

//         // Ajoutez la session actuelle si elle est ouverte et correspond
//         const currentRegister = mockData.cashRegisters.find(cr => cr.id === registerId);
//         if (currentRegister?.currentSession?.status === 'open') {
//             history.unshift(currentRegister.currentSession); // Ajoute la session ouverte en premier
//         }

//         // Pour un historique réel, vous auriez besoin de plus de données
//         // de vos mockData, ou une structure dédiée aux sessions passées.
//         // Pour l'instant, on va simuler quelques sessions historiques fixes pour une caisse.
//         if (registerId === 1) { // Exemple pour la caisse 1
//             history.push({
//                 id: 201, cashRegisterId: 1, openedByStoreUserId: 1, openedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(), status: 'closed', initialCash: 10000, closingCash: 15000, closedByStoreUserId: 1, closedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000 + 8 * 3600 * 1000).toISOString(), totalSalesAmount: 5000, salesCount: 5, openedBy: mockData.users[0], closedBy: mockData.users[0]
//             });
//             history.push({
//                 id: 202, cashRegisterId: 1, openedByStoreUserId: 1, openedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(), status: 'closed', initialCash: 20000, closingCash: 28000, closedByStoreUserId: 1, closedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000 + 10 * 3600 * 1000).toISOString(), totalSalesAmount: 8000, salesCount: 10, openedBy: mockData.users[0], closedBy: mockData.users[0]
//             });
//         }

//         return { data: { history: history.sort((a, b) => new Date(b.openedAt).getTime() - new Date(a.openedAt).getTime()) } };
//     }

//     throw new Error(`Endpoint non trouvé: ${path}`);
//   },
// };

// export const getShopData = async (): Promise<MockData> => {
//   // Simuler une requête réelle en renvoyant une copie profonde des données
//   return JSON.parse(JSON.stringify(mockData));
// };

// export const findProductByBarcode = async (barcode: string): Promise<Product | undefined> => {
//   await new Promise(resolve => setTimeout(resolve, 200));
//   return mockData.products.find(p => p.barcode === barcode);
// };

// export const updateMockData = (newData: Partial<MockData>) => {
//   mockData = { ...mockData, ...newData };
// };