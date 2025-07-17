'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/sidebar';
import { sidebarLinks } from '@/constants/sidebarLinks';

import ProductList from '@/components/sales/ProductList';

export default function SalesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} links={sidebarLinks} />

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
          <h1 className="text-2xl font-bold text-black dark:text-white">Sales Terminal</h1>
          <div className="flex items-center space-x-2 mt-2 md:mt-0">
            <span className="text-sm text-black dark:text-white">Cashier: John Doe</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
              Shift: Morning
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 flex gap-4">
            <ProductList />
          </div>
          <div>{/* <Cart items={[]} onClear={() => {}} /> */}</div>
        </div>
      </main>
    </div>
  );
}
