'use client';

import { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  expirationDate: string;
  zip?: string;
  quantity?: string;
  status: 'In Stock' | 'Out of Stock' | 'Inactive';
}

export default function InventoryPage() {
  const [search] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [product, setProduct] = useState<Product>({
    id: '',
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    expirationDate: '',
    zip: '',
    quantity: '',
    status: 'In Stock',
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scannedId, setScannedId] = useState<string | null>(null);
  const scannerRef = useRef<HTMLDivElement | null>(null);

  const mockBarcodeDatabase: Record<string, Partial<Product>> = {
    '123456': {
      name: 'Mock Product A',
      description: 'Auto-filled from barcode A',
      price: '29.99',
      stock: '10',
      category: 'shoes',
    },
    '789101': {
      name: 'Mock Product B',
      description: 'Auto-filled from barcode B',
      price: '49.99',
      stock: '5',
      category: 'clothing',
    },
  };

  useEffect(() => {
    const stored = localStorage.getItem('products');
    if (stored) setProducts(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (!showScanner || !scannerRef.current) return;
    if (document.getElementById('scanner')?.hasChildNodes()) return;

    const scanner = new Html5QrcodeScanner('scanner', { fps: 10, qrbox: 250 }, false);

    scanner.render(
      (decodedText) => {
        const found = mockBarcodeDatabase[decodedText];
        if (found) {
          setProduct((prev) => ({ ...prev, ...found }));
          setScannedId(decodedText);
        } else {
          alert('No product found for this barcode.');
        }
        setShowScanner(false);
        scanner.clear();
      },
      (error) => console.warn('Scanning error', error)
    );

    return () => {
      scanner.clear().catch(console.error);
    };
  }, [showScanner]);

  const handleChange = (field: keyof Product, value: string) => {
    setProduct((prev) => ({ ...prev, [field]: value }));
  };

  const calculateDaysLeft = (expirationDate: string): number => {
    const today = new Date();
    const expireDate = new Date(expirationDate);
    const diff = Math.ceil((expireDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      ...product,
      id: editingId || Date.now().toString(),
      quantity: product.stock,
      status: Number(product.stock) > 0 ? 'In Stock' : 'Out of Stock',
    };

    const updated = editingId
      ? products.map((p) => (p.id === editingId ? newProduct : p))
      : [...products, newProduct];

    setProducts(updated);
    localStorage.setItem('products', JSON.stringify(updated));
    setProduct({
      id: '',
      name: '',
      description: '',
      price: '',
      stock: '',
      category: '',
      expirationDate: '',
      zip: '',
      quantity: '',
      status: 'In Stock',
    });
    setEditingId(null);
    setDialogOpen(false);
    setShowScanner(false);
    setScannedId(null);
  };

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  const handleEdit = (product: Product) => {
    setProduct(product);
    setEditingId(product.id);
    setDialogOpen(true);
  };

  const handleDeactivate = (id: string) => {
    if (!confirm('Are you sure you want to deactivate this product?')) return;
    const updated = products.map((p) => (p.id === id ? { ...p, status: 'Inactive' as const } : p));
    setProducts(updated);
    localStorage.setItem('products', JSON.stringify(updated));
  };

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-6 ml-0 md:ml-64">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Inventory</h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-amber-600 hover:bg-amber-700">Add Product</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl overflow-y-auto max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>{editingId ? 'Edit Product' : 'Add Product'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddProduct} className="space-y-6">
                <div className="flex justify-end">
                  <Button type="button" variant="secondary" onClick={() => setShowScanner(true)}>
                    📷 Scan Barcode
                  </Button>
                </div>
                {showScanner && (
                  <div className="mt-4">
                    <div ref={scannerRef} id="scanner" className="w-full max-w-sm mx-auto" />
                    <p className="text-center text-sm text-gray-600 mt-2">
                      Place the barcode in front of your camera.
                    </p>
                  </div>
                )}
                {scannedId && (
                  <p className="text-sm text-green-600 text-center mt-2">
                    ✅ Scanned ID: <strong>{scannedId}</strong>
                  </p>
                )}
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={product.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="e.g. Nike Air Max"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={product.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Brief description of the product"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      value={product.price}
                      onChange={(e) => handleChange('price', e.target.value)}
                      placeholder="e.g. 59.99"
                      required
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={product.stock}
                      onChange={(e) => handleChange('stock', e.target.value)}
                      placeholder="e.g. 25"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={product.category}
                    onValueChange={(val) => handleChange('category', val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="shoes">Shoes</SelectItem>
                      <SelectItem value="clothing">Clothing</SelectItem>
                      <SelectItem value="accessories">Accessories</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Image (mocked)</Label>
                  <Input id="image" type="file" disabled />
                  <p className="text-xs text-gray-500">Image upload not implemented yet</p>
                </div>
                <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700">
                  {editingId ? 'Update Product' : 'Add Product'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="overflow-auto rounded-lg border shadow">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Category</th>
                <th className="text-left p-3">Price</th>
                <th className="text-left p-3">Stock</th>
                <th className="text-left p-3">Quantity</th>
                <th className="text-left p-3">Days Left</th>
                <th className="text-left p-3">Zip</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{product.name}</td>
                  <td className="p-3">{product.category}</td>
                  <td className="p-3">${parseFloat(product.price).toFixed(2)}</td>
                  <td className="p-3">{product.stock}</td>
                  <td className="p-3">{product.quantity || '-'}</td>
                  <td className="p-3">{calculateDaysLeft(product.expirationDate)} days</td>
                  <td className="p-3">{product.zip || '-'}</td>
                  <td className="p-3">
                    <span
                      className={`text-sm font-medium ${product.status === 'In Stock' ? 'text-green-400' : product.status === 'Out of Stock' ? 'text-yellow-600' : 'text-red-400'}`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(product)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeactivate(product.id)}
                    >
                      Deactivate
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
