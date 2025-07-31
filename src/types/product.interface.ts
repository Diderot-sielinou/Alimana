// src/interfaces/product.interface.ts

import { ICategory } from './category.interface';
import { IStoreUser } from './store-user.interface';
import { IStore } from './store.interface';

export interface IProduct {
  id: number;
  name: string;
  description: string | null;
  barcode: string | null;
  sku: string | null;
  brand: string | null;
  unit: string | null;
  sellingPrice: number;
  costPrice: number;
  discountPercentage: number;
  quantityInStock: number;
  isActive: boolean;
  imageUrl: string | null;
  categoryId: number | null; // Nullable
  category?: ICategory | null; // Nullable, full category object if eagerly loaded
  createdById: number | null; // Nullable
  createdBy?: IStoreUser | null; // Nullable, full store user if eagerly loaded
  storeId: number;
  store?: IStore; // Simplified store info if eagerly loaded
  createdAt: string; // Date as string
  updatedAt: string; // Date as string
}

// DTOs for Product
export interface ICreateProductDto {
  name: string;
  description?: string;
  barcode?: string;
  sku?: string;
  brand?: string;
  unit?: string;
  sellingPrice: number;
  costPrice?: number;
  discountPercentage?: number;
  quantityInStock?: number;
  isActive?: boolean;
  imageUrl?: string;
  categoryId?: number;
}

export interface IUpdateProductDto {
  name?: string;
  description?: string;
  barcode?: string;
  sku?: string;
  brand?: string;
  unit?: string;
  sellingPrice?: number;
  costPrice?: number;
  discountPercentage?: number;
  quantityInStock?: number;
  isActive?: boolean;
  imageUrl?: string;
  categoryId?: number;
}
