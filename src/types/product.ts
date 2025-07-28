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

export interface Category {
  id: number;
  name: string;
  description?: string;
  color?: string;
  isActive: boolean;
}

export interface ProductFilter {
  search?: string;
  categoryId?: number;
  isActive?: boolean;
  page?: number;
  limit?: number;
}