'use client';

import { Store, ArrowRight, Mail, Phone, Globe, Image as ImageIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RequiredLabel } from '../ui/required-label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { FormikProps } from 'formik';

export interface StoreFormValues {
  name: string;
  description: string;
  logo?: File | null;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone?: string;
  email?: string;
  websiteUrl?: string;
  profileImageUrl?: string;
}

interface Props {
  formik: FormikProps<StoreFormValues>;
  onNext: () => void;
}

export default function Step1StoreInfo({ formik, onNext }: Props) {
  return (
    <div className="space-y-6">
      {/* Store Name */}
      <div className="space-y-2">
        <RequiredLabel htmlFor="name">Store Name</RequiredLabel>
        <div className="relative">
          <Store className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="name"
            type="text"
            placeholder="Enter your store name"
            className="pl-10"
            value={formik.values.name}
            onChange={formik.handleChange}
          />
        </div>
        {formik.errors.name && <p className="text-sm text-red-600">{formik.errors.name}</p>}
      </div>

      {/* Store Description */}
      <div className="space-y-2">
        <Label htmlFor="storeDescription">Store Description</Label>
        <Textarea
          id="storeDescription"
          placeholder="Describe your store"
          className="min-h-[100px]"
          value={formik.values.description}
          onChange={formik.handleChange}
        />
        {formik.errors.description && (
          <p className="text-sm text-red-600">{formik.errors.description}</p>
        )}
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
            value={formik.values.email}
            onChange={formik.handleChange}
          />
        </div>
        {formik.errors.email && <p className="text-sm text-red-600">{formik.errors.email}</p>}
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
            value={formik.values.phone}
            onChange={formik.handleChange}
          />
        </div>
        {formik.errors.phone && <p className="text-sm text-red-600">{formik.errors.phone}</p>}
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
            value={formik.values.websiteUrl}
            onChange={formik.handleChange}
          />
        </div>
        {formik.errors.websiteUrl && (
          <p className="text-sm text-red-600">{formik.errors.websiteUrl}</p>
        )}
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
            value={formik.values.profileImageUrl}
            onChange={formik.handleChange}
          />
        </div>
        {formik.errors.profileImageUrl && (
          <p className="text-sm text-red-600">{formik.errors.profileImageUrl}</p>
        )}
      </div>

      {/* Logo Upload */}
      <div className="space-y-2">
        <Label htmlFor="logo">Store Logo</Label>
        <Input id="logo" type="file" accept="image/*" onChange={formik.handleChange} />
        {formik.errors.logo && <p className="text-sm text-red-600">{formik.errors.logo}</p>}
      </div>

      <Button onClick={onNext} className="w-full bg-amber-600 hover:bg-amber-700">
        Continue
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
