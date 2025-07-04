'use client';

import { ArrowLeft, Lock, Eye, EyeOff, Store } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { StoreErrors, UpdateFormData, StoreData } from '@/types/store';

interface Props {
  formData: Pick<StoreData, 'password' | 'confirmPassword'>;
  errors: StoreErrors;
  showPassword: boolean;
  showConfirmPassword: boolean;
  setShowPassword: (show: boolean) => void;
  setShowConfirmPassword: (show: boolean) => void;
  updateFormData: UpdateFormData;
  onBack: () => void;
  onSubmit: () => void;
}

export function Step3SecureAccount({
  formData,
  errors,
  showPassword,
  showConfirmPassword,
  setShowPassword,
  setShowConfirmPassword,
  updateFormData,
  onBack,
  onSubmit,
}: Props) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a strong password"
            className="pl-10 pr-10"
            value={formData.password}
            onChange={(e) => updateFormData('password', e.target.value)}
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            className="pl-10 pr-10"
            value={formData.confirmPassword}
            onChange={(e) => updateFormData('confirmPassword', e.target.value)}
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
      </div>

      <div className="flex space-x-4">
        <Button variant="outline" onClick={onBack} className="flex-1 bg-transparent">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={onSubmit} className="flex-1 bg-amber-600 hover:bg-amber-700">
          Create Your Store
          <Store className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </>
  );
}
