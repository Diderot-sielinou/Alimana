'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { PAYMENT_METHOD_TYPES } from '@/constants/paymentMethodTypes';

interface PaymentMethodFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  errors: any;
  register: any;
}

export const PaymentMethodDialog = ({
  open,
  onClose,
  onSubmit,
  isSubmitting,
  errors,
  register,
}: PaymentMethodFormProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter une méthode de paiement</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="label">Nom</Label>
            <Input id="label" {...register('label')} />
            {errors.label && <p className="text-red-500 text-sm">{errors.label.message}</p>}
          </div>

          <div>
            <Label htmlFor="type">Type</Label>
            <select id="type" {...register('type')} className="w-full border rounded px-3 py-2">
              <option value="">Sélectionner un type</option>
              {PAYMENT_METHOD_TYPES.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Ajout en cours...' : 'Ajouter'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
