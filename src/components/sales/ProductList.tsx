'use client';

import React, { useState } from 'react';
import ProductCard, { Product } from './ProductCard';
import SearchBar from './SearchBar';
import CategoryFilter from './CategoryFilter';
import Cart from './Cart';

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
  const [cartItems, setCartItems] = useState<Product[]>([]);

  const handleAdd = (product: Product) => {
    setCartItems((prev) => [...prev, product]);
  };

  const handleClearCart = () => {
    setCartItems([]);
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
    <div className="flex flex-col gap-4">
      <SearchBar value={search} onChange={setSearch} />
      <CategoryFilter categories={categories} active={category} onSelect={setCategory} />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} onAdd={handleAdd} />
        ))}
      </div>
      <Cart items={cartItems} onClear={handleClearCart} />
    </div>
  );
}
