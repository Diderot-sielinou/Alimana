'use client';

import React, { useState } from 'react';
import { CartProduct } from './ProductCard';
import Receipt from '@/components/sales/Receipt';
import { Plus, Trash2, ShoppingBasket, Pause, CreditCard, X } from 'lucide-react';

type Props = {
  items: CartProduct[];
  onClear: () => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
};

export default function Cart({ items, onClear, onUpdateQuantity, onRemove }: Props) {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;
  // const [item, setItem] = useState<CartProduct[]>([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptId, setReceiptId] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handlePayNow = () => {
    if (items.length === 0) return;

    const randomId = Math.floor(Math.random() * 900000 + 100000);
    setReceiptId(randomId.toString());

    setShowReceipt(true);
  };

  const handleSaveReceipt = () => {
    // Ici tu peux faire un appel API si tu veux sauvegarder réellement
    setShowSuccessMessage(true);

    setTimeout(() => {
      setShowSuccessMessage(false);
      setShowReceipt(false);
      onClear();
    }, 2000);

    const clearCart = () => {};

    setTimeout(() => {
      setShowSuccessMessage(false);
      setShowReceipt(false);
      clearCart(); // tu peux vider le panier ici si tu veux
    }, 2000);
  };

  const handleCancelReceipt = () => {
    setShowReceipt(false);
  };

  return (
    <>
      <div className="w-full bg-white rounded-lg shadow-md p-4 no-print">
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
                  <div className="flex flex-col">
                    <span className="font-medium">{item.name}</span>
                    <div className="flex items-center gap-x-2 mt-1">
                      <button
                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="px-3 py-1 border bg-black text-white rounded-l hover:bg-black"
                        type="button"
                      >
                        -
                      </button>
                      <span className="px-3 border-t border-b">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 border bg-black text-white rounded-r hover:bg-black"
                        type="button"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => onRemove(item.id)}
                      className="text-red-600 hover:text-red-800"
                      type="button"
                      title="Remove item"
                    >
                      <X className="w-5 h-5" strokeWidth={3} />
                    </button>
                  </div>
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
        <Receipt
          orderNumber="00123"
          date={new Date().toLocaleString()}
          customer="Walk-in"
          items={items}
          receiptId={receiptId}
          onSave={handleSaveReceipt}
          onCancel={handleCancelReceipt}
        />
      )}

      {showSuccessMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow">
          Saved successfully!
        </div>
      )}
    </>
  );
}
