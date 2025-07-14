'use client';

import React, { useState } from 'react';
import { CartProduct } from './ProductCard';
import Receipt from '@/components/sales/Receipt';
import { Plus, Trash2, ShoppingBasket, Pause, CreditCard } from 'lucide-react';

type Props = {
  items: CartProduct[];
  onClear: () => void;
};

export default function Cart({ items, onClear }: Props) {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;
  const [showReceipt, setShowReceipt] = useState(false);

  const handlePayNow = () => {
    if (items.length === 0) return;
    setShowReceipt(true);
  };

  return (
    <>
      <div className="w-full bg-white rounded-lg shadow-md p-4 no-print mt-32px">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Current Sale</h2>
          <span className="text-sm text-gray-600">#ORD-00123</span>
        </div>

        {/* Customer Info */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-gray-700">Customer</h3>
            <button
              className="flex items-center text-blue-600 text-sm hover:text-blue-800"
              type="button"
            >
              <Plus className="w-4 h-4 mr-1" strokeWidth={3} /> Add
            </button>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-gray-500 text-sm">Walk-in customer</p>
          </div>
        </div>

        {/* Basket Items */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-gray-700">Items ({items.length})</h3>
            <button
              onClick={onClear}
              className="flex items-center text-red-600 text-sm hover:text-red-800"
              type="button"
            >
              <Trash2 className="w-4 h-4 mr-1" strokeWidth={3} /> Clear
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto border rounded-lg">
            {items.length === 0 ? (
              <div className="p-4 text-center text-gray-500 flex flex-col items-center">
                <ShoppingBasket className="w-8 h-8 mb-2" strokeWidth={3.5} />
                <p>Your basket is empty</p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-3 border-b last:border-b-0"
                >
                  <span>{item.name}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Totals */}
        <div className="mb-6">
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Tax (10%):</span>
            <span className="font-medium">${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600 font-bold">Total:</span>
            <span className="font-bold text-xl">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            className="flex items-center justify-center px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            type="button"
          >
            <Pause className="w-4 h-4 mr-2" strokeWidth={3.5} /> Hold
          </button>
          <button
            onClick={handlePayNow}
            className="flex items-center justify-center px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
            type="button"
            disabled={items.length === 0}
          >
            <CreditCard className="w-4 h-4 mr-2" strokeWidth={3.5} /> Pay Now
          </button>
        </div>
      </div>

      {showReceipt && (
        <div className="mt-6 w-full lg:w-2/3">
          <Receipt
            orderNumber="00123"
            date={new Date().toLocaleString()}
            customer="Walk-in"
            items={items.map((item) => ({
              name: item.name,
              price: item.price,
              quantity: item.quantity,
            }))}
            receiptId="123456"
            closeReceipt={() => setShowReceipt(false)}
          />
        </div>
      )}
    </>
  );
}
