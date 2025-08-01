// src/app/dashboard/products/page.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Edit, Trash2, Package, Loader2 } from 'lucide-react';
import { Product } from '@/types/product';
import toast from 'react-hot-toast';
import { api } from '@/lib/api'; 
import { useShopData } from '@/context/store-context';
import { ProductForm } from '@/components/newComponent/common/ProductForm';
import { DeleteConfirmationDialog } from '@/components/newComponent/common/DeleteConfirmationDialog';
import { DataTable } from '@/components/newComponent/pos/DataTable';

export default function ProductsPage() {
  const { products, categories, loadInitialData, isLoading } = useShopData();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<number | null>(null);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = React.useState<Product | null>(null);
  const [showForm, setShowForm] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const filteredProducts = React.useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.barcode.includes(searchTerm);
      const matchesCategory = !selectedCategory || product.categoryId === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const handleFormSaveSuccess = () => {
    setShowForm(false);
    setEditingProduct(null); // Réinitialise l'état d'édition
    loadInitialData(); // Rafraîchit la liste des produits
  };

  const handleDeleteProduct = async () => {
    if (!deletingProduct) return;

    setIsDeleting(true);
    try {
      await api.delete(`/products/${deletingProduct.id}`);
      toast.success('Produit supprimé avec succès !');
      loadInitialData(); // Rafraîchit la liste des produits
      setDeletingProduct(null); // Ferme le dialogue de confirmation
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
      toast.error('Échec de la suppression du produit.');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = React.useMemo(() => [
    {
      header: 'Produit',
      accessorKey: 'name',
      cell: ({ row }: any) => (
        <div>
          <div className="font-medium">{row.original.name}</div>
          <div className="text-sm text-gray-500">{row.original.barcode}</div>
        </div>
      ),
    },
    {
      header: 'Catégorie',
      accessorKey: 'category',
      cell: ({ row }: any) => {
        const category = categories.find(cat => cat.id === row.original.categoryId);
        return category ? (
          <Badge
            variant="secondary"
            style={{
              backgroundColor: category.color ? `${category.color}20` : '#E0E0E0', // Fallback color
              color: category.color || '#616161'
            }}
          >
            {category.name}
          </Badge>
        ) : <Badge variant="secondary">Inconnu</Badge>;
      },
    },
    {
      header: 'Prix',
      accessorKey: 'price',
      cell: ({ row }: any) => (
        <div className="font-medium">
          {row.original.price.toLocaleString()} XAF
        </div>
      ),
    },
    {
      header: 'Stock',
      accessorKey: 'stock',
      cell: ({ row }: any) => (
        <Badge variant={row.original.stock > 10 ? 'success' : row.original.stock > 0 ? 'warning' : 'destructive'}>
          {row.original.stock}
        </Badge>
      ),
    },
    {
      header: 'Statut',
      accessorKey: 'isActive',
      cell: ({ row }: any) => (
        <Badge variant={row.original.isActive ? 'success' : 'secondary'}>
          {row.original.isActive ? 'Actif' : 'Inactif'}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      id: 'actions', // Important pour des colonnes sans accessorKey
      cell: ({ row }: any) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEditingProduct(row.original);
              setShowForm(true);
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700"
            onClick={() => setDeletingProduct(row.original)} // Ouvre le dialogue de confirmation
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ], [categories]); // Dépend de `categories` pour l'affichage correct du badge de catégorie

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-gray-500">Chargement des produits...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Produits</h1>
          <p className="text-gray-500 mt-1">Gérez linventaire de vos produits ici.</p>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingProduct(null); setShowForm(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un produit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Modifier le produit' : 'Ajouter un nouveau produit'}</DialogTitle>
            </DialogHeader>
            <ProductForm initialData={editingProduct} onSaveSuccess={handleFormSaveSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Barre de recherche et filtres de catégorie */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Rechercher par nom ou code-barres..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            Toutes
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

      {/* Tableau des produits */}
      {filteredProducts.length === 0 && !isLoading ? (
        <div className="text-center py-8">
          <Package className="w-10 h-10 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">Aucun produit trouvé.</p>
        </div>
      ) : (
        <DataTable columns={columns} data={filteredProducts} />
      )}

      {deletingProduct && (
        <DeleteConfirmationDialog
          isOpen={!!deletingProduct}
          onClose={() => setDeletingProduct(null)}
          onConfirm={handleDeleteProduct}
          title={`Supprimer "${deletingProduct.name}" ?`}
          description="Cette action est irréversible. Êtes-vous sûr de vouloir supprimer ce produit ?"
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}