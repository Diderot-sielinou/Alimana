'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Step1StoreInfo from '@/components/steps/Step1StoreInfo';
import Step2StoreLocation from '@/components/steps/Step2StoreLocation';
import { useFormik } from 'formik';
import { createStoreValidationSchema } from '@/schema/validation-schema';
import { useAuth } from '@/context/auth-context';
import { api } from '@/lib/api';
export interface StoreData {
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

export default function CreateStorePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const { user, fetchMe, storeContext } = useAuth();

  const formik = useFormik<StoreData>({
    initialValues: {
      name: '',
      description: '',
      logo: null,
      address: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
      email: '',
      websiteUrl: '',
      profileImageUrl: '',
    },
    validationSchema: createStoreValidationSchema,
    onSubmit: async (values) => {
      try {
        const payload = {
          name: values.name,
          description: values.description,
          address:
            values.address && values.city && values.state && values.zipCode
              ? `${values.address}, ${values.city}, ${values.state}, ${values.zipCode}`
              : null,
          phone: values.phone || null,
          email: values.email || null,
          websiteUrl: values.websiteUrl || null,
          logoUrl: null, // ou l'url de ton logo si upload géré
          profileImageUrl: values.profileImageUrl || null,
        };
        const response = await api.post('/store', payload); // <-- envoi direct ici
        const accessToken = response.data?.accessToken;
        localStorage.setItem('accessToken', accessToken);
        fetchMe();
        if (storeContext) {
          router.replace('/dashboard');
        }
      } catch (error) {
        console.error('Store creation error:', error);
      }
    },
  });

  const handleNextStep = async () => {
    // Define which fields to validate based on current step
    const fieldsToValidate =
      step === 1 ? ['name', 'description'] : ['address', 'city', 'state', 'zipCode'];

    const validationErrors = await formik.validateForm();

    const hasErrors = fieldsToValidate.some((field) => validationErrors[field as keyof StoreData]);

    if (!hasErrors) {
      setStep(step + 1);
    }
  };

  useEffect(() => {
    if (!user) {
      // router.replace('/signin')
    }
  }, [router, user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex items-center space-x-2 text-amber-600 hover:text-amber-700">
          <ArrowLeft className="h-4 w-4" />
          <Link href="/signin">Back to Login Page</Link>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Create Store</CardTitle>
            <CardDescription>Follow the steps to get your store up and running</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Progress value={(step / 2) * 100} className="h-2" />

            {step === 1 && <Step1StoreInfo formik={formik} onNext={handleNextStep} />}

            {step === 2 && (
              <Step2StoreLocation
                formik={formik}
                onBack={() => setStep(1)}
                onNext={formik.handleSubmit}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
