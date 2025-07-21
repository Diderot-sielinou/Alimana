'use client';

import { useRouter } from 'next/navigation';
// import { Html5Qrcode } from 'html5-qrcode';
import { useState } from 'react';
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

  // const [scannedId, setScannedId] = useState<string | null>(null);
  // const scannerRef = useRef<HTMLDivElement | null>(null);
  // const flashRef = useRef<HTMLDivElement | null>(null);
  // const [showScanner, setShowScanner] = useState(true);

  // const [scannerActive, setScannerActive] = useState(true);

  // useEffect(() => {
  //   if (!scannerRef.current || !scannerActive) return;

  //   // Prevent duplicate rendering
  //   if (document.getElementById('scanner')?.hasChildNodes()) return;

  //   const scanner = new Html5QrcodeScanner(
  //     'scanner',
  //     { fps: 10, qrbox: 250 },
  //     false
  //   );

  //   scanner.render(
  //     (decodedText) => {
  //       if (flashRef.current) {
  //         flashRef.current.classList.remove('opacity-0');
  //         flashRef.current.classList.add('opacity-100');
  //         setTimeout(() => {
  //           flashRef.current?.classList.remove('opacity-100');
  //           flashRef.current?.classList.add('opacity-0');
  //         }, 150);
  //       }

  //       const match = mockProducts.find((p) => p.id === decodedText);
  //       setScannedId(decodedText);

  //       if (match) {
  //         setScannerActive(false);
  //         router.push(`/dashboard/products/${decodedText}/edit`);
  //       }

  //       scanner.clear();
  //     },
  //     (error) => {
  //       console.warn('Scanning error', error);
  //     }
  //   );

  //   return () => {
  //     scanner.clear().catch(console.error);
  //   };
  // }, [scannerActive]);

  // const matchedProduct = mockProducts.find((p) => p.id === scannedId);

  const handleChange = (field: string, value: string) => {
    setProduct((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting Product:', product);
    router.push('/dashboard/products');
  };

  return (
    <div className="flex min-h-screen">
      {/* Flash effect */}
      {/* <div
        ref={flashRef}
        className="fixed inset-0 bg-white opacity-0 pointer-events-none transition-opacity duration-200 z-50"
      /> */}

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

            {/* Barcode Scanner */}
            {/* <Card className="p-4 mb-4">
          <h2 className="text-lg font-semibold mb-2">Scan Product Barcode</h2>

          {showScanner ? (
            <div className="w-full max-w-sm mx-auto">
              <div ref={scannerRef} id="scanner" />
              <p className="text-center text-sm text-gray-600 mt-2">
                Place the barcode in front of your camera to scan.
              </p>
            </div>
          ) : (
            <div className="text-center">
              {scannedId && !matchedProduct ? (
                <p className="text-red-600 mb-2">
                  ❌ No product found for ID: <strong>{scannedId}</strong>
                </p>
              ) : (
                <p className="text-gray-600 mb-2">Scanner is inactive.</p>
              )}
              <Button variant="outline"
                className="mt-2"
                onClick={() => {
                  setScannedId(null);
                  setShowScanner(false);
                  setTimeout(() => setShowScanner(true), 100); // Re-trigger scanner
                }}>
                🔄 Scan Again
              </Button>
            </div>
          )}
        </Card> */}
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
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
                  <Select onValueChange={(val) => handleChange('category', val)}>
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
