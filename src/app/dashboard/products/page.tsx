'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/sidebar';
import { sidebarLinks } from '@/constants/sidebarLinks';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from '@/components/ui/table';

const mockProducts = [
  {
    id: '1',
    name: 'Wireless Headphones',
    category: 'Electronics',
    price: 99.99,
    stock: 24,
    status: 'In Stock',
  },
  {
    id: '2',
    name: 'Running Shoes',
    category: 'Footwear',
    price: 59.99,
    stock: 0,
    status: 'Out of Stock',
  },
  {
    id: '3',
    name: 'Smart Watch',
    category: 'Electronics',
    price: 149.99,
    stock: 12,
    status: 'In Stock',
  },
];

export default function ProductsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredProducts = mockProducts.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen relative">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} links={sidebarLinks} />

      {/* Main Content */}
      <main className="flex-1 p-6 ml-0 md:ml-64">
        {/* Mobile Toggle */}
        <div className="mb-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-orange-600 text-2xl"
          >
            ☰
          </button>
        </div>

        {/* Page Header */}
        <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Products</h1>
          <Button
            className="bg-amber-600 hover:bg-amber-700 text-white"
            onClick={() => router.push('/dashboard/products/new')}
          >
            + New Product
          </Button>
        </div>

        {/* Search Input */}
        <div className="mb-6">
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/3"
          />
        </div>

        {/* Products Table */}
        <Card className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <span
                      className={`text-sm font-medium ${
                        product.status === 'In Stock' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {product.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </main>
    </div>
  );
}
