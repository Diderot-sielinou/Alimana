'use client';

import { Store, ArrowRight, Mail, Phone, Globe, Image as ImageIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { StoreData } from '@/app/create-store/page';

interface Props {
  formData: Pick<
    StoreData,
    | 'name'
    | 'description'
    | 'currency'
    | 'logo'
    | 'email'
    | 'phone'
    | 'websiteUrl'
    | 'profileImageUrl'
  >;
  errors: Partial<Record<keyof StoreData, string>>;
  updateFormData: (field: keyof StoreData, value: string | File | null) => void;
  onNext: () => void;
}

/**
 * Renders the first step of a multi-step form for collecting store information.
 *
 * Displays input fields for store name, description, preferred currency, email, phone, website URL, profile image URL, and logo upload. Each field shows validation errors if present. User input is propagated via the provided update callback. A "Continue" button advances to the next step.
 *
 * @param formData - The current values for all store information fields in this step
 * @param errors - Validation error messages for each field, keyed by field name
 * @param updateFormData - Callback to update a specific field in the form data
 * @param onNext - Callback to proceed to the next step of the form
 */
export default function Step1StoreInfo({ formData, errors, updateFormData, onNext }: Props) {
  return (
    <div className="space-y-6">
      {/* Store Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Store Name</Label>
        <div className="relative">
          <Store className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="name"
            type="text"
            placeholder="Enter your store name"
            className="pl-10"
            value={formData.name}
            onChange={(e) => updateFormData('name', e.target.value)}
          />
        </div>
        {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
      </div>

      {/* Store Description */}
      <div className="space-y-2">
        <Label htmlFor="storeDescription">Store Description</Label>
        <Textarea
          id="storeDescription"
          placeholder="Describe your store"
          className="min-h-[100px]"
          value={formData.description}
          onChange={(e) => updateFormData('description', e.target.value)}
        />
        {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
      </div>

      {/* Currency */}
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

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="example@store.com"
            className="pl-10"
            value={formData.email || ''}
            onChange={(e) => updateFormData('email', e.target.value)}
          />
        </div>
        {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="phone"
            type="tel"
            placeholder="+237600000000"
            className="pl-10"
            value={formData.phone || ''}
            onChange={(e) => updateFormData('phone', e.target.value)}
          />
        </div>
        {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
      </div>

      {/* Website */}
      <div className="space-y-2">
        <Label htmlFor="websiteUrl">Website</Label>
        <div className="relative">
          <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="websiteUrl"
            type="url"
            placeholder="https://mystore.com"
            className="pl-10"
            value={formData.websiteUrl || ''}
            onChange={(e) => updateFormData('websiteUrl', e.target.value)}
          />
        </div>
        {errors.websiteUrl && <p className="text-sm text-red-600">{errors.websiteUrl}</p>}
      </div>

      {/* Profile Image URL */}
      <div className="space-y-2">
        <Label htmlFor="profileImageUrl">Profile Image URL</Label>
        <div className="relative">
          <ImageIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="profileImageUrl"
            type="url"
            placeholder="https://cdn.store.com/profile.jpg"
            className="pl-10"
            value={formData.profileImageUrl || ''}
            onChange={(e) => updateFormData('profileImageUrl', e.target.value)}
          />
        </div>
        {errors.profileImageUrl && <p className="text-sm text-red-600">{errors.profileImageUrl}</p>}
      </div>

      {/* Logo Upload */}
      <div className="space-y-2">
        <Label htmlFor="logo">Store Logo</Label>
        <Input
          id="logo"
          type="file"
          accept="image/*"
          onChange={(e) => updateFormData('logo', e.target.files?.[0] || null)}
        />
        {errors.logo && <p className="text-sm text-red-600">{errors.logo}</p>}
      </div>

      <Button onClick={onNext} className="w-full bg-amber-600 hover:bg-amber-700">
        Continue
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
