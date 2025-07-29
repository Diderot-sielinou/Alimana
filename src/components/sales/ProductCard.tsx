'use client';

import React from 'react';
import Image from 'next/image';

export type Product = {
  id: string;
  name: string;
  price: number;
  image?: string;
};

export type CartProduct = Product & { quantity: number };

type Props = {
  product: Product;
  onAdd: (product: Product) => void;
};

export default function ProductCard({ product, onAdd }: Props) {
  return (
    <div className="border rounded-lg p-4 flex flex-col items-center shadow hover:shadow-md transition">
      <div className="w-24 h-24 bg-gray-200 dark:bg-gray-500 flex items-center justify-center mb-2">
        {product.image ? (
          <Image src={product.image} alt={product.name} className="object-cover" />
        ) : (
          <span className="text-gray-400 dark:text-white">No Image</span>
        )}
      </div>
      <h3 className="text-sm font-medium text-center">{product.name}</h3>
      <p className="text-xs text-gray-500">${product.price.toFixed(2)}</p>
      <button
        onClick={() => onAdd(product)}
        className="mt-2 bg-amber-600 text-white px-3 py-1 rounded text-sm hover:bg-amber-500"
      >
        + Add
      </button>
    </div>
  );
}
