// src/interfaces/payment-method.interface.ts

import { IStore } from './store.interface';

export enum PaymentMethodType {
  CASH = 'cash',
  CARD = 'card',
  MOBILE_MONEY = 'mobile_money',
  BANK_TRANSFER = 'bank_transfer',
  OTHER = 'other',
}

export interface IPaymentMethod {
  id: number;
  name: string;
  type: PaymentMethodType;
  isActive: boolean;
  requiresReference?: boolean;
  isDefault: boolean;
  storeId: number;
  store?: IStore; // Simplified store info if eagerly loaded
  createdAt: string;
  updatedAt: string;
}
