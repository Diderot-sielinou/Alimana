'use client';

import type React from 'react';
import { useFormik } from 'formik';
import Link from 'next/link';
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { signUp, signUpWithGoogle } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { registerValidationSchema } from '@/schema/validation-schema';

interface SignupValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  acceptTerms: boolean;
}

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const formik = useFormik<SignupValues>({
    initialValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      acceptTerms: false,
    },
    validationSchema: registerValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setGeneralError(null);
      try {
        await signUp({
          fullName: values.fullName,
          email: values.email,
          password: values.password,
          phone: '+237' + values.phone.replace(/^(\+237)?/, ''),
        });
        router.push('/create-store');
      } catch (error) {
        if (error instanceof Error) {
          setGeneralError(error.message);
        } else {
          setGeneralError('Signup failed. Please try again.');
        }
      } finally {
        setSubmitting(false);
      }
    },
    validateOnBlur: false,
    validateOnChange: false,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-amber-600 hover:text-amber-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to home</span>
          </Link>
        </div>

        <Card className="shadow-xl border-0 dark:bg-white text-gray-800">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">Sign Up</CardTitle>
            <CardDescription>Create your account to get started with Alimana</CardDescription>
            <Button
              variant="outline"
              onClick={signUpWithGoogle}
              className="w-full bg-transparent dark:hover:bg-slate-200 dark:text-slate-900"
            >
              <svg height="20" width="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                  fill="#FFC107"
                />
                <path
                  d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"
                  fill="#FF3D00"
                />
                <path
                  d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
                  fill="#4CAF50"
                />
                <path
                  d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
                  fill="#1976D2"
                />
              </svg>
              <span className="ml-2">Continue with Google</span>
            </Button>
            <div className="relative mt-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={formik.handleSubmit} className="space-y-6" noValidate>
              {generalError && <p className="text-sm text-red-600 text-center">{generalError}</p>}

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    className="pl-10"
                    value={formik.values.fullName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    aria-invalid={!!(formik.touched.fullName && formik.errors.fullName)}
                    aria-describedby="fullName-error"
                  />
                </div>
                {formik.touched.fullName && formik.errors.fullName && (
                  <p id="fullName-error" className="text-sm text-red-600">
                    {formik.errors.fullName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    aria-invalid={!!(formik.touched.email && formik.errors.email)}
                    aria-describedby="email-error"
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <p id="email-error" className="text-sm text-red-600">
                    {formik.errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone (Optional)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+237..."
                    className="pl-10"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    aria-invalid={!!(formik.touched.phone && formik.errors.phone)}
                    aria-describedby="phone-error"
                  />
                </div>
                {formik.touched.phone && formik.errors.phone && (
                  <p id="phone-error" className="text-sm text-red-600">
                    {formik.errors.phone}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    className="pl-10 pr-10"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    aria-invalid={!!(formik.touched.password && formik.errors.password)}
                    aria-describedby="password-error"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <p id="password-error" className="text-sm text-red-600">
                    {formik.errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    className="pl-10 pr-10"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    aria-invalid={
                      !!(formik.touched.confirmPassword && formik.errors.confirmPassword)
                    }
                    aria-describedby="confirmPassword-error"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <p id="confirmPassword-error" className="text-sm text-red-600">
                    {formik.errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Accept Terms */}
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="acceptTerms"
                    name="acceptTerms"
                    checked={formik.values.acceptTerms}
                    onCheckedChange={(checked) => formik.setFieldValue('acceptTerms', checked)}
                    onBlur={formik.handleBlur}
                    className="mt-1"
                    aria-invalid={!!(formik.touched.acceptTerms && formik.errors.acceptTerms)}
                    aria-describedby="acceptTerms-error"
                  />
                  <Label htmlFor="acceptTerms" className="text-sm text-gray-600 leading-relaxed">
                    I agree to the{' '}
                    <Link href="/terms" className="text-amber-600 hover:text-amber-700 underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-amber-600 hover:text-amber-700 underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
                {formik.touched.acceptTerms && formik.errors.acceptTerms && (
                  <p id="acceptTerms-error" className="text-sm text-red-600">
                    {formik.errors.acceptTerms}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700 dark:bg-amber text-white"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/signin" className="text-amber-600 hover:text-amber-700 font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
