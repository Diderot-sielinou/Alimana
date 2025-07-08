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
  storeName: string;
  storeDescription: string;
  currency: string;
  logo?: File | null;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

type StoreDataKey = keyof StoreData;

export default function CreateStorePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<StoreData>({
    storeName: '',
    storeDescription: '',
    currency: '',
    logo: null,
    address: '',
    city: '',
    state: '',
    zipCode: '',
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

    (Object.entries(formData) as [StoreDataKey, string | File | null][]).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formPayload.append(key, value instanceof File ? value : String(value));
      }
    });

    try {
      const response = await fetch('/api/stores/create', {
        method: 'POST',
        body: formPayload,
      });

      if (!response.ok) throw new Error('Store creation failed');

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
