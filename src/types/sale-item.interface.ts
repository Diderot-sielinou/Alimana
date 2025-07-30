// src/interfaces/sale-item.interface.ts

import { ISale } from './sale.interface';
import { IProduct } from './product.interface';

export interface ISaleItem {
  id: number;
  saleId: number;
  sale?: ISale; // Optional, might be deeply nested or just basic info
  productId: number;
  product?: IProduct; // Eagerly loaded, so it should be present
  quantity: number;
  productName: string;
  originalPrice: number | null; // Nullable
  unitPrice: number;
  discountPercentage: number;
  totalPrice: number;
}

export interface ICreateSaleItemDto {
  productId: number;
  quantity: number;
  unitPrice: number;
  discountPercentage?: number; // Optional, defaults to 0
}
