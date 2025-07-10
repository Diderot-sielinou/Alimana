import React, { useState } from 'react';
import ProductList from './sales/ProductList'; // Vérifie le chemin et nom fichier
import Cart from './sales/Cart';
import Receipt from './sales/Receipt';

type BasketItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

const products = [
  // ... tes produits
];

const POS = () => {
  const [basket, setBasket] = useState<BasketItem[]>([]);
  const [receiptVisible, setReceiptVisible] = useState(false);
  const [orderNumber, setOrderNumber] = useState(1001);
  const [receiptId, setReceiptId] = useState<number>(Date.now());

  const addToBasket = (id: number, name: string, price: number) => {
    setBasket((prev) => {
      const found = prev.find((item) => item.id === id);
      if (found) {
        return prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id, name, price, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, action: 'increase' | 'decrease') => {
    setBasket((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const qty = action === 'increase' ? item.quantity + 1 : item.quantity - 1;
            return { ...item, quantity: qty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromBasket = (id: number) => {
    setBasket((prev) => prev.filter((item) => item.id !== id));
  };

  const clearBasket = () => {
    setBasket([]);
  };

  const payNow = () => {
    if (basket.length === 0) {
      alert('Your basket is empty!');
      return;
    }
    setReceiptId(Date.now());
    setOrderNumber((prev) => prev + 1);
    setReceiptVisible(true);
  };

  const closeReceipt = () => {
    setReceiptVisible(false);
    clearBasket();
  };

  const dateString = new Date().toLocaleString();

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Point of Sale</h1>

      <ProductList products={products} onAdd={addToBasket} />

      <Cart
        basket={basket}
        updateQuantity={updateQuantity}
        removeFromBasket={removeFromBasket}
        clearBasket={clearBasket}
        payNow={payNow}
      />

      {receiptVisible && (
        <Receipt
          orderNumber={orderNumber - 1}
          date={dateString}
          customer="Client"
          items={basket}
          receiptId={receiptId ?? Date.now()}
          closeReceipt={closeReceipt} // ✅ Ajoute ceci
        />
      )}
    </div>
  );
};

export default POS;
