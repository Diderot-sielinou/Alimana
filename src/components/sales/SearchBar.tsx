'use client';

import React from 'react';
import { Search } from 'lucide-react';

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchBar({ value, onChange }: Props) {
  return (
    <div className="mb-6">
      <div className="relative w-full">
        <input
          type="text"
          id="product-search"
          placeholder="Search products..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}
