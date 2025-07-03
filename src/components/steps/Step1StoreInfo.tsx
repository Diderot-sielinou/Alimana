'use client';

import { Store, ArrowRight } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface Props {
  formData: {
    storeName: string;
    storeDescription: string;
  };
  errors: {
    storeName?: string;
    storeDescription?: string;
  };
  updateFormData: (field: string, value: string) => void;
  onNext: () => void;
}

export default function Step1StoreInfo({ formData, errors, updateFormData, onNext }: Props) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="storeName">Store Name</Label>
        <div className="relative">
          <Store className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="storeName"
            type="text"
            placeholder="Enter your store name"
            className="pl-10"
            value={formData.storeName}
            onChange={(e) => updateFormData('storeName', e.target.value)}
          />
        </div>
        {errors.storeName && <p className="text-sm text-red-600">{errors.storeName}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="storeDescription">Store Description</Label>
        <Textarea
          id="storeDescription"
          placeholder="Describe what your store sells..."
          className="min-h-[100px]"
          value={formData.storeDescription}
          onChange={(e) => updateFormData('storeDescription', e.target.value)}
        />
        {errors.storeDescription && (
          <p className="text-sm text-red-600">{errors.storeDescription}</p>
        )}
      </div>

      <Button onClick={onNext} className="w-full bg-amber-600 hover:bg-amber-700">
        Continue
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </>
  );
}
