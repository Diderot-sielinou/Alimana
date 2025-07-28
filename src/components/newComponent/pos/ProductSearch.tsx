// src/components/pos/ProductSearch.tsx
'use client';

import React from 'react';
import { Product } from '@/types/product';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Scan, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { useShopData } from '@/context/store-context';

interface ProductSearchProps {
  onProductSelect: (product: Product) => void;
}

export const ProductSearch: React.FC<ProductSearchProps> = ({ onProductSelect }) => {
  const { products, categories, findProductByBarcode } = useShopData();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<number | null>(null);
  const [isScanning, setIsScanning] = React.useState(false);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.barcode.includes(searchTerm);
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
          toast.success(`Produit trouvé: ${product.name}`);
        } else {
          toast.error('Produit non trouvé');
        }
      } catch (error) {
        toast.error('Erreur lors de la recherche');
      } finally {
        setIsScanning(false);
      }
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    // Recherche automatique par code-barres si le format correspond
    if (/^\d{8,}$/.test(value)) {
      handleBarcodeSearch(value);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Rechercher un produit</h2>
        
        {/* Barre de recherche */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Nom du produit ou code-barres..."
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

        {/* Filtres par catégorie */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            Toutes
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Liste des produits */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Aucun produit trouvé</p>
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
                  {product.barcode} • Stock: {product.stock}
                </p>
                <Badge
                  variant="secondary"
                   // Utilisez une couleur dynamique si votre `category` type a une propriété `color`
                  // Sinon, utilisez une couleur statique ou un tableau de couleurs prédéfini.
                  // Pour l'exemple, j'assume que `product.category.color` existe et est un code couleur valide.
                  style={{ backgroundColor: product.category.color + '20', color: product.category.color }}
                  className="mt-1"
                >
                  {product.category.name}
                </Badge>
              </div>
              <div className="text-right ml-4">
                <p className="font-semibold text-lg text-gray-900">
                  {product.price.toLocaleString()} XAF
                </p>
                <Button size="sm" className="mt-1">
                  Ajouter
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};