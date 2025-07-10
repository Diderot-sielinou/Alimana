// src/components/sales/Receipt.tsx
import React from 'react';

interface ReceiptProps {
  orderNumber: string | number;
  date: string;
  customer: string;
  items: { name: string; price: number; quantity: number }[];
  taxRate?: number;
  receiptId: string | number;
  closeReceipt: () => void;
}

const Receipt: React.FC<ReceiptProps> = ({
  orderNumber,
  date,
  customer,
  items,
  taxRate = 0.1,
  receiptId,
  closeReceipt,
}) => {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return (
    <div id="receipt-print" className="bg-white p-6 max-w-md mx-auto shadow-lg rounded">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold">STORE NAME</h2>
        <p className="text-sm">123 Main Street, City</p>
        <p className="text-sm">Tel: (123) 456-7890</p>
      </div>

      <div className="border-t border-b py-2 mb-2">
        <div className="flex justify-between">
          <span>
            Order #<span>{orderNumber}</span>
          </span>
          <span>{date}</span>
        </div>
        <div>Customer: {customer}</div>
      </div>

      <div className="mb-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-between">
            <span>
              {item.name} x{item.quantity}
            </span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="border-t pt-2">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax ({(taxRate * 100).toFixed(0)}%):</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="text-center mt-6">
        <p className="text-sm">Thank you for shopping with us!</p>
        <p className="text-xs text-gray-500 mt-2">Receipt #{receiptId}</p>

        <button
          onClick={closeReceipt}
          className="mt-4 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
        >
          close
        </button>
      </div>
    </div>
  );
};

export default Receipt;
