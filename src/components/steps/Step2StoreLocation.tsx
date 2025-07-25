'use client';

import { MapPin, ArrowLeft, ArrowRight } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormikProps } from 'formik';
import { StoreFormValues } from './Step1StoreInfo';

interface Props {
  formik: FormikProps<StoreFormValues>;
  onBack: () => void;
  onNext: () => void;
}

export default function Step2StoreLocation({ formik, onBack, onNext }: Props) {
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
            value={formik.values.address}
            onChange={formik.handleChange}
          />
        </div>
        {formik.errors.address && <p className="text-sm text-red-600">{formik.errors.address}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            type="text"
            placeholder="City"
            value={formik.values.city}
            onChange={formik.handleChange}
          />
          {formik.errors.city && <p className="text-sm text-red-600">{formik.errors.city}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            type="text"
            placeholder="State"
            value={formik.values.state}
            onChange={formik.handleChange}
          />
          {formik.errors.state && <p className="text-sm text-red-600">{formik.errors.state}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="zipCode">Zip Code</Label>
        <Input
          id="zipCode"
          type="text"
          placeholder="Zip code"
          value={formik.values.zipCode}
          onChange={formik.handleChange}
        />
        {formik.errors.zipCode && <p className="text-sm text-red-600">{formik.errors.zipCode}</p>}
      </div>

      <div className="flex space-x-4">
        <Button variant="outline" onClick={onBack} className="flex-1 bg-transparent">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={onNext}
          type="submit"
          disabled={formik.isSubmitting}
          className="flex-1 bg-amber-600 hover:bg-amber-700"
        >
          {formik.isSubmitting ? 'Submitting...' : 'Create Store'}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
