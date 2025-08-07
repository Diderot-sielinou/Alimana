'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Scan, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { useShopData } from '@/context/store-context';
import { IProduct } from '@/types/product.interface';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface ProductSearchProps {
  onProductSelect: (product: IProduct) => void;
}

export const ProductSearch: React.FC<ProductSearchProps> = ({ onProductSelect }) => {
  const categoryColorsMap = new Map<number, string>();
  const getCategoryColor = (categoryId: number): string => {
    if (categoryColorsMap.has(categoryId)) return categoryColorsMap.get(categoryId)!;
    const randomColor = `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0')}`;
    categoryColorsMap.set(categoryId, randomColor);
    return randomColor;
  };

  const { products, categories, findProductByBarcode } = useShopData();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<number | null>(null);
  const [isScanning, setIsScanning] = React.useState(false);
  const [showScanner, setShowScanner] = React.useState(false);
  const scannerRef = React.useRef<HTMLDivElement | null>(null);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product?.barcode?.includes(searchTerm);
    const matchesCategory = !selectedCategory || product.categoryId === selectedCategory;
    return matchesSearch && matchesCategory && product.isActive;
  });

  const handleBarcodeSearch = async (barcode: string) => {
    if (barcode.length >= 8) {
      setIsScanning(true);
      try {
        const product = await findProductByBarcode(barcode);
        if (product) {
          onProductSelect(product);
          setSearchTerm('');
          toast.success(`Product found: ${product.name}`);
        } else {
          toast.error('Product not found');
        }
      } catch (error) {
        const err = error as Error;
        toast.error(`Error while searching: ${err.message}`);
      } finally {
        setIsScanning(false);
      }
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (/^\d{8,}$/.test(value)) {
      handleBarcodeSearch(value);
    }
  };

  // Initialize barcode scanner
  React.useEffect(() => {
    if (!showScanner || !scannerRef.current) return;
    if (scannerRef.current.hasChildNodes()) return;

    const scanner = new Html5QrcodeScanner('barcode-scanner', { fps: 10, qrbox: 250 }, false);

    scanner.render(
      (decodedText) => {
        setSearchTerm(decodedText);
        handleBarcodeSearch(decodedText);
        setShowScanner(false);
        scanner.clear();
      },
      (error) => {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Scanning error', error);
        }
      }
    );

    return () => {
      scanner.clear().catch(console.error);
    };
  }, [showScanner]);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Search a product</h2>

        {/* Barcode Scanner Button */}
        <div className="flex justify-between mb-4">
          <Button type="button" variant="outline" onClick={() => setShowScanner(true)}>
            📷 Scan Barcode
          </Button>
        </div>

        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Name of product or barcode..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 pr-10"
          />
          {isScanning && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Scan className="w-4 h-4 text-primary animate-pulse" />
            </div>
          )}
        </div>

        {/* Barcode Scanner UI */}
        {showScanner && (
          <div className="mt-4">
            <div ref={scannerRef} id="barcode-scanner" className="w-full max-w-sm mx-auto" />
            <p className="text-center text-sm text-gray-600 mt-2">
              Place the barcode in front of your camera.
            </p>
            <div className="text-center mt-2">
              <Button variant="ghost" onClick={() => setShowScanner(false)}>
                ❌ Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Product List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No product found</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => onProductSelect(product)}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-500">
                  {product.barcode} • Stock: {product.quantityInStock}
                </p>
                <Badge
                  variant="secondary"
                  style={{
                    backgroundColor: `${product.category?.color ?? getCategoryColor(product.categoryId ?? 1)}20`,
                    color: product.category?.color ?? getCategoryColor(product.categoryId ?? 1),
                  }}
                  className="mt-1"
                >
                  {product?.category?.name ?? 'No category'}
                </Badge>
              </div>
              <div className="text-right ml-4">
                <p className="font-semibold text-lg text-gray-900">
                  {product.sellingPrice.toLocaleString()} XAF
                </p>
                <Button size="sm" className="mt-1">
                  Add
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
