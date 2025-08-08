// /* eslint-disable @typescript-eslint/no-explicit-any */
// // src/app/accept-invite/page.tsx
// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { useForm } from 'react-hook-form';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { toast } from 'react-hot-toast';
// import Joi from 'joi';
// import { api } from '@/lib/api';

// // Joi validation schema for the invitation acceptance form
// const acceptInviteSchema = Joi.object({
//   password: Joi.string().min(6).required().messages({
//     'string.min': 'Password must be at least {#limit} characters.',
//     'string.empty': 'Password is required.',
//     'any.required': 'Password is required.',
//   }),
//   confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
//     'any.only': 'Passwords do not match.',
//     'string.empty': 'Password confirmation is required.',
//     'any.required': 'Password confirmation is required.',
//   }),
// });

// /**
//  * Invitation acceptance page.
//  * Allows an invited user to set their password and join a store.
//  */
// export default function AcceptInvitePage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [loading, setLoading] = useState(false);
//   const [invitationValid, setInvitationValid] = useState(true);
//   const [invitationDetails, setInvitationDetails] = useState<any>(null);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     setError,
//   } = useForm();

//   // Checks the validity of the invitation token when the page loads
//   useEffect(() => {
//     const token = searchParams.get('token');

//     const verifyInvitation = async () => {
//       try {
//         const response = await api.get(`/auth/invitations/verify?token=${token}`);
//         setInvitationDetails(response.data);
//         setInvitationValid(true);
//       } catch (error: any) {
//         console.error('Invitation verification error:', error);
//         toast.error(error.response?.data?.message || 'Invalid or expired invitation token.');
//         router.replace('/signin');
//       } finally {
//         setLoading(false);
//       }
//     };

//     verifyInvitation();
//   }, [searchParams, router]);

//   // Handles the form submission to accept the invitation
//   const onSubmit = async (data: any) => {
//     // --- Manual validation with Joi ---
//     const { error } = acceptInviteSchema.validate(data, { abortEarly: false });

//     if (error) {
//       // Map Joi errors to React Hook Form
//       error.details.forEach((detail) => {
//         setError(detail.path[0] as string, {
//           type: 'manual',
//           message: detail.message,
//         });
//       });
//       return; // Stop submission if validation fails
//     }
//     // --- End of manual validation ---

//     const token = searchParams.get('token');
//     if (!token) {
//       toast.error('Invitation token is missing.');
//       return;
//     }

//     try {
//       await api.post('/auth/invitations/accept', {
//         token: token,
//         password: data.password,
//       });
//       toast.success('Invitation accepted! You can now log in.');
//       router.replace('/login'); // Redirects to login page
//     } catch (error: any) {
//       console.error('Error while accepting the invitation:', error);
//       toast.error(error.response?.data?.message || 'Failed to accept the invitation.');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-100">
//         <p className="text-lg text-gray-700">Verifying invitation...</p>
//       </div>
//     );
//   }

//   if (!invitationValid) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-red-50 p-4">
//         <div className="text-center p-8 bg-white rounded-xl shadow-2xl border border-red-200">
//           <h1 className="text-3xl font-bold text-red-700 mb-4">Invalid Invitation</h1>
//           <p className="text-gray-600">The invitation link is invalid or has expired.</p>
//           <Button
//             onClick={() => router.replace('/')}
//             className="mt-6 bg-slate-900 hover:bg-slate-800"
//           >
//             Back to landing page
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
//       <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border border-gray-200">
//         <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-6">
//           Accept Invitation
//         </h1>
//         {invitationDetails && (
//           <p className="text-center text-gray-700 mb-6">
//             You have been invited to join the store{' '}
//             <span className="font-semibold text-blue-600">{invitationDetails.storeName}</span> as a{' '}
//             <span className="font-semibold text-blue-600">{invitationDetails.roleName}</span>.
//             <br />
//             Your email: <span className="font-semibold">{invitationDetails.email}</span>
//           </p>
//         )}

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//           <div>
//             <Label htmlFor="password">New Password</Label>
//             <Input
//               id="password"
//               type="password"
//               placeholder="••••••••"
//               {...register('password')}
//               className="w-full"
//             />
//             {errors.password && (
//               <p className="text-red-500 text-sm mt-1">{errors.password.message as string}</p>
//             )}
//           </div>

//           <div>
//             <Label htmlFor="confirmPassword">Confirm Password</Label>
//             <Input
//               id="confirmPassword"
//               type="password"
//               placeholder="••••••••"
//               {...register('confirmPassword')}
//               className="w-full"
//             />
//             {errors.confirmPassword && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.confirmPassword.message as string}
//               </p>
//             )}
//           </div>

//           <Button
//             type="submit"
//             className="w-full py-3 text-lg bg-slate-900 hover:bg-slate-800"
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? 'Submitting...' : 'Accept Invitation'}
//           </Button>
//         </form>
//       </div>
//     </div>
//   );
// }
