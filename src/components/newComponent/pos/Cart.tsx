// src/components/pos/Cart.tsx
'use client';

import React from 'react';
import { CartItem } from '@/types/pos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Minus, Plus, ShoppingCart } from 'lucide-react';

interface CartProps {
  items: CartItem[]; // Le tableau des articles dans le panier.
  onUpdateItem: (productId: number, updates: Partial<CartItem>) => void; //Pour modifier la quantité ou la remise d'un article.
  onRemoveItem: (productId: number) => void; // Pour supprimer un article.
  onClear: () => void;
  onCheckout: () => void; // Pour déclencher le processus de paiement.
  total: number; // e montant total calculé du panier
}

export const Cart: React.FC<CartProps> = ({
  items,
  onUpdateItem,
  onRemoveItem,
  onClear,
  onCheckout,
  total,
}) => {
  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity > 0) {
      onUpdateItem(productId, { quantity: newQuantity });
    }
  };

  const updateDiscount = (productId: number, discount: number) => {
    if (discount >= 0) {
      onUpdateItem(productId, { discount });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Cart</h2>
        {items.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Vider
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Cart Empty</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.product.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                    <p className="text-sm text-gray-500">
                      {item.product.sellingPrice.toLocaleString()} XAF
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveItem(item.product.id)}
                    className="text-red-600 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Quantité */}
                <div className="flex items-center space-x-2 mb-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="p-1 h-8 w-8"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value) || 1)}
                    className="w-16 text-center h-8"
                    min="1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="p-1 h-8 w-8"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>

                {/* Remise */}
                <div className="mb-3">
                  <label className="block text-xs text-gray-500 mb-1">Balance (XAF)</label>
                  <Input
                    type="number"
                    value={item.discount}
                    onChange={(e) => updateDiscount(item.product.id, parseInt(e.target.value) || 0)}
                    className="h-8"
                    min="0"
                    max={item.quantity * item.product.sellingPrice}
                  />
                </div>

                {/* Sous-total */}
                <div className="text-right">
                  <p className="font-semibold text-primary">{item.subtotal.toLocaleString()} XAF</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Total et checkout */}
      {items.length > 0 && (
        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-gray-900">Total:</span>
            <span className="text-2xl font-bold text-primary">{total.toLocaleString()} XAF</span>
          </div>
          <Button onClick={onCheckout} className="w-full" size="lg">
            Proceed to payment
          </Button>
        </div>
      )}
    </div>
  );
};
