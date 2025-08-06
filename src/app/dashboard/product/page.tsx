/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useShopData } from '@/context/store-context';
import { IProduct } from '@/types/product.interface';
import { PaginatedResponse, productAPI } from '@/services/utils';
import { ProductForm } from '@/components/newComponent/common/ProductForm';
import { useAuth } from '@/context/auth-context';

export default function ProductsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);

  const { categories } = useShopData();
  const { storeContext } = useAuth();
  const storeId = storeContext?.storeId as number;

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const rawParams = {
        page: currentPage,
        limit: 10,
        search: searchValue || undefined,
        categoryId: selectedCategory && selectedCategory !== 'all' ? selectedCategory : undefined,
      };

      const params = Object.fromEntries(
        Object.entries(rawParams).filter(([_, v]) => v !== undefined && v !== '')
      );

      console.log(`parametre de requette ${JSON.stringify(params)}`);
      const response = await productAPI.getAll(params, storeId);
      console.log(`reponse du fetch avec pagination ${JSON.stringify(response)}`);
      const data = response.data as PaginatedResponse<IProduct>;

      setProducts(data.data);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      toast.error('Erreur lors du chargement des produits');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!storeId) return;
    console.log(`le store id ${storeId}`);

    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchValue, selectedCategory, storeId]);

  if (!storeContext || !storeContext.storeId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin text-blue-600">
            <Loader2 size={48} />
          </div>
          <p className="text-lg font-medium text-gray-700">chargement en cours</p>
        </div>
      </div>
    );
  }

  const handleToggleActive = async (product: IProduct) => {
    try {
      await productAPI.toggleActive(product.id, storeId);
      toast.success(`Produit ${product.isActive ? 'désactivé' : 'activé'} avec succès`);
      await fetchProducts();
    } catch (error) {
      toast.error('Erreur lors de la modification du statut');
    }
  };

  const handleCreateProduct = async (data: Partial<IProduct>) => {
    try {
      await productAPI.create(data, storeId);
      toast.success('Produit créé avec succès');
      setIsCreateModalOpen(false);
      await fetchProducts();
    } catch (error) {
      toast.error('Erreur lors de la création du produit');
    }
  };

  const handleUpdateProduct = async (data: Partial<IProduct>) => {
    if (!editingProduct) return;

    try {
      await productAPI.update(editingProduct.id, data, storeId);
      toast.success('Produit modifié avec succès');
      setEditingProduct(null);
      await fetchProducts();
    } catch (error) {
      toast.error('Erreur lors de la modification du produit');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
    }).format(price);
  };

  const columns = [
    {
      key: 'name' as keyof IProduct,
      header: 'Nom',
      render: (product: IProduct) => (
        <div className="flex items-center space-x-3">
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={
                product.imageUrl
                  ? product.imageUrl
                  : 'https://fastly.picsum.photos/id/791/200/300.jpg?hmac=Ah_2kp5UqnZv5O0c333s3M4p-FqkCZ6ViRd1V_pAHYk'
              }
              alt={product.name}
              width={40}
              height={10}
              className="w-10 h-10 rounded-md object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center">
              <span className="text-xs text-gray-500">IMG</span>
            </div>
          )}
          <div>
            <p className="font-medium">{product.name}</p>
            {product.sku && <p className="text-xs text-gray-500">SKU: {product.sku}</p>}
          </div>
        </div>
      ),
    },
    {
      key: 'category' as keyof IProduct,
      header: 'Catégorie',
      render: (product: IProduct) => (
        <Badge variant="secondary" className="bg-orange-50 text-orange-700">
          {product.category?.name || 'Sans catégorie'}
        </Badge>
      ),
    },
    {
      key: 'sellingPrice' as keyof IProduct,
      header: 'Prix de vente',
      render: (product: IProduct) => (
        <span className="font-medium">{formatPrice(product.sellingPrice)}</span>
      ),
    },
    {
      key: 'quantityInStock' as keyof IProduct,
      header: 'Stock',
      render: (product: IProduct) => (
        <Badge
          variant={
            product.quantityInStock > 10
              ? 'default'
              : product.quantityInStock > 0
                ? 'secondary'
                : 'destructive'
          }
          className={
            product.quantityInStock > 10
              ? 'bg-green-100 text-green-800'
              : product.quantityInStock > 0
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
          }
        >
          {product.quantityInStock} {product.unit || 'unités'}
        </Badge>
      ),
    },
    {
      key: 'isActive' as keyof IProduct,
      header: 'Statut',
      render: (product: IProduct) => (
        <Badge variant={product.isActive ? 'default' : 'secondary'}>
          {product.isActive ? 'Actif' : 'Inactif'}
        </Badge>
      ),
    },
    {
      key: 'actions' as keyof IProduct,
      header: 'Actions',
      render: (product: IProduct) => (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => setEditingProduct(product)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleToggleActive(product)}>
            {product.isActive ? (
              <EyeOff className="w-4 h-4 text-red-500" />
            ) : (
              <Eye className="w-4 h-4 text-green-500" />
            )}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 ml-0 md:ml-64 ">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Produits</h1>
          <p className="text-gray-600">Gérez les produits de votre boutique</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau produit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer un nouveau produit</DialogTitle>
            </DialogHeader>
            <ProductForm onSubmit={handleCreateProduct} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex items-center space-x-4">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrer par catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <DataTable
        data={products}
        columns={columns}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Rechercher un produit..."
        pagination={{
          page: currentPage,
          totalPages,
          onPageChange: setCurrentPage,
        }}
        loading={loading}
        emptyMessage="Aucun produit trouvé"
      />
      <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier le produit</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <ProductForm initialData={editingProduct} onSubmit={handleUpdateProduct} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
