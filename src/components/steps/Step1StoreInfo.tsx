'use client';

import { Store, ArrowRight } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { StoreData } from '@/app/create-store/page';

interface Props {
  formData: Pick<StoreData, 'storeName' | 'storeDescription' | 'currency' | 'logo'>;
  errors: Partial<Record<keyof StoreData, string>>;
  updateFormData: (field: keyof StoreData, value: string | File | null) => void;
  onNext: () => void;
}

export default function Step1StoreInfo({ formData, errors, updateFormData, onNext }: Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        {' '}
        <Label htmlFor="storeName">Store Name</Label>{' '}
        <div className="relative">
          {' '}
          <Store className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="storeName"
            type="text"
            placeholder="Enter your store name"
            className="pl-10"
            value={formData.storeName}
            onChange={(e) => updateFormData('storeName', e.target.value)}
          />{' '}
        </div>
        {errors.storeName && <p className="text-sm text-red-600">{errors.storeName}</p>}
      </div>

      {/* Store Description */}
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

      {/* Currency Dropdown */}
      <div className="space-y-2">
        <Label htmlFor="currency">Preferred Currency</Label>
        <select
          id="currency"
          className="w-full border rounded-md px-3 py-2 text-sm"
          value={formData.currency}
          onChange={(e) => updateFormData('currency', e.target.value)}
        >
          <option value="">Select currency</option>
          <option value="XAF">XAF - Central African Franc</option>
          <option value="USD">USD - US Dollar</option>
          <option value="EUR">EUR - Euro</option>
          <option value="NGN">NGN - Nigerian Naira</option>
          <option value="KES">KES - Kenyan Shilling</option>
        </select>
        {errors.currency && <p className="text-sm text-red-600">{errors.currency}</p>}
      </div>

      {/* Logo Upload */}
      <div className="space-y-2">
        <Label htmlFor="logo">Store Logo</Label>
        <div className="relative">
          <Input
            id="logo"
            type="file"
            accept="image/*"
            onChange={(e) => updateFormData('logo', e.target.files?.[0] || null)}
          />
        </div>
        {errors.logo && <p className="text-sm text-red-600">{errors.logo}</p>}
      </div>

      <Button onClick={onNext} className="w-full bg-amber-600 hover:bg-amber-700">
        Continue
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
