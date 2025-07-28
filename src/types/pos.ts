import { Product } from "./product";

export interface CartItem {
  product: Product;
  quantity: number;
  discount: number;
  subtotal: number;
}

export interface PaymentMethod {
  id: number;
  name: string;
  type: 'cash' | 'card' | 'mobile' | 'bank_transfer';
  isActive: boolean;
  requiresReference: boolean;
}

export interface Payment {
  paymentMethodId: number;
  amount: number;
  transactionReference?: string;
}

export interface Sale {
  id: number;
  storeId: number;
  cashRegisterSessionId: number;
  createdByStoreUserId: number;
  saleItems: SaleItem[];
  payments: Payment[];
  totalAmount: number;
  discountAmount: number;
  notes?: string;
  receipt: string;
  createdAt: string;
}

export interface SaleItem {
  productId: number;
  quantity: number;
  price: number;
  itemDiscount: number;
  subtotal: number;
}

// export interface CashRegister {
//   id: number;
//   name: string;
//   location?: string;
//   isActive: boolean;
//   currentSession?: CashRegisterSession;
// }

// export interface CashRegisterSession {
//   id: number;
//   cashRegisterId: number;
//   initialCash: number;
//   finalCash?: number;
//   openedByStoreUserId: number;
//   closedByStoreUserId?: number;
//   openedAt: string;
//   closedAt?: string;
//   status: 'open' | 'closed';
// }

export interface CashRegisterSession {
  id: number;
  cashRegisterId: number;
  openedByStoreUserId: number;
  openedBy?: { id: number; name: string; email: string }; // Optionnel, si l'API retourne l'utilisateur
  openedAt: string; // ISO date string
  status: 'open' | 'closed';
  initialCash: number;
  finalCash: number | null;
  closedByStoreUserId?: number | null;
  closedBy?: { id: number; name: string; email: string }; // Optionnel
  closedAt: string | null; // ISO date string
  totalSalesAmount?: number; // Total des ventes réalisées pendant cette session
  salesCount?: number; // Nombre de ventes réalisées pendant cette session
  // Ajoutez d'autres champs pertinents si votre backend les fournit
  name?: string; // Nom de la caisse associée à la session (pour l'affichage rapide)
  currentCash?: number; // Solde actuel simulé (pour les sessions ouvertes)
}

export interface CashRegister {
  id: number;
  name: string;
  location: string;
  storeId: number;
  isActive: boolean;
  currentSession: CashRegisterSession | null; // La session ouverte actuellement, ou null
}