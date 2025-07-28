// src/components/forms/ProductForm.tsx
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Product } from '@/types/product';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import { useShopData } from '@/context/store-context';

// Schéma de validation pour les produits
const productFormSchema = z.object({
  name: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères.' }),
  description: z.string().optional(),
  price: z.preprocess(
    (val) => Number(val),
    z.number().positive({ message: 'Le prix doit être un nombre positif.' })
  ),
  stock: z.preprocess(
    (val) => Number(val),
    z.number().int().min(0, { message: 'Le stock doit être un entier positif ou nul.' })
  ),
  barcode: z.string().optional(),
  categoryId: z.preprocess(
    (val) => Number(val),
    z.number({ invalid_type_error: 'Veuillez sélectionner une catégorie.' })
  ),
  isActive: z.boolean().default(true),
});

interface ProductFormProps {
  initialData?: Product | null; // Pour l'édition
  onSaveSuccess: () => void; // Callback après succès (pour fermer le modal, rafraîchir la liste)
}

export const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSaveSuccess }) => {
  const { categories, fetchShopData } = useShopData();
  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      barcode: '',
      categoryId: undefined,
      isActive: true,
    },
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function onSubmit(values: z.infer<typeof productFormSchema>) {
    setIsSubmitting(true);
    try {
      if (initialData) {
        // Mode édition
        await api.put(`/products/${initialData.id}`, values);
        toast.success('Produit mis à jour avec succès !');
      } else {
        // Mode création
        await api.post('/products', values);
        toast.success('Produit ajouté avec succès !');
      }
      onSaveSuccess(); // Appelle le callback après succès
      fetchShopData(); // Rafraîchit les données globales de la boutique
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde du produit:', error);
      toast.error(error.message || 'Erreur lors de la sauvegarde du produit.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du produit</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Coca-Cola 50cl" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optionnel)</FormLabel>
              <FormControl>
                <Textarea placeholder="Une boisson rafraîchissante..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prix (XAF)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="500" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="100" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="barcode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code-barres (optionnel)</FormLabel>
              <FormControl>
                <Input placeholder="123456789012" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catégorie</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value ? String(field.value) : undefined}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Statut</FormLabel>
                <FormDescription>
                  Rendre le produit actif ou inactif pour la vente.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            null
          )}
          {initialData ? 'Mettre à jour le produit' : 'Ajouter le produit'}
        </Button>
      </form>
    </Form>
  );
};