'use client';

import React, { useState } from 'react';
import { CartProduct } from './ProductCard';
import { Plus, Trash2, ShoppingBasket, Pause, CreditCard, X, DollarSign } from 'lucide-react';

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

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [cashAmount, setCashAmount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handlePayNow = () => {
    if (items.length === 0) return;
    setShowPaymentOptions(true);
  };

  const handleCancelPayment = () => {
    setSelectedMethod('');
    setCashAmount('');
    setShowPaymentOptions(false);
    setErrorMessage('');
  };

  const handleSavePayment = () => {
    if (selectedMethod === 'cash' && (!cashAmount || parseFloat(cashAmount) < total)) {
      setErrorMessage('The cash amount is insufficient.');
      return;
    }

    setShowSuccessMessage(true);
    setShowPaymentOptions(false);
    setSelectedMethod('');
    setCashAmount('');
    setErrorMessage('');

    setTimeout(() => {
      setShowSuccessMessage(false);
      onClear();
    }, 2000);
  };

  return (
    <>
      <div className="w-full bg-white dark:bg-gray-700 rounded-lg shadow-md p-1.5 no-print">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-700 dark:text-white">Current Sale</h2>
          <span className="text-sm text-gray-700 dark:text-white">#ORD-00123</span>
        </div>

        {/* Customer Info */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-gray-700 dark:text-white">Customer</h3>
            <button
              className="flex items-center text-blue-600 text-sm hover:text-blue-800"
              type="button"
            >
              <Plus className="w-4 h-4 mr-1" strokeWidth={3} /> Add
            </button>
          </div>
          <div className="bg-gray-50 p-3 dark:bg-gray-500 rounded-lg">
            <p className="text-gray-600 dark:text-white text-sm">Walk-in customer</p>
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
              <div className="p-4 text-center text-gray-500 dark:text-white flex flex-col items-center">
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
                      <span className="px-3 border-t border-b text-white bg-black">
                        {item.quantity}
                      </span>
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
                    <span className="font-semibold text-black">
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
            <span className="text-black dark:text-white">Subtotal:</span>
            <span className="font-medium text-black dark:text-white">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-black dark:text-white">Tax (10%):</span>
            <span className="font-medium text-black dark:text-white">${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-black font-bold dark:text-white">Total:</span>
            <span className="font-bold text-xl text-black dark:text-white">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Payment Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            className="flex items-center justify-center px-4 py-3 dark:bg-gray-500 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition"
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

        {/* Payment Method Options */}
        {showPaymentOptions && (
          <div
            className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
            role="dialog"
            aria-modal="true"
          >
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg shadow-lg w-full max-w-md mx-4">
              <h4 className="font-semibold mb-4 text-black dark:text-white text-center text-lg">
                Payment Method
              </h4>

              {/* Only Cash Button */}
              <div className="flex gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('cash')}
                  className={`px-4 py-2 rounded-lg mx-auto ${
                    selectedMethod === 'cash' ? 'bg-blue-500 text-white' : 'bg-white'
                  }`}
                >
                  <DollarSign className="inline w-4 h-4 mr-1" /> Cash
                </button>
              </div>

              {/* Error Message */}
              {errorMessage && <div className="mb-3 text-red-600 font-medium">{errorMessage}</div>}

              {/* Payment Action Buttons for Cash */}
              {selectedMethod === 'cash' && (
                <div className="flex flex-col max-[424px]:flex-col min-[425px]:flex-row justify-center gap-3 items-center">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    aria-label="Cash amount received"
                    placeholder={`(Total: $${total.toFixed(2)})`}
                    value={cashAmount}
                    onChange={(e) => setCashAmount(e.target.value)}
                    className="p-2 border rounded-lg w-40 md:w-40"
                  />
                  <button
                    type="button"
                    onClick={handleSavePayment}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg w-40 md:w-auto"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelPayment}
                    className="px-4 py-2 bg-gray-400 text-white rounded-lg w-40 md:w-auto"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showSuccessMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow">
          Payment saved successfully!
        </div>
      )}
    </>
  );
}
