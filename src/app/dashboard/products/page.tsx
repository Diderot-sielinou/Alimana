'use client';

import React, { useEffect, useState } from 'react';
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

export default function ProductsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState<Product[]>([]);

  type Product = {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    status: string;
  };

  // Load products from localStorage on mount
  useEffect(() => {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    }
  }, []);

  const filteredProducts = products.filter((product) =>
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
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>${Number(product.price).toFixed(2)}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <span
                        className={`text-sm font-medium ${
                          product.stock > 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 py-6">
                    No products found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </main>
    </div>
  );
}
