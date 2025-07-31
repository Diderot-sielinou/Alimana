'use client';

import React, { useState } from 'react';
import ProductCard, { Product } from './ProductCard';
import SearchBar from './SearchBar';
import CategoryFilter from './CategoryFilter';
import Cart from './Cart';

// Typage: produit avec quantité
export type CartProduct = Product & { quantity: number };

const mockProducts: Product[] = [
  { id: '1', name: 'Wireless Headphones', price: 59.99 },
  { id: '2', name: 'Smartphone', price: 499.99 },
  { id: '3', name: 'Laptop', price: 899.99 },
  { id: '4', name: 'Milk (1L)', price: 2.49 },
  { id: '5', name: 'Bread', price: 1.99 },
  { id: '6', name: 'Eggs (12)', price: 3.49 },
  { id: '7', name: 'T-Shirt', price: 14.99 },
  { id: '8', name: 'Jeans', price: 39.99 },
];

const categories = ['All', 'Electronics', 'Groceries', 'Clothing'];

export default function ProductList() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [cartItems, setCartItems] = useState<CartProduct[]>([]);

  const handleAdd = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)));
  };

  const handleRemove = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const filtered = mockProducts.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      category === 'All' ||
      (category === 'Electronics' &&
        ['Wireless Headphones', 'Smartphone', 'Laptop'].includes(p.name)) ||
      (category === 'Groceries' && ['Milk (1L)', 'Bread', 'Eggs (12)'].includes(p.name)) ||
      (category === 'Clothing' && ['T-Shirt', 'Jeans'].includes(p.name));
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="w-full p-4 md:p-6 dark:bg-gray-900 min-h-screen">
      <div className="grid grid-cols-1 dark:bg-gray-900 lg:grid-cols-3 gap-6">
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Top bar: Search */}
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <SearchBar value={search} onChange={setSearch} />
          </div>

          {/* Category filter */}
          <CategoryFilter categories={categories} active={category} onSelect={setCategory} />

          {/* Product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 dark:bg-gray-900 2xl:grid-cols-3 gap-3 px-0">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={handleAdd} />
            ))}
          </div>
        </div>

        {/* RIGHT SIDE: Cart */}
        <div className="lg:sticky lg:top-6 mt-[90px] lg:mt-[123px]">
          <Cart
            items={cartItems}
            onClear={handleClearCart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemove={handleRemove}
          />
        </div>
      </div>
    </section>
  );
}
