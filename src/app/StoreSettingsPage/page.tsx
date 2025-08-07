'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import Joi from 'joi';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/auth-context';
import { api } from '@/lib/api';

// --- Interfaces ---
interface Store {
  id: number;
  name: string;
  address?: string;
  currency: string; // e.g., FCFA
  status: string; // e.g., active, inactive
  createdAt: string;
  updatedAt: string;
}

interface PaymentMethod {
  id: number;
  name: string;
  type: string; // e.g., cash, card, mobile_money
  isActive: boolean;
}

// Joi validation schema for store update
const updateStoreSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    'string.min': 'Store name must be at least {#limit} characters.',
    'string.max': 'Store name must not exceed {#limit} characters.',
    'string.empty': 'Store name is required.',
    'any.required': 'Store name is required.',
  }),
  address: Joi.string().min(5).max(255).optional().allow('').messages({
    'string.min': 'Address must be at least {#limit} characters.',
    'string.max': 'Address must not exceed {#limit} characters.',
  }),
  currency: Joi.string().length(4).required().messages({
    'string.length': 'Currency must be {#limit} characters (e.g., FCFA).',
    'string.empty': 'Currency is required.',
    'any.required': 'Currency is required.',
  }),
});

type UpdateStoreFormValues = {
  name: string;
  address?: string;
  currency: string;
};

// Joi validation schema for payment method
const paymentMethodSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Method name must be at least {#limit} characters.',
    'string.max': 'Method name must not exceed {#limit} characters.',
    'string.empty': 'Name is required.',
    'any.required': 'Name is required.',
  }),
  type: Joi.string().valid('cash', 'card', 'mobile_money', 'other').required().messages({
    'any.only': 'Invalid payment method type.',
    'string.empty': 'Type is required.',
    'any.required': 'Type is required.',
  }),
});

type PaymentMethodFormValues = {
  name: string;
  type: 'cash' | 'card' | 'mobile_money' | 'other';
};

/**
 * Store Settings Page
 * Allows management of basic store info and payment methods.
 */
export default function StoreSettingsPage() {
  const { isAuthenticated, isLoading, storeContext, hasPermission } = useAuth();
  const router = useRouter();
  const params = useParams();
  const storeId = params.storeId as string;

  const [store, setStore] = useState<Store | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  // const [activeTab, setActiveTab] = useState('general');

  // Payment method modal states
  const [showPaymentMethodDialog, setShowPaymentMethodDialog] = useState(false);
  const [editingPaymentMethod, setEditingPaymentMethod] = useState<PaymentMethod | null>(null);
  const {
    register: registerPayment,
    handleSubmit: handleSubmitPayment,
    formState: { errors: paymentErrors, isSubmitting: isSubmittingPayment },
    reset: resetPaymentForm,
    setError: setPaymentError,
  } = useForm<PaymentMethodFormValues>();

  // Store update form
  const {
    register: registerStore,
    handleSubmit: handleSubmitStore,
    formState: { errors: storeErrors, isSubmitting: isSubmittingStore },
    reset: resetStoreForm,
    setError: setStoreError,
  } = useForm<UpdateStoreFormValues>();

  // Load store + payment methods
  useEffect(() => {
    const fetchStoreData = async () => {
      if (
        !storeId ||
        !isAuthenticated ||
        !storeContext ||
        storeContext.storeId !== parseInt(storeId)
      )
        return;

      setLoadingData(true);
      try {
        const storeResponse = await api.get(`/stores/${storeId}`);
        setStore(storeResponse.data);
        resetStoreForm(storeResponse.data);

        const paymentMethodsResponse = await api.get(`/stores/${storeId}/payment-methods`);
        setPaymentMethods(paymentMethodsResponse.data);
      } catch (error: unknown) {
        console.error('Error loading store settings:', error);
        toast.error('Failed to load store settings.');
        router.replace('/dashboard');
      } finally {
        setLoadingData(false);
      }
    };

    if (
      !isLoading &&
      isAuthenticated &&
      storeContext &&
      storeContext.storeId === parseInt(storeId)
    ) {
      fetchStoreData();
    }
  }, [storeId, isAuthenticated, isLoading, storeContext, resetStoreForm, router]);

  const canManageStoreSettings = hasPermission('manage_store_settings');
  const canManagePaymentMethods = hasPermission('manage_payment_methods');

  const onUpdateStoreSubmit = async (data: UpdateStoreFormValues) => {
    const { error } = updateStoreSchema.validate(data, { abortEarly: false });

    if (error) {
      error.details.forEach((detail) => {
        setStoreError(detail.path[0] as keyof UpdateStoreFormValues, {
          type: 'manual',
          message: detail.message,
        });
      });
      return;
    }

    if (!canManageStoreSettings) {
      toast.error('You do not have permission to update store settings.');
      return;
    }

    try {
      const response = await api.patch(`/stores/${storeId}`, data);
      setStore(response.data);
      toast.success('Store information updated successfully!');
    } catch (error: unknown) {
      console.error('Error updating store:', error);
      toast.error('Failed to update store.');
    }
  };

  const onPaymentMethodSubmit = async (data: PaymentMethodFormValues) => {
    const { error } = paymentMethodSchema.validate(data, { abortEarly: false });

    if (error) {
      error.details.forEach((detail) => {
        setPaymentError(detail.path[0] as keyof PaymentMethodFormValues, {
          type: 'manual',
          message: detail.message,
        });
      });
      return;
    }

    if (!canManagePaymentMethods) {
      toast.error('You do not have permission to manage payment methods.');
      return;
    }

    try {
      if (editingPaymentMethod) {
        const response = await api.patch(
          `/stores/${storeId}/payment-methods/${editingPaymentMethod.id}`,
          data
        );
        setPaymentMethods((prev) =>
          prev.map((pm) => (pm.id === editingPaymentMethod.id ? response.data : pm))
        );
        toast.success('Payment method updated successfully!');
      } else {
        const response = await api.post(`/stores/${storeId}/payment-methods`, data);
        setPaymentMethods((prev) => [...prev, response.data]);
        toast.success('Payment method added successfully!');
      }
      setShowPaymentMethodDialog(false);
      setEditingPaymentMethod(null);
      resetPaymentForm();
    } catch (error: unknown) {
      console.error('Error managing payment method:', error);
      toast.error('Failed to save payment method.');
    }
  };

  const handleDeletePaymentMethod = async (methodId: number, methodName: string) => {
    if (!canManagePaymentMethods) {
      toast.error('You do not have permission to delete payment methods.');
      return;
    }
    if (!confirm(`Are you sure you want to delete the payment method "${methodName}"?`)) return;

    try {
      await api.delete(`/stores/${storeId}/payment-methods/${methodId}`);
      setPaymentMethods((prev) => prev.filter((pm) => pm.id !== methodId));
      toast.success('Payment method deleted successfully!');
    } catch (error: unknown) {
      console.error('Error deleting payment method:', error);
      toast.error('Failed to delete payment method.');
    }
  };

  const handleOpenPaymentMethodDialog = (method: PaymentMethod | null = null) => {
    setEditingPaymentMethod(method);
    if (method) {
      resetPaymentForm(method);
    } else {
      resetPaymentForm({ name: '', type: 'cash' });
    }
    setShowPaymentMethodDialog(true);
  };

  if (isLoading || !isAuthenticated || !storeContext || loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-700">Loading store settings...</p>
      </div>
    );
  }

  if (!store || store.id !== parseInt(storeId)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50 p-4">
        <div className="text-center p-8 bg-white rounded-xl shadow-2xl border border-red-200">
          <h1 className="text-3xl font-bold text-red-700 mb-4">Access Denied</h1>
          <p className="text-gray-600">
            You do not have access to this store or it does not exist.
          </p>
          <Button onClick={() => router.replace('/dashboard')} className="mt-6">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-4xl font-extrabold text-gray-900">
          Paramètres de la Boutique <span className="text-blue-600">{store.name}</span>
        </h1>
        <Button onClick={() => router.push('/dashboard')} variant="outline">
          Retour au Tableau de Bord
        </Button>
      </header>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-2 lg:grid-cols-2 h-auto">
          <TabsTrigger value="general" className="py-3">
            Informations Générales
          </TabsTrigger>
          <TabsTrigger value="payment-methods" className="py-3">
            Méthodes de Paiement
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <Card className="bg-white shadow-lg p-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold">
                Informations Générales de la Boutique
              </CardTitle>
              <CardDescription>
                Mettez à jour les détails de base de votre boutique.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitStore(onUpdateStoreSubmit)} className="space-y-6">
                <div>
                  <Label htmlFor="store-name">Nom de la Boutique</Label>
                  <Input
                    id="store-name"
                    type="text"
                    {...registerStore('name')}
                    className="w-full"
                    disabled={!canManageStoreSettings}
                  />
                  {storeErrors.name && (
                    <p className="text-red-500 text-sm mt-1">{storeErrors.name.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="store-address">Adresse</Label>
                  <Input
                    id="store-address"
                    type="text"
                    {...registerStore('address')}
                    className="w-full"
                    disabled={!canManageStoreSettings}
                  />
                  {storeErrors.address && (
                    <p className="text-red-500 text-sm mt-1">{storeErrors.address.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="store-currency">Devise</Label>
                  <Input
                    id="store-currency"
                    type="text"
                    {...registerStore('currency')}
                    className="w-full"
                    disabled={!canManageStoreSettings}
                  />
                  {storeErrors.currency && (
                    <p className="text-red-500 text-sm mt-1">{storeErrors.currency.message}</p>
                  )}
                </div>

                {canManageStoreSettings && (
                  <Button
                    type="submit"
                    className="w-full py-3 text-lg"
                    disabled={isSubmittingStore}
                  >
                    {isSubmittingStore
                      ? 'Mise à jour en cours...'
                      : 'Enregistrer les Modifications'}
                  </Button>
                )}
                {!canManageStoreSettings && (
                  <p className="text-red-500 text-sm mt-4">
                    Vous navez pas la permission de modifier ces paramètres.
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment-methods" className="mt-6">
          <Card className="bg-white shadow-lg p-6">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-2xl font-bold">Méthodes de Paiement</CardTitle>
              {canManagePaymentMethods && (
                <Dialog open={showPaymentMethodDialog} onOpenChange={setShowPaymentMethodDialog}>
                  <DialogTrigger asChild>
                    <Button onClick={() => handleOpenPaymentMethodDialog()}>Ajouter Méthode</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] p-6">
                    <DialogHeader>
                      <DialogTitle>
                        {editingPaymentMethod
                          ? 'Modifier Méthode de Paiement'
                          : 'Ajouter Nouvelle Méthode de Paiement'}
                      </DialogTitle>
                      <DialogDescription>
                        {editingPaymentMethod
                          ? 'Mettez à jour les détails de cette méthode.'
                          : 'Ajoutez une nouvelle méthode pour vos transactions.'}
                      </DialogDescription>
                    </DialogHeader>
                    <form
                      onSubmit={handleSubmitPayment(onPaymentMethodSubmit)}
                      className="grid gap-4 py-4"
                    >
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="payment-name" className="text-right">
                          Nom
                        </Label>
                        <Input
                          id="payment-name"
                          type="text"
                          {...registerPayment('name')}
                          className="col-span-3"
                        />
                        {paymentErrors.name && (
                          <p className="col-span-4 text-red-500 text-sm mt-1">
                            {paymentErrors.name.message}
                          </p>
                        )}
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="payment-type" className="text-right">
                          Type
                        </Label>
                        <select
                          id="payment-type"
                          {...registerPayment('type')}
                          className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="cash">Espèces</option>
                          <option value="card">Carte Bancaire</option>
                          <option value="mobile_money">Mobile Money</option>
                          <option value="other">Autre</option>
                        </select>
                        {paymentErrors.type && (
                          <p className="col-span-4 text-red-500 text-sm mt-1">
                            {paymentErrors.type.message}
                          </p>
                        )}
                      </div>
                      <DialogFooter>
                        <Button type="submit" disabled={isSubmittingPayment}>
                          {isSubmittingPayment ? 'Enregistrement...' : 'Enregistrer'}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Active</TableHead>
                    {canManagePaymentMethods && (
                      <TableHead className="text-right">Actions</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentMethods.map((method) => (
                    <TableRow key={method.id}>
                      <TableCell className="font-medium">{method.name}</TableCell>
                      <TableCell>{method.type}</TableCell>
                      <TableCell>{method.isActive ? 'Oui' : 'Non'}</TableCell>
                      {canManagePaymentMethods && (
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="mr-2"
                            onClick={() => handleOpenPaymentMethodDialog(method)}
                          >
                            Modifier
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeletePaymentMethod(method.id, method.name)}
                          >
                            Supprimer
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {!canManagePaymentMethods && (
                <p className="text-red-500 text-sm mt-4">
                  You do not have permission to access this page
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
