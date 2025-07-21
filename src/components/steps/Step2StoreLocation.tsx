'use client';

import { MapPin, ArrowLeft, ArrowRight } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { StoreData } from '@/app/create-store/page';

interface Props {
  formData: Pick<StoreData, 'address' | 'city' | 'state' | 'zipCode'>;
  errors: Partial<Record<keyof StoreData, string>>;
  updateFormData: (field: keyof StoreData, value: string) => void;
  onBack: () => void;
  onNext: () => void;
}

/**
 * A React component that renders a form step for entering and validating store location details.
 *
 * Displays controlled input fields for street address, city, state, and zip code, each with associated labels and validation error messages. The component provides navigation buttons to move back or proceed to store creation. Accessibility is supported through proper labeling and input associations. The street address input includes a location icon for visual context, and city/state fields are arranged side by side for a compact layout.
 *
 * @param formData - The current values for address, city, state, and zip code fields.
 * @param errors - Validation error messages for each form field, displayed below the corresponding input.
 * @param updateFormData - Callback to update individual form field values.
 * @param onBack - Callback triggered when the "Back" button is clicked.
 * @param onNext - Callback triggered when the "Create Store" button is clicked.
 *
 * @returns The rendered form step for store location entry.
 */
export default function Step2StoreLocation({
  formData,
  errors,
  updateFormData,
  onBack,
  onNext,
}: Props) {
  return (
    <div className="space-y-6">
      {/* Full Address */}
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
        <Label htmlFor="zipCode">Zip Code</Label>
        <Input
          id="zipCode"
          type="text"
          placeholder="Zip code"
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
          Create Store
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
