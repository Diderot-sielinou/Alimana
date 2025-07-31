// src/interfaces/sale.interface.ts

import { ICashRegisterSession } from './cash-register-session.interface';
import { ICreatePaymentDto, IPayment } from './payment.interface';
import { ICreateSaleItemDto, ISaleItem } from './sale-item.interface';
import { IReceipt } from './sale-receipt.interface';
import { IStoreUser } from './store-user.interface';
import { IStore } from './store.interface';

export enum SaleStatus {
  COMPLETED = 'completed',
  PENDING = 'pending',
  REFUNDED = 'refunded',
  CANCELED = 'canceled',
}

export interface ISale {
  id: number;
  storeId: number;
  store?: IStore; // Simplified store info if eagerly loaded
  createdById: number;
  createdBy?: IStoreUser; // Simplified store user info if eagerly loaded
  cashRegisterSessionId: number | null; // Nullable
  cashRegisterSession?: ICashRegisterSession | null; // Nullable, full session object if eagerly loaded
  saleItems: ISaleItem[]; // Eagerly loaded if cascaded or specifically joined
  saleNumber: string;
  receipts: IReceipt[]; // Eagerly loaded if cascaded
  payments: IPayment[]; // Eagerly loaded
  totalAmount: number;
  totalPaidAmount: number;
  changeDue: number;
  discount: number;
  status: SaleStatus;
  isRefunded: boolean;
  createdAt: string; // Date as string
  updatedAt: string; // Date as string
}

export interface ICreateSaleDto {
  saleItems: ICreateSaleItemDto[];
  payments: ICreatePaymentDto[];
  cashRegisterSessionId?: number; // Optional, can be null
  discount?: number; // Optional, defaults to 0
  saleNumber?: string; // Optional, backend might generate
}
