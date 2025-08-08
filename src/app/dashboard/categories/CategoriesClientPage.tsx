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
import { LoadingSpinner } from '@/components/dashboard/LoadingSpinner';

export default function CategoriesClientPage() {
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);
  const { categories, refreshCategories } = useShopData();
  const { storeContext } = useAuth();
  if (!storeContext) {
    return <LoadingSpinner />;
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
      toast.success('Category successfully created');
      setIsCreateModalOpen(false);
      await refreshCategories();
    } catch (error) {
      toast.error('Error while creating the category');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategory = async (data: Partial<ICategory>) => {
    if (!editingCategory) return;

    setLoading(true);
    try {
      await categoryAPI.update(editingCategory.id, data, storeContext?.storeId);
      toast.success('Category successfully updated');
      setEditingCategory(null);
      await refreshCategories();
    } catch (error) {
      toast.error('Error while updating the category');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (category: ICategory) => {
    setLoading(true);
    try {
      await categoryAPI.delete(category.id, storeContext?.storeId);
      toast.success('Category successfully deleted');
      await refreshCategories();
    } catch (error) {
      toast.error('Error while deleting the category');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'name' as keyof ICategory,
      header: 'Name',
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
      header: 'Products',
      render: (category: ICategory) => (
        <Badge variant="secondary" className="bg-blue-50 text-blue-700">
          <Package className="w-3 h-3 mr-1" />
          {category.products?.length || 0} products
        </Badge>
      ),
    },
    {
      key: 'createdAt' as keyof ICategory,
      header: 'Creation Date',
      render: (category: ICategory) => (
        <span className="text-sm text-gray-500">
          {new Date(category.createdAt).toLocaleDateString('en-US')}
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
                <AlertDialogTitle>Delete Category</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete the category {category.name}? This action is
                  irreversible and all associated products will lose their category.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDeleteCategory(category)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
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
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600">Organize your products by categories</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-slate-900 hover:bg-slate-800">
              <Plus className="w-4 h-4 mr-2" />
              New Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Category</DialogTitle>
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
        searchPlaceholder="Search a category..."
        loading={loading}
        emptyMessage="No categories found"
      />
      {/* Edit Category Modal */}
      <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          {editingCategory && (
            <CategoryForm initialData={editingCategory} onSubmit={handleUpdateCategory} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
