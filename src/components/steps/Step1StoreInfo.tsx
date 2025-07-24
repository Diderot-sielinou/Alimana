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

export default function Step1StoreInfo({ formData, errors, updateFormData, onNext }: Props) {
  return (
    <div className="space-y-6">
      {/* Store Name */}
      <FormField
        label="Store Name"
        icon={<Store className="h-4 w-4 text-gray-400" />}
        id="name"
        type="text"
        value={formData.name}
        placeholder="Enter your store name"
        error={errors.name}
        onChange={(e) => updateFormData('name', e.target.value)}
      />

      {/* Store Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Store Description</Label>
        <Textarea
          id="description"
          placeholder="Describe your store"
          className="min-h-[100px]"
          value={formData.description}
          onChange={(e) => updateFormData('description', e.target.value)}
        />
        {errors.description && <ErrorText>{errors.description}</ErrorText>}
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
        {errors.currency && <ErrorText>{errors.currency}</ErrorText>}
      </div>

      {/* Email */}
      <FormField
        label="Email"
        icon={<Mail className="h-4 w-4 text-gray-400" />}
        id="email"
        type="email"
        value={formData.email || ''}
        placeholder="example@store.com"
        error={errors.email}
        onChange={(e) => updateFormData('email', e.target.value)}
      />

      {/* Phone */}
      <FormField
        label="Phone"
        icon={<Phone className="h-4 w-4 text-gray-400" />}
        id="phone"
        type="tel"
        value={formData.phone || ''}
        placeholder="+237600000000"
        error={errors.phone}
        onChange={(e) => updateFormData('phone', e.target.value)}
      />

      {/* Website */}
      <FormField
        label="Website"
        icon={<Globe className="h-4 w-4 text-gray-400" />}
        id="websiteUrl"
        type="url"
        value={formData.websiteUrl || ''}
        placeholder="https://mystore.com"
        error={errors.websiteUrl}
        onChange={(e) => updateFormData('websiteUrl', e.target.value)}
      />

      {/* Profile Image URL */}
      <FormField
        label="Profile Image URL"
        icon={<ImageIcon className="h-4 w-4 text-gray-400" />}
        id="profileImageUrl"
        type="url"
        value={formData.profileImageUrl || ''}
        placeholder="https://cdn.store.com/profile.jpg"
        error={errors.profileImageUrl}
        onChange={(e) => updateFormData('profileImageUrl', e.target.value)}
      />

      {/* Logo Upload */}
      <div className="space-y-2">
        <Label htmlFor="logo">Store Logo</Label>
        <Input
          id="logo"
          type="file"
          accept="image/*"
          onChange={(e) => updateFormData('logo', e.target.files?.[0] || null)}
        />
        {errors.logo && <ErrorText>{errors.logo}</ErrorText>}
      </div>

      <Button onClick={onNext} className="w-full bg-amber-600 hover:bg-amber-700">
        Continue
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}

/** ✅ Reusable form field component */
function FormField({
  label,
  icon,
  id,
  type,
  placeholder,
  value,
  error,
  onChange,
}: {
  label: string;
  icon: React.ReactNode;
  id: string;
  type: string;
  placeholder?: string;
  value: string;
  error?: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <div className="absolute left-3 top-3">{icon}</div>
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          className="pl-10"
          value={value}
          onChange={onChange}
        />
      </div>
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}

/** ✅ Error text wrapper */
function ErrorText({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-red-600">{children}</p>;
}
