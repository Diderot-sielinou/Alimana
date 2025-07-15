import React from 'react';

interface ReceiptProps {
  orderNumber: string | number;
  date: string;
  customer: string;
  items: { name: string; price: number; quantity: number }[];
  taxRate?: number;
  receiptId: string | number;
  onSave: () => void;
  onCancel: () => void;
}

const Receipt: React.FC<ReceiptProps> = ({
  orderNumber,
  date,
  customer,
  items,
  taxRate = 0.1,
  receiptId,
  onSave,
  onCancel,
}) => {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
      <div className="w-full h-full flex items-center justify-center">
        <div className="bg-white w-full max-w-sm rounded-lg shadow-lg p-6 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold">ALIMANA MARKET</h2>
            <p className="text-sm">Rue des commerçants, Yaoundé</p>
            <p className="text-sm">Tel: +237 690 123 456</p>
          </div>

          {/* Info */}
          <div className="border-y py-2 mb-2">
            <div className="flex justify-between text-sm">
              <span>Order #{orderNumber}</span>
              <span>{date}</span>
            </div>
            <div className="text-sm">Customer: {customer}</div>
          </div>

          {/* Items */}
          <div className="mb-2">
            {items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span>
                  {item.name} x{item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t pt-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax ({(taxRate * 100).toFixed(0)}%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-base">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-4">
            <p className="text-sm">Thank you for shopping with us!</p>
            <p className="text-xs text-gray-500 mt-1">Receipt #{receiptId}</p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onSave}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Save
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
