'use client';

import { MapPin, ArrowLeft, ArrowRight } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Step2Props {
  formData: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  errors: {
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  updateFormData: (field: string, value: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export function Step2StoreLocation({
  formData,
  errors,
  updateFormData,
  onBack,
  onNext,
}: Step2Props) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="address">Street Address</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="address"
            type="text"
            placeholder="Enter street address"
            className="pl-10"
            value={formData.address}
            onChange={(e) => updateFormData('address', e.target.value)}
          />
        </div>
        {errors.address && <p className="text-sm text-red-600">{errors.address}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            type="text"
            placeholder="City"
            value={formData.city}
            onChange={(e) => updateFormData('city', e.target.value)}
          />
          {errors.city && <p className="text-sm text-red-600">{errors.city}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            type="text"
            placeholder="State"
            value={formData.state}
            onChange={(e) => updateFormData('state', e.target.value)}
          />
          {errors.state && <p className="text-sm text-red-600">{errors.state}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="zipCode">ZIP Code</Label>
        <Input
          id="zipCode"
          type="text"
          placeholder="ZIP Code"
          value={formData.zipCode}
          onChange={(e) => updateFormData('zipCode', e.target.value)}
        />
        {errors.zipCode && <p className="text-sm text-red-600">{errors.zipCode}</p>}
      </div>

      <div className="flex space-x-4">
        <Button variant="outline" onClick={onBack} className="flex-1 bg-transparent">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={onNext} className="flex-1 bg-amber-600 hover:bg-amber-700">
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </>
  );
}
