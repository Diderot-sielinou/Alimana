'use client';

import { useState } from 'react';
import Sidebar from '@/components/sidebar';
import { sidebarLinks } from '@/constants/sidebarLinks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface Product {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  status: string;
  orderId: string;
  reference: string;
  daysLeft: number;
  revenue: number;
  deliveryZip: string;
}

export default function InventoryPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [inventory, setInventory] = useState<Product[]>([
    {
      id: 1,
      name: 'Wireless Mouse',
      sku: 'WM-001',
      quantity: 120,
      price: 25.99,
      status: 'In Stock',
      orderId: 'ORD-1001',
      reference: 'REF-WM-001',
      daysLeft: 12,
      revenue: 3118.8,
      deliveryZip: '10001',
    },
    {
      id: 2,
      name: 'Bluetooth Keyboard',
      sku: 'BK-002',
      quantity: 80,
      price: 45.5,
      status: 'Low Stock',
      orderId: 'ORD-1002',
      reference: 'REF-BK-002',
      daysLeft: 4,
      revenue: 3640,
      deliveryZip: '94107',
    },
  ]);

  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    quantity: '',
    price: '',
    status: 'In Stock',
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [id]: value }));
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.sku || !newProduct.quantity || !newProduct.price) return;

    const id = inventory.length + 1;
    const product: Product = {
      id,
      name: newProduct.name,
      sku: newProduct.sku,
      quantity: parseInt(newProduct.quantity),
      price: parseFloat(newProduct.price),
      status: newProduct.status,
      orderId: `ORD-${id}`,
      reference: `REF-${newProduct.sku}`,
      daysLeft: 7,
      revenue: parseFloat(newProduct.price) * parseInt(newProduct.quantity),
      deliveryZip: '00000',
    };

    setInventory((prev) => [...prev, product]);
    resetForm();
  };

  const handleEditProduct = () => {
    if (editId === null) return;
    const updated = inventory.map((product) =>
      product.id === editId
        ? {
            ...product,
            ...newProduct,
            quantity: parseInt(newProduct.quantity),
            price: parseFloat(newProduct.price),
            revenue: parseFloat(newProduct.price) * parseInt(newProduct.quantity),
            reference: `REF-${newProduct.sku}`,
          }
        : product
    );
    setInventory(updated);
    resetForm();
  };

  const startEdit = (product: Product) => {
    setNewProduct({
      name: product.name,
      sku: product.sku,
      quantity: product.quantity.toString(),
      price: product.price.toString(),
      status: product.status,
    });
    setEditId(product.id);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setNewProduct({
      name: '',
      sku: '',
      quantity: '',
      price: '',
      status: 'In Stock',
    });
    setEditId(null);
    setIsEditing(false);
    setIsDialogOpen(false);
  };

  const filteredInventory = inventory.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="flex min-h-screen">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} links={sidebarLinks} />

      <main className="flex-1 p-6 ml-0 md:ml-64">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Inventory</h1>

          {/* Add Product Modal */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  resetForm();
                  setIsDialogOpen(true);
                }}
                className="bg-orange-600 text-white hover:bg-orange-700 w-full sm:w-auto"
              >
                + {isEditing ? 'Edit Product' : 'Add Product'}
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>{isEditing ? 'Edit Product' : 'Add New Product'}</DialogTitle>
              </DialogHeader>

              <form className="space-y-4 mt-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Product Name
                  </label>
                  <Input id="name" value={newProduct.name} onChange={handleInputChange} />
                </div>
                <div>
                  <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
                    SKU
                  </label>
                  <Input id="sku" value={newProduct.sku} onChange={handleInputChange} />
                </div>
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <Input
                    id="quantity"
                    type="number"
                    value={newProduct.quantity}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="status"
                    value={newProduct.status}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                  >
                    <option>In Stock</option>
                    <option>Low Stock</option>
                    <option>Out of Stock</option>
                  </select>
                </div>
              </form>
              <DialogFooter className="mt-6 flex justify-end gap-2">
                <Button
                  onClick={isEditing ? handleEditProduct : handleAddProduct}
                  className="bg-orange-600 text-white hover:bg-orange-700"
                >
                  {isEditing ? 'Update' : 'Save'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-4">
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/3"
          />
        </div>

        <div className="overflow-auto">
          <table className="min-w-full bg-white border rounded shadow-sm">
            <thead className="bg-orange-600 text-white">
              <tr>
                <th className="text-left p-3">Product Name</th>
                <th className="text-left p-3">SKU</th>
                <th className="text-left p-3">Order ID</th>
                <th className="text-left p-3">Reference</th>
                <th className="text-left p-3">Quantity</th>
                <th className="text-left p-3">Price</th>
                <th className="text-left p-3">Days Left</th>
                <th className="text-left p-3">Revenue</th>
                <th className="text-left p-3">Zip Code</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredInventory.map((product) => (
                <tr key={product.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{product.name}</td>
                  <td className="p-3">{product.sku}</td>
                  <td className="p-3">{product.orderId}</td>
                  <td className="p-3">{product.reference}</td>
                  <td className="p-3">{product.quantity}</td>
                  <td className="p-3">${product.price.toFixed(2)}</td>
                  <td className="p-3">{product.daysLeft} days</td>
                  <td className="p-3">${product.revenue.toFixed(2)}</td>
                  <td className="p-3">{product.deliveryZip}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-sm rounded-full ${
                        product.status === 'In Stock'
                          ? 'bg-green-100 text-green-800'
                          : product.status === 'Low Stock'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => startEdit(product)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
              {filteredInventory.length === 0 && (
                <tr>
                  <td colSpan={11} className="p-3 text-center text-gray-500">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
