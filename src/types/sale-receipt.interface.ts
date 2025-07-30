// src/interfaces/sale-receipt.interface.ts

import { ISale } from './sale.interface';
import { IStore } from './store.interface';

export enum ReceiptType {
  ORIGINAL = 'original',
  DUPLICATE = 'duplicate',
  REFUND = 'refund',
}

export interface IReceipt {
  id: number;
  saleId: number;
  sale?: ISale; // Simplified sale info if eagerly loaded
  storeId: number;
  store?: IStore; // Simplified store info if eagerly loaded
  type: ReceiptType;
  content: string | null; // HTML or JSON formatted receipt content
  receiptNumber: string | null; // Nullable
  generatedAt: string; // Date as string
  updatedAt: string; // Date as string
}
