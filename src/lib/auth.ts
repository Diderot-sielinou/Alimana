import toast from 'react-hot-toast';
import { api } from './api';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  storeId: string;
  name: string;
  isActive: boolean;
  permissions: Permission[];
}

export enum UserRole {
  ADMIN = 'admin',
  STORE_MANAGER = 'store_manager',
  SALESPERSON = 'salesperson',
  CASHIER = 'cashier',
}

export enum Permission {
  // User Management
  MANAGE_USERS = 'manage_users',
  INVITE_USERS = 'invite_users',
  VIEW_USERS = 'view_users',

  // Product Management
  MANAGE_PRODUCTS = 'manage_products',
  ADD_PRODUCTS = 'add_products',
  EDIT_PRODUCTS = 'edit_products',
  DELETE_PRODUCTS = 'delete_products',
  VIEW_PRODUCTS = 'view_products',

  // Inventory Management
  MANAGE_INVENTORY = 'manage_inventory',
  VIEW_INVENTORY = 'view_inventory',
  UPDATE_STOCK = 'update_stock',

  // Sales & Orders
  MANAGE_ORDERS = 'manage_orders',
  VIEW_ORDERS = 'view_orders',
  PROCESS_ORDERS = 'process_orders',
  CANCEL_ORDERS = 'cancel_orders',

  // Sales Management
  MAKE_SALES = 'make_sales',
  VIEW_SALES = 'view_sales',
  MANAGE_SALES = 'manage_sales',

  // Analytics & Reports
  VIEW_ANALYTICS = 'view_analytics',
  VIEW_REPORTS = 'view_reports',
  EXPORT_DATA = 'export_data',

  // Store Settings
  MANAGE_STORE_SETTINGS = 'manage_store_settings',
  VIEW_STORE_SETTINGS = 'view_store_settings',
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    // Full access to everything
    Permission.MANAGE_USERS,
    Permission.INVITE_USERS,
    Permission.VIEW_USERS,
    Permission.MANAGE_PRODUCTS,
    Permission.ADD_PRODUCTS,
    Permission.EDIT_PRODUCTS,
    Permission.DELETE_PRODUCTS,
    Permission.VIEW_PRODUCTS,
    Permission.MANAGE_INVENTORY,
    Permission.VIEW_INVENTORY,
    Permission.UPDATE_STOCK,
    Permission.MANAGE_ORDERS,
    Permission.VIEW_ORDERS,
    Permission.PROCESS_ORDERS,
    Permission.CANCEL_ORDERS,
    Permission.MAKE_SALES,
    Permission.VIEW_SALES,
    Permission.MANAGE_SALES,
    Permission.VIEW_ANALYTICS,
    Permission.VIEW_REPORTS,
    Permission.EXPORT_DATA,
    Permission.MANAGE_STORE_SETTINGS,
    Permission.VIEW_STORE_SETTINGS,
  ],
  [UserRole.STORE_MANAGER]: [
    Permission.VIEW_USERS,
    Permission.MANAGE_PRODUCTS,
    Permission.ADD_PRODUCTS,
    Permission.EDIT_PRODUCTS,
    Permission.VIEW_PRODUCTS,
    Permission.MANAGE_INVENTORY,
    Permission.VIEW_INVENTORY,
    Permission.UPDATE_STOCK,
    Permission.MANAGE_ORDERS,
    Permission.VIEW_ORDERS,
    Permission.PROCESS_ORDERS,
    Permission.CANCEL_ORDERS,
    Permission.VIEW_SALES,
    Permission.MANAGE_SALES,
    Permission.VIEW_ANALYTICS,
    Permission.VIEW_REPORTS,
    Permission.VIEW_STORE_SETTINGS,
  ],
  [UserRole.SALESPERSON]: [
    Permission.VIEW_PRODUCTS,
    Permission.VIEW_INVENTORY,
    Permission.VIEW_ORDERS,
    Permission.PROCESS_ORDERS,
    Permission.MAKE_SALES,
    Permission.VIEW_SALES,
  ],
  [UserRole.CASHIER]: [
    Permission.VIEW_PRODUCTS,
    Permission.VIEW_ORDERS,
    Permission.PROCESS_ORDERS,
    Permission.MAKE_SALES,
  ],
};

export const getRoleDisplayName = (role: UserRole): string => {
  const roleNames = {
    [UserRole.ADMIN]: 'Administrator',
    [UserRole.STORE_MANAGER]: 'Store Manager',
    [UserRole.SALESPERSON]: 'Salesperson',
    [UserRole.CASHIER]: 'Cashier',
  };
  return roleNames[role];
};

export const hasPermission = (user: User, permission: Permission): boolean => {
  return user.permissions.includes(permission);
};

export const hasAnyPermission = (user: User, permissions: Permission[]): boolean => {
  return permissions.some((permission) => user.permissions.includes(permission));
};

// 📝 Register new user
export async function signUp(data: {
  fullName: string;
  phone?: string;
  email: string;
  password?: string;
  avatar?: string;
  authProvider?: string;
  provider?: string;
  isActive?: boolean;
  canCreateStore?: boolean;
}) {
  return api.post('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });
}

export function signUpWithGoogle() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  window.location.href = `${API_BASE_URL}/api/auth/google`;
}
// 'use client';
// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/contexts/AuthContext';

// export default function GoogleCallbackPage() {
//   const { fetchMe } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     const handleAuth = async () => {
//       try {
//         await fetchMe(); // 👈 recharge l’état
//         router.push('/select-store');
//       } catch (e) {
//         router.push('/signin');
//       }
//     };

//     handleAuth();
//   }, [fetchMe, router]);

//   return <div>Connexion en cours...</div>;
// }

// await api.post('/auth/register', values);
// await fetchMe(); // 👈 ici aussi
// router.push('/select-store');
// 'use client';

// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/contexts/AuthContext'; // Assure-toi que ce chemin est correct
// import { api } from '@/lib/api';
// import { toast } from 'react-hot-toast';

// interface RegisterData {
//   fullName: string;
//   email: string;
//   password: string;
// }

interface SignupValues {
  fullName: string;
  email: string;
  password: string;
  phone: string;
}

export const register = async (data: SignupValues) => {
  try {
    await api.post('/auth/register', data);
    toast.success('Account created successfully');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    toast.error(error.response?.data?.error || 'Error during registration');
    throw error;
  }
};

// 'use client';

// import { useFormik } from 'formik';
// import * as Yup from 'yup';
// import { useRegister } from '@/hooks/useRegister';

// export default function SignupPage() {
//   const { register } = useRegister();

//   const formik = useFormik({
//     initialValues: {
//       fullName: '',
//       email: '',
//       password: '',
//     },
//     validationSchema: Yup.object({
//       fullName: Yup.string().required('Nom requis'),
//       email: Yup.string().email('Email invalide').required('Email requis'),
//       password: Yup.string().min(6, 'Min. 6 caractères').required('Mot de passe requis'),
//     }),
//     onSubmit: async (values) => {
//       await register(values);
//     },
//   });

//   return (
//     <form onSubmit={formik.handleSubmit} className="space-y-4 max-w-md mx-auto">
//       <input
//         name="fullName"
//         placeholder="Nom complet"
//         onChange={formik.handleChange}
//         value={formik.values.fullName}
//         className="border p-2 w-full rounded"
//       />
//       <input
//         name="email"
//         placeholder="Email"
//         onChange={formik.handleChange}
//         value={formik.values.email}
//         className="border p-2 w-full rounded"
//       />
//       <input
//         type="password"
//         name="password"
//         placeholder="Mot de passe"
//         onChange={formik.handleChange}
//         value={formik.values.password}
//         className="border p-2 w-full rounded"
//       />
//       <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded">
//         Créer un compte
//       </button>
//     </form>
//   );
// }
