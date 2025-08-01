/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import toast from 'react-hot-toast';
import { ICategory } from '@/types/category.interface';
import { CategoryForm } from '@/components/newComponent/categories/CategoryForm';
import { useShopData } from '@/context/store-context';
import { categoryAPI } from '@/services/utils';
import { useAuth } from '@/context/auth-context';

export default function CategoriesPage() {
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);
  const { categories, refreshCategories } = useShopData();
  const { storeContext } = useAuth();
  if (!storeContext) {
    throw Error('missing store context');
  }

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      (category.description &&
        category.description.toLowerCase().includes(searchValue.toLowerCase()))
  );

  const handleCreateCategory = async (data: Partial<ICategory>) => {
    setLoading(true);
    try {
      await categoryAPI.create(data, storeContext?.storeId);
      toast.success('Catégorie créée avec succès');
      setIsCreateModalOpen(false);
      await refreshCategories();
    } catch (error) {
      toast.error('Erreur lors de la création de la catégorie');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategory = async (data: Partial<ICategory>) => {
    if (!editingCategory) return;

    setLoading(true);
    try {
      await categoryAPI.update(editingCategory.id, data, storeContext?.storeId);
      toast.success('Catégorie modifiée avec succès');
      setEditingCategory(null);
      await refreshCategories();
    } catch (error) {
      toast.error('Erreur lors de la modification de la catégorie');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (category: ICategory) => {
    setLoading(true);
    try {
      await categoryAPI.delete(category.id, storeContext?.storeId);
      toast.success('Catégorie supprimée avec succès');
      await refreshCategories();
    } catch (error) {
      toast.error('Erreur lors de la suppression de la catégorie');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'name' as keyof ICategory,
      header: 'Nom',
      render: (category: ICategory) => (
        <div className="flex items-center space-x-3">
          <div
            className="w-4 h-4 rounded-full border"
            style={{ backgroundColor: category.color || '#6b7280' }}
          />
          <div>
            <p className="font-medium">{category.name}</p>
            {category.description && (
              <p className="text-sm text-gray-500">{category.description}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'products' as keyof ICategory,
      header: 'Produits',
      render: (category: ICategory) => (
        <Badge variant="secondary" className="bg-blue-50 text-blue-700">
          <Package className="w-3 h-3 mr-1" />
          {category.products?.length || 0} produits
        </Badge>
      ),
    },
    {
      key: 'createdAt' as keyof ICategory,
      header: 'Date de création',
      render: (category: ICategory) => (
        <span className="text-sm text-gray-500">
          {new Date(category.createdAt).toLocaleDateString('fr-FR')}
        </span>
      ),
    },
    {
      key: 'actions' as keyof ICategory,
      header: 'Actions',
      render: (category: ICategory) => (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => setEditingCategory(category)}>
            <Edit className="w-4 h-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Supprimer la catégorie</AlertDialogTitle>
                <AlertDialogDescription>
                  Êtes-vous sûr de vouloir supprimer la catégorie
                  {category.name} ? Cette action est irréversible et tous les produits associés
                  perdront leur catégorie.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDeleteCategory(category)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 px-6 py-4 ml-0 md:ml-64 ">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Catégories</h1>
          <p className="text-gray-600">Organisez vos produits par catégories</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle catégorie
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer une nouvelle catégorie</DialogTitle>
            </DialogHeader>
            <CategoryForm onSubmit={handleCreateCategory} />
          </DialogContent>
        </Dialog>
      </div>
      <DataTable
        data={filteredCategories}
        columns={columns}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Rechercher une catégorie..."
        loading={loading}
        emptyMessage="Aucune catégorie trouvée"
      />
      {/* Edit Category Modal */}
      <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la catégorie</DialogTitle>
          </DialogHeader>
          {editingCategory && (
            <CategoryForm initialData={editingCategory} onSubmit={handleUpdateCategory} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
