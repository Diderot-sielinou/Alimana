'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Step1StoreInfo from '@/components/steps/Step1StoreInfo';
import Step2StoreLocation from '@/components/steps/Step2StoreLocation';
export interface StoreData {
  name: string;
  description: string;
  currency: string;
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

type StoreDataKey = keyof StoreData;

export default function CreateStorePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<StoreData>({
    name: '',
    description: '',
    currency: '',
    logo: null,
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
    websiteUrl: '',
    profileImageUrl: '',
  });
  const [errors, setErrors] = useState<Partial<Record<StoreDataKey, string>>>({});

  useEffect(() => {
    const canCreateStore = true;
    if (!canCreateStore) router.push('/403');
  }, [router]);

  const updateFormData = (field: StoreDataKey, value: string | File | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFinalSubmit = async () => {
    const formPayload = new FormData();

    try {
      // Debug: raw data

      formPayload.append('name', String(formData.name));
      if (formData.description) formPayload.append('description', String(formData.description));

      if (formData.address && formData.city && formData.state && formData.zipCode) {
        const fullAddress = `${formData.address}, ${formData.city}, ${formData.state}, ${formData.zipCode}`;
        formPayload.append('address', fullAddress);
      }

      if (formData.phone) formPayload.append('phone', String(formData.phone));
      if (formData.email) formPayload.append('email', String(formData.email));
      if (formData.websiteUrl) formPayload.append('websiteUrl', String(formData.websiteUrl));
      if (formData.profileImageUrl)
        formPayload.append('profileImageUrl', String(formData.profileImageUrl));
      if (formData.logo instanceof File) formPayload.append('logoUrl', formData.logo);

      // Debug: show final payload
      for (const [key, value] of formPayload.entries()) {
        console.log(`${key}:`, value);
      }

      console.log(formPayload);

      const response = await fetch('http://localhost:3000/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorRes = await response.json();
        console.error('Backend error:', errorRes.message);
        throw new Error(errorRes.message || 'Store creation failed');
      }

      router.push('/dashboard');
    } catch (error) {
      console.error('Store creation error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex items-center space-x-2 text-amber-600 hover:text-amber-700">
          <ArrowLeft className="h-4 w-4" />
          <Link href="/dashboard">Back to Dashboard</Link>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Create Store</CardTitle>
            <CardDescription>Follow the steps to get your store up and running</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Progress value={(step / 2) * 100} className="h-2" />

            {step === 1 && (
              <Step1StoreInfo
                formData={formData}
                errors={errors}
                updateFormData={updateFormData}
                onNext={() => setStep(2)}
              />
            )}

            {step === 2 && (
              <Step2StoreLocation
                formData={formData}
                errors={errors}
                updateFormData={updateFormData}
                onBack={() => setStep(1)}
                onNext={handleFinalSubmit}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
