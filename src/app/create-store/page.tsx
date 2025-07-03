'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Step1StoreInfo from '@/components/steps/Step1StoreInfo';
import { Step2StoreLocation } from '@/components/steps/Step2StoreLocation';
import { Step3SecureAccount } from '@/components/steps/Step3SecureAccount';

interface StoreData {
  storeName: string;
  storeDescription: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  password: string;
  confirmPassword: string;
  updateFormData: string;
}

export default function CreateStorePage() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<StoreData>({
    storeName: '',
    storeDescription: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    password: '',
    confirmPassword: '',
    updateFormData: '',
  });
  const [errors, setErrors] = useState<Partial<StoreData>>({});

  const updateFormData = (field: keyof StoreData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Partial<StoreData> = {};

    if (currentStep === 1) {
      if (!formData.storeName.trim()) newErrors.storeName = 'Store name is required';
      if (!formData.storeDescription.trim())
        newErrors.storeDescription = 'Store description is required';
    } else if (currentStep === 2) {
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.state.trim()) newErrors.state = 'State is required';
      if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    } else if (currentStep === 3) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    try {
      const pendingUser = localStorage.getItem('pendingUser');
      const userData = pendingUser ? JSON.parse(pendingUser) : null;

      const storeId = `store_${Date.now()}`;
      const adminId = `admin_${Date.now()}`;

      const storeData = {
        ...formData,
        owner: userData,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem('userStore', JSON.stringify(storeData));
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: adminId,
          email: userData?.email,
          fullName: `${userData?.firstName} ${userData?.lastName}`.trim(),
          role: 'admin',
          storeId,
          storeName: formData.storeName,
          isActive: true,
        })
      );

      localStorage.removeItem('pendingUser');

      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Error creating store:', error);
    }
  };

  const progress = (step / 3) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            href="/signin"
            className="inline-flex items-center space-x-2 text-amber-600 hover:text-amber-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to sign in</span>
          </Link>

          <h1 className="text-2xl font-bold text-gray-900">Create Your Store</h1>
          <p className="text-gray-600 mt-2">Step {step} of 3</p>
        </div>

        <div className="mb-8">
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">
              {step === 1 && 'Store Information'}
              {step === 2 && 'Store Location'}
              {step === 3 && 'Secure Your Account'}
            </CardTitle>
            <CardDescription>
              {step === 1 && 'Tell us about your store'}
              {step === 2 && 'Where is your store located?'}
              {step === 3 && 'Create a password to secure your store'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {step === 1 && (
              <Step1StoreInfo
                formData={formData}
                errors={errors}
                updateFormData={updateFormData}
                onNext={handleNext}
              />
            )}

            {step === 2 && (
              <Step2StoreLocation
                formData={formData}
                errors={errors}
                updateFormData={updateFormData}
                onBack={handleBack}
                onNext={handleNext}
              />
            )}

            {step === 3 && (
              <Step3SecureAccount
                formData={formData}
                errors={errors}
                updateFormData={updateFormData}
                onBack={handleBack}
                onSubmit={handleSubmit}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                showConfirmPassword={showConfirmPassword}
                setShowConfirmPassword={setShowConfirmPassword}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
