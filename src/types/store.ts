import { Product } from './product';

export interface StoreData {
  name: string;
  description: string;
  address: string;
  currency: string;
  city: string;
  state: string;
  zipCode: string;
  password: string;
  confirmPassword: string;
}

export type StoreField = keyof StoreData;

export type UpdateFormData = (field: StoreField, value: string) => void;

export type StoreErrors = Partial<Record<StoreField, string>>;
export enum Permission {
  // User Management
  MANAGE_USERS = 'manage_users',
  INVITE_USERS = 'invite_users',
  VIEW_USERS = 'view_users',

  // Product Management
  MANAGE_PRODUCTS = 'manage_products',
  ADD_PRODUCTS = 'add_products',
  EDIT_PRODUCTS = 'edit_products',
  DELETE_PRODUCTS = 'delete_products',
  VIEW_PRODUCTS = 'view_products',

  // Inventory Management
  MANAGE_INVENTORY = 'manage_inventory',
  VIEW_INVENTORY = 'view_inventory',
  UPDATE_STOCK = 'update_stock',

  // Sales & Orders
  MANAGE_ORDERS = 'manage_orders',
  VIEW_ORDERS = 'view_orders',
  PROCESS_ORDERS = 'process_orders',
  CANCEL_ORDERS = 'cancel_orders',

  // Sales Management
  MAKE_SALES = 'make_sales',
  VIEW_SALES = 'view_sales',
  MANAGE_SALES = 'manage_sales',

  // Analytics & Reports
  VIEW_ANALYTICS = 'view_analytics',
  VIEW_REPORTS = 'view_reports',
  EXPORT_DATA = 'export_data',

  // Store Settings
  MANAGE_STORE_SETTINGS = 'manage_store_settings',
  VIEW_STORE_SETTINGS = 'view_store_settings',
}

/**
 * Interfaces pour les méthodes de paiement
 */

export interface PaymentMethod {
  paymentMethodId: string;
  shopId: string;
  name: string;
  type: 'cash' | 'card' | 'mobile_money' | 'other'; // Types de paiement
  provider?: string; // Ex: "MTN", "Orange" pour mobile money
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Interfaces pour les caisses enregistreuses (CashRegister) et sessions
 */

export interface CashRegister {
  cashRegisterId: string;
  storeId: number;
  name: string;
  location: string;
  status: 'open' | 'closed';
  currentSessionId?: string; // ID de la session ouverte si la caisse est ouverte
  assignedToUserId?: string; // ID de l'utilisateur assigné si la caisse est ouverte
  lastOpenedAt?: string;
  lastClosedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CashRegisterSession {
  cashRegisterSessionId: string;
  cashRegisterId: string;
  openedByStoreUserId: string;
  storeId: number;
  initialCash: number;
  openedAt: string;
  status: 'open' | 'closed';
  finalCash?: number;
  closedByStoreUserId?: string;
  closedAt?: string;
}

/**
 * Interfaces pour les invitations
 */

export interface Invitation {
  invitationId: string;
  storeId: number;
  email: string;
  roleId: string;
  roleName: string; // Nom du rôle pour affichage facile
  status: 'pending' | 'accepted' | 'revoked';
  sentAt: string;
  updatedAt?: string;
}

/**
 * Interfaces pour les ventes (Sales)
 */

// Article dans le panier côté frontend (peut contenir plus de détails produit)
export interface CartItem extends Product {
  // Étend l'interface Product
  quantity: number;
  itemDiscount?: number; // Remise sur cet article (optionnel)
}

// Article de vente envoyé au backend
export interface SaleItemPayload {
  productId: string;
  quantity: number;
  itemDiscount?: number; // Remise sur cet article (optionnel)
}

// Paiement envoyé au backend
export interface PaymentPayload {
  paymentMethodId: string;
  amount: number;
  transactionReference?: string; // Référence pour Mobile Money, Carte, etc.
}

// Payload de finalisation de vente
export interface FinalizeSalePayload {
  storeId: number;
  cashRegisterSessionId: string;
  createdByStoreUserId: string;
  saleItems: SaleItemPayload[];
  payments: PaymentPayload[];
  notes?: string; // Optionnel
  discountAmount?: number; // Remise globale sur la vente (optionnel)
}

// Réponse du reçu de vente du backend
export interface SaleReceipt {
  saleId: string;
  storeId: number;
  cashRegisterSessionId: string;
  createdByStoreUserId: string;
  saleItems: Array<SaleItemPayload & { name: string; price: number }>; // Backend renvoie plus de détails
  payments: Array<PaymentPayload & { name: string; type: string }>; // Backend renvoie plus de détails
  totalAmount: number;
  discountAmount: number;
  notes?: string;
  saleDate: string;
  receiptNumber: string;
  // Autres champs du reçu si le backend les inclut
}
