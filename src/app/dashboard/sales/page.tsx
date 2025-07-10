'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/sidebar';
import { LayoutDashboard, ShoppingCart, Settings } from 'lucide-react';

import ProductList from '@/components/sales/ProductList';
// import ProductCard from '@/components/sales/ProductCard';
// import SearchBar from '@/components/sales/SearchBar';
// import CategoryFilter from '@/components/sales/CategoryFilter';
// import Cart from '@/components/sales/Cart';

export default function SalesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarLinks = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/dashboard/sales',
      label: 'Sales',
      icon: ShoppingCart,
    },
    {
      href: '/dashboard/settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} links={sidebarLinks} />

      {/* Main Content */}
      <main className="flex-1 p-6 ml-0 md:ml-64">
        <div className="mb-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-orange-600 text-2xl"
          >
            ☰
          </button>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Sales Terminal</h1>
          <div className="flex items-center space-x-2 mt-2 md:mt-0">
            <span className="text-sm text-gray-600">Cashier: John Doe</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
              Shift: Morning
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 flex gap-4">
            {/* <SearchBar/> */}
            {/* <CategoryFilter
              categories={['All', 'Electronics', 'Groceries', 'Clothing']}
              active="All"
              onSelect={() => {}}
            /> */}
            {/* <ProductCard
              product={{ id: 'sample', name: 'Sample Product', price: 0 }}
              onAdd={() => {}}
            /> */}
            <ProductList />
          </div>
          <div>{/* <Cart items={[]} onClear={() => {}} /> */}</div>
        </div>
      </main>
    </div>
  );
}
