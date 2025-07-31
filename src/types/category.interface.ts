// src/interfaces/category.interface.ts

import { IProduct } from './product.interface';
import { IStore } from './store.interface';

export interface ICategory {
  id: number;
  name: string;
  description: string | null;
  color: string | null;
  storeId: number;
  store?: IStore; // Simplified store info if eagerly loaded
  products?: IProduct[]; // Not eager, so optional
  createdAt: string; // Date as string
  updatedAt: string; // Date as string
}

export interface ICreateCategoryDto {
  name: string;
  description?: string;
  color?: string;
}

export interface IUpdateCategoryDto {
  name?: string;
  description?: string;
  color?: string;
}
