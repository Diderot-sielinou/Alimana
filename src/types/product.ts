import { Permission } from './auth';

// src/types/product.ts
export interface Product {
  id: number;
  name: string;
  description?: string;
  barcode: string;
  price: number;
  cost?: number;
  stock: number;
  categoryId: number;
  category: Category;
  isActive: boolean;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

// Produit
export interface Products {
  productId: string;
  storeId: number;
  name: string;
  description: string;
  costPrice: number;
  sellingPrice: number;
  brand: string;
  unit: string; // Ex: "unité", "kg", "litre"
  category: string; // Nom de la catégorie
  sku?: string; // Stock Keeping Unit (optionnel)
  barcode?: string; // Code-barres (optionnel)
  quantityInStock: number;
  discountPercentage: number;
  isActive: boolean;
  imageUrl?: string; // URL de l'image du produit (optionnel)
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedProductsResponse {
  products: Product[];
  totalProducts: number;
  totalPages: number;
  currentPage: number;
}

export interface Category {
  id: number;
  name: string;
  storeId: number;
  description?: string;
  color?: string;
  isActive?: boolean;
}

export interface ProductFilter {
  search?: string;
  categoryId?: number;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

// Détails de l'utilisateur de base (pour StoreUser)
export interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

// Utilisateur de la boutique (StoreUser)
export interface StoreUser {
  storeUserId: string;
  shopId: string;
  userId: string; // ID de l'utilisateur global
  roleId: string; // ID du rôle assigné
  user: UserDetails; // Détails de l'utilisateur
  role: {
    // Détails du rôle assigné
    name: string;
    permissions: Permission[];
  };
  isActive: boolean;
  assignedAt: string;
}

// Utilisateur de la boutique actuel (simplifié pour le frontend)
export interface CurrentStoreUser {
  id: string; // storeUserId ou userId selon ce que vous utilisez pour l'identification
  firstName: string;
  lastName: string;
  role: string; // Nom du rôle
  // Ajoutez d'autres infos si nécessaire, ex: permissions: Permission[];
}
