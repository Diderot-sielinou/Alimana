'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useFormik } from 'formik';
import { loginValidationSchema } from '@/schema/validation-schema';
import { useAuth } from '@/context/auth-context';
import { cn } from '@/lib/utils';

// =============================================================================
// TYPES
// =============================================================================
interface SigninFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

// =============================================================================
// GOOGLE ICON COMPONENT
// =============================================================================
const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 48 48">
    <path
      fill="#FFC107"
      d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-9 20-20 0-1.3-.1-2.6-.4-3.9z"
    />
    <path
      fill="#FF3D00"
      d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.1 34.6 26.6 36 24 36c-5.2 0-9.6-3.3-11.3-7.9L6.2 33.1C9.5 39.6 16.2 44 24 44z"
    />
    <path
      fill="#1976D2"
      d="M43.6 20.1H42V20H24v8h11.3c-1.1 3.1-3.6 5.8-6.5 7.5l6.2 5.2C39 37.2 44 31.3 44 24c0-1.3-.1-2.6-.4-3.9z"
    />
  </svg>
);

// =============================================================================
// ERROR MESSAGES MAP
// =============================================================================
const ERROR_MESSAGES: Record<string, string> = {
  missing_tokens: 'Authentication failed. Please try again.',
  callback_failed: 'An error occurred during login. Please try again.',
  session_expired: 'Your session has expired. Please log in again.',
  unauthorized: 'Invalid credentials. Please check your email and password.',
};

// =============================================================================
// COMPONENT
// =============================================================================
export default function SigninPage() {
  const { login, registerWithGoogle, isAuthenticated, isLoading } = useAuth();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for error in URL params
  useEffect(() => {
    const urlError = searchParams.get('error');
    if (urlError) {
      setError(ERROR_MESSAGES[urlError] || 'An error occurred. Please try again.');
    }
  }, [searchParams]);

  const formik = useFormik<SigninFormData>({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setError(null);
      try {
        await login({ email: values.email, password: values.password });
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Login failed. Please check your credentials.');
        }
      } finally {
        setSubmitting(false);
      }
    },
    validateOnBlur: true,
    validateOnChange: false,
  });

  const handleGoogleLogin = () => {
    setError(null);
    registerWithGoogle();
  };

  // Don't render form if already authenticated
  if (isAuthenticated && !isLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-amber-600 transition-colors mb-6 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to home</span>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Welcome Back</h1>
          <p className="text-slate-500 mt-2">Sign in to continue to your dashboard</p>
        </div>

        {/* Card */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl text-slate-800">Sign In</CardTitle>
            <CardDescription className="text-slate-500">
              Choose your preferred method
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-4">
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Google Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 bg-white hover:bg-slate-50 border-slate-200 text-slate-700 font-medium transition-all hover:border-slate-300 hover:shadow-sm"
              onClick={handleGoogleLogin}
            >
              <GoogleIcon />
              <span className="ml-3">Continue with Google</span>
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-slate-400 font-medium">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={formik.handleSubmit} className="space-y-5" noValidate>
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={cn(
                      'pl-10 h-11 bg-white border-slate-200 focus:border-amber-500 focus:ring-amber-500/20',
                      formik.touched.email && formik.errors.email && 'border-red-400'
                    )}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {formik.errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className={cn(
                      'pl-10 pr-10 h-11 bg-white border-slate-200 focus:border-amber-500 focus:ring-amber-500/20',
                      formik.touched.password && formik.errors.password && 'border-red-400'
                    )}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {formik.errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="rememberMe"
                    checked={formik.values.rememberMe}
                    onCheckedChange={(checked) =>
                      formik.setFieldValue('rememberMe', Boolean(checked))
                    }
                    className="border-slate-300 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                  />
                  <Label htmlFor="rememberMe" className="text-sm text-slate-600 cursor-pointer">
                    Remember me
                  </Label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-11 bg-amber-600 hover:bg-amber-700 text-white font-medium shadow-lg shadow-amber-600/20 transition-all hover:shadow-xl hover:shadow-amber-600/30"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Signing In...
                  </span>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-slate-600">
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="text-amber-600 hover:text-amber-700 font-semibold transition-colors"
              >
                Create account
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-6">
          By signing in, you agree to our{' '}
          <Link href="/terms" className="underline hover:text-slate-600">
            Terms
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline hover:text-slate-600">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
