// src/app/signin/page.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Store, Eye, EyeOff } from 'lucide-react';
import { use2Auth } from '@/context/AuthContext';

const SignInSchema = Yup.object().shape({
  email: Yup.string().email('Email invalid').required('Email required'),
  password: Yup.string()
    .min(6, 'Password need to contain at least 6 character')
    .required('Password required'),
});

export default function SignInPage() {
  const { signin, isAuthenticated } = use2Auth();
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/select-store');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      await signin(values.email, values.password);
      router.push('/select-store');
    } catch {
      // L'erreur est déjà gérée dans le context
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Store className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">ShopManager</h1>
            <p className="text-gray-500 mt-2">Connect to your account</p>
          </div>

          <Formik
            initialValues={{ email: 'admin@shop.com', password: 'password' }}
            validationSchema={SignInSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <Field
                    as={Input}
                    name="email"
                    type="email"
                    placeholder="votre@email.com"
                    className={errors.email && touched.email ? 'border-red-500' : ''}
                  />
                  {errors.email && touched.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <Field
                      as={Input}
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className={
                        errors.password && touched.password ? 'border-red-500 pr-10' : 'pr-10'
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && touched.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? 'Connexion...' : 'Se connecter'}
                </Button>
              </Form>
            )}
          </Formik>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">Demo: admin@shop.com / password</p>
          </div>
        </div>
      </div>
    </div>
  );
}
