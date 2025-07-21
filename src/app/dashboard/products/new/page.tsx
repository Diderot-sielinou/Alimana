'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Sidebar from '@/components/sidebar';
import { sidebarLinks } from '@/constants/sidebarLinks';

export default function NewProductPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
  });

  const [scannedId, setScannedId] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const scannerRef = useRef<HTMLDivElement | null>(null);

  const mockBarcodeDatabase: Record<string, typeof product> = {
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
    if (!showScanner || !scannerRef.current) return;

    if (document.getElementById('scanner')?.hasChildNodes()) return;

    const scanner = new Html5QrcodeScanner('scanner', { fps: 10, qrbox: 250 }, false);

    scanner.render(
      (decodedText) => {
        setScannedId(decodedText);
        const productData = mockBarcodeDatabase[decodedText];
        if (productData) {
          setProduct(productData);
        } else {
          alert('No product found for this barcode.');
        }
        setShowScanner(false);
        scanner.clear();
      },
      (error) => {
        console.warn('Scanning error', error);
      }
    );

    return () => {
      scanner.clear().catch(console.error);
    };
  }, [showScanner]);

  const handleChange = (field: string, value: string) => {
    setProduct((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Retrieve existing products from localStorage
    const existingProducts = JSON.parse(localStorage.getItem('products') || '[]');

    // Assign a simple unique ID
    const newProduct = {
      ...product,
      id: Date.now().toString(), // Use timestamp as ID
    };

    // Save the new list
    localStorage.setItem('products', JSON.stringify([...existingProducts, newProduct]));

    // Redirect
    router.push('/dashboard/products');
  };

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

        <div className="max-w-2xl mx-auto py-10">
          <Button variant="outline" onClick={() => router.back()} className="mb-6">
            ← Back
          </Button>
          <Card>
            <CardHeader>
              <CardTitle>Add New Product</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
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
                  Add Product
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
