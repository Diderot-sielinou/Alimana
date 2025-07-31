// src/interfaces/sale-response.interface.ts

// For sale.store
export interface ISaleResponseStore {
  id: number;
}

// For sale.createdBy
export interface ISaleResponseCreatedBy {
  id: number;
}

// For sale.saleItems[]
export interface ISaleResponseSaleItem {
  productName: string;
  quantity: number;
  unitPrice: string; // From "50.00"
  totalPrice: number;
}

// For sale.payments[]
export interface ISaleResponsePayment {
  amount: number;
  // Note: paymentMethodId and paymentMethod are not present in your provided JSON for payments,
  // but they were in your previous PaymentDto. I'm omitting them here to match the exact JSON.
  // If they can be present, you might add them as 'paymentMethodId?: number;' and 'paymentMethod?: IPaymentMethodDto;'
}

// For the main 'sale' object
export interface ISaleResponseSale {
  id: number;
  saleNumber: string;
  totalAmount: number;
  totalPaidAmount: string; // From "3000.00"
  changeDue: string; // From "2720.00"
  discount: string; // From "90.00"
  status: string; // From "completed"
  createdAt: string; // From "2025-07-22T13:51:51.888Z" (ISO date string)
  store: ISaleResponseStore;
  createdBy: ISaleResponseCreatedBy;
  saleItems: ISaleResponseSaleItem[];
  payments: ISaleResponsePayment[];
}

// The top-level interface for the entire server response
export interface ISaleResponse {
  sale: ISaleResponseSale;
  receiptContent: string;
}
