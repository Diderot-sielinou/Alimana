// 'use client';

// import { createContext, useContext, useState, useEffect } from 'react';
// import { Role } from '@/types/role';
// import axios from 'axios';

// interface RoleContextType {
//   roles: Role[];
//   fetchRoles: (storeId: number) => Promise<void>;
//   getRoleById: (storeId: number, id: number) => Promise<Role | null>;
//   createRole: (storeId: number, data: Partial<Role>) => Promise<void>;
//   updateRole: (storeId: number, id: number, data: Partial<Role>) => Promise<void>;
//   updateRolePermissions: (storeId: number, id: number, permissionIds: number[]) => Promise<void>;
//   deleteRole: (storeId: number, id: number) => Promise<void>;
//   loading: boolean;
//   error: string | null;
// }

// const RoleContext = createContext<RoleContextType | undefined>(undefined);

// export const useRoleContext = () => {
//   const context = useContext(RoleContext);
//   if (!context) {
//     throw new Error('useRoleContext must be used within a RoleProvider');
//   }
//   return context;
// };

// export const RoleProvider = ({ children }: { children: React.ReactNode }) => {
//   const [roles, setRoles] = useState<Role[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchRoles = async (storeId: number) => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`/store/${storeId}/roles`);
//       setRoles(res.data);
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getRoleById = async (storeId: number, id: number): Promise<Role | null> => {
//     try {
//       const res = await axios.get(`/store/${storeId}/roles/${id}`);
//       return res.data;
//     } catch (err) {
//       setError('Role not found');
//       return null;
//     }
//   };

//   const createRole = async (storeId: number, data: Partial<Role>) => {
//     try {
//       const res = await axios.post(`/store/${storeId}/roles`, data);
//       setRoles(prev => [...prev, res.data]);
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   const updateRole = async (storeId: number, id: number, data: Partial<Role>) => {
//     try {
//       const res = await axios.patch(`/store/${storeId}/roles/${id}`, data);
//       setRoles(prev => prev.map(role => (role.id === id ? res.data : role)));
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   const updateRolePermissions = async (storeId: number, id: number, permissionIds: number[]) => {
//     try {
//       await axios.patch(`/store/${storeId}/roles/${id}/permissions`, { permissionIds });
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   const deleteRole = async (storeId: number, id: number) => {
//     try {
//       await axios.delete(`/store/${storeId}/roles/${id}`);
//       setRoles(prev => prev.filter(role => role.id !== id));
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   return (
//     <RoleContext.Provider
//       value={{
//         roles,
//         fetchRoles,
//         getRoleById,
//         createRole,
//         updateRole,
//         updateRolePermissions,
//         deleteRole,
//         loading,
//         error,
//       }}
//     >
//       {children}
//     </RoleContext.Provider>
//   );
// };
