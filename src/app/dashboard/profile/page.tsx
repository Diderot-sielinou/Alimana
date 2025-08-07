'use client';

import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
// import { Separator } from '@/components/ui/separator';
import { User, Mail, Phone, Camera, Shield, Calendar, Edit, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/auth-context';
import { AuthProvider } from '@/types/store.interface';

// Types
interface UserProfileData {
  fullName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
}

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Validation schemas
const profileSchema = Yup.object({
  fullName: Yup.string().required('Full name is required'),
  email: Yup.string().email('Invalid Email').required('Email required'),
  phone: Yup.string(),
});

const passwordSchema = Yup.object({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords do not match')
    .required('Please confirm new password'),
});

export default function ProfilePage() {
  const { ProfileUser, updateProfile, changePassword } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  if (!ProfileUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  const handleProfileUpdate = async (values: UserProfileData) => {
    try {
      await updateProfile(values);
      toast.success('Profile updated successfully');
      setIsEditingProfile(false);
    } catch (error) {
      const err = error as Error;
      toast.error(`Error updating profile: ${err.message}`);
    }
  };

  const handlePasswordChange = async (values: PasswordChangeData) => {
    try {
      await changePassword(values.currentPassword, values.newPassword);
      toast.success('Password changed successfully');
      setIsChangingPassword(false);
    } catch (error) {
      const err = error as Error;
      toast.error(`Error changing password: ${err.message}`);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/upload/image?folder=avatars`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Upload error');
      }

      const data = await response.json();
      await updateProfile({ avatarUrl: data.url });
      toast.success('Profile picture updated');
    } catch (error) {
      console.error('Error occurred while uploading avatar:', error);
      toast.error('Error uploading image');
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-EN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 md:ml-64 px-6 py-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile </h1>
            <p className="text-gray-500">Manage your personal information and preferences</p>
          </div>
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal information{' '}
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditingProfile(!isEditingProfile)}
              >
                {isEditingProfile ? (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    cancel
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={ProfileUser.avatarUrl} alt={ProfileUser.fullName} />
                    <AvatarFallback className="text-lg font-semibold">
                      {getUserInitials(ProfileUser.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <label className="absolute bottom-0 right-0 bg-orange-500 hover:bg-orange-600 text-white rounded-full p-2 cursor-pointer shadow-lg transition-colors">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleAvatarUpload(file);
                      }}
                    />
                  </label>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">{ProfileUser.fullName}</h3>
                  <Badge variant="secondary" className="mt-1">
                    {ProfileUser.authProvider === 'local'
                      ? 'Local Account'
                      : ProfileUser.authProvider}
                  </Badge>
                </div>
              </div>

              {/* Profile Form */}
              <div className="flex-1">
                {isEditingProfile ? (
                  <Formik
                    initialValues={{
                      fullName: ProfileUser.fullName,
                      email: ProfileUser.email,
                      phone: ProfileUser.phone || '',
                    }}
                    validationSchema={profileSchema}
                    onSubmit={handleProfileUpdate}
                  >
                    {({ isSubmitting }) => (
                      <Form className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="fullName">Full Name</Label>
                            <Field as={Input} id="fullName" name="fullName" />
                            <ErrorMessage
                              name="fullName"
                              component="div"
                              className="text-red-500 text-sm mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Field as={Input} id="email" name="email" type="email" />
                            <ErrorMessage
                              name="email"
                              component="div"
                              className="text-red-500 text-sm mt-1"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="phone">Telephone</Label>
                          <Field as={Input} id="phone" name="phone" />
                          <ErrorMessage
                            name="phone"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-slate-900 hover:bg-slate-800"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            {isSubmitting ? 'Creating...' : 'Create'}
                          </Button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{ProfileUser.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">phone</p>
                          <p className="font-medium">{ProfileUser.phone || 'Not Registered'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Member since</p>
                        <p className="font-medium">{formatDate(ProfileUser.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Store Information */}
        {/* <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="w-5 h-5" />
              Mes boutiques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ProfileUser.stores.map((store) => (
                <div
                  key={store.id}
                  className={`p-4 border rounded-lg ${
                    storeInfo?.id === store.id
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{store.name}</h3>
                      <p className="text-sm text-gray-500">{store.description}</p>
                      {store.address && (
                        <p className="text-sm text-gray-400 mt-1">{store.address}</p>
                      )}
                    </div>
                    {storeInfo?.id === store.id && (
                      <Badge className="bg-orange-500">Boutique active</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>  */}

        {/* Security Settings */}
        {ProfileUser.authProvider === AuthProvider.LOCAL && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsChangingPassword(!isChangingPassword)}
                >
                  {isChangingPassword ? (
                    <>
                      <X className="w-4 h-4 mr-2" />
                      cancel
                    </>
                  ) : (
                    'Change password'
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isChangingPassword ? (
                <Formik
                  initialValues={{
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                  }}
                  validationSchema={passwordSchema}
                  onSubmit={handlePasswordChange}
                >
                  {({ isSubmitting }) => (
                    <Form className="space-y-4">
                      <div>
                        <Label htmlFor="currentPassword">Current password</Label>
                        <Field
                          as={Input}
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                        />
                        <ErrorMessage
                          name="currentPassword"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="newPassword">New Password</Label>
                          <Field as={Input} id="newPassword" name="newPassword" type="password" />
                          <ErrorMessage
                            name="newPassword"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="confirmPassword">Confirm password</Label>
                          <Field
                            as={Input}
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                          />
                          <ErrorMessage
                            name="confirmPassword"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>
                      </div>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-slate-900 hover:bg-slate-800"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {isSubmitting ? 'Updating...' : 'Change Password'}
                      </Button>
                    </Form>
                  )}
                </Formik>
              ) : (
                <div className="text-center py-8">
                  <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Your password is secure. Click Change Password to change it.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
