// src/interfaces/payment.interface.ts

import { IPaymentMethod } from './payment-method.interface';
import { ISale } from './sale.interface';
import { IStoreUser } from './store-user.interface';

export type PaymentStatus = 'pending' | 'completed' | 'failed';

export interface IPayment {
  id: number;
  saleId?: number;
  sale?: ISale; // Simplified sale info if eagerly loaded
  paymentMethodId?: number;
  paymentMethod?: IPaymentMethod; // Full payment method if eagerly loaded
  amount: number;
  transactionReference?: string | null;
  processedByStoreUserId?: number;
  processedBy?: IStoreUser; // Full store user if eagerly loaded
  status: PaymentStatus;
  createdAt?: string; // Date as string
  updatedAt?: string; // Date as string
}

export interface ICreatePaymentDto {
  paymentMethodId: number;
  amount: number;
  transactionReference?: string;
  status?: PaymentStatus;
}
