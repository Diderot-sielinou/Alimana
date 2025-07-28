// 'use client';

// import { useState } from 'react';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// const roles = [
//   { value: 'Owner', label: 'Propriétaire' },
//   { value: 'Manager', label: 'Manager' },
//   { value: 'Caissier', label: 'Caissier' },
//   { value: 'Stock Manager', label: 'Gestionnaire de Stock' },
// ];

// export default function Header() {
//   const [userRole, setUserRole] = useState('Owner');

//   return (
//     <header className="flex justify-between items-center px-6 py-4 bg-white border-b shadow-sm">
//       <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
//       <div className="flex items-center space-x-4">
//         <span className="text-sm">
//           Rôle: <strong>{userRole}</strong>
//         </span>
//         <Select onValueChange={setUserRole} defaultValue={userRole}>
//           <SelectTrigger className="w-[180px]">
//             <SelectValue placeholder="Changer de rôle" />
//           </SelectTrigger>
//           <SelectContent>
//             {roles.map((role) => (
//               <SelectItem key={role.value} value={role.value}>
//                 {role.label}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>
//     </header>
//   );
// }

// src/components/layout/Header.tsx
'use client';

import React from 'react';
import { Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';

export const Header: React.FC = () => {
  const { user, storeContext } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {storeContext?.roleName}
          </h1>
          <p className="text-sm text-gray-500">
            {new Date().toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Bell className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center space-x-3 pl-4 border-l">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-900">
                {user?.fullName} {user?.canCreateStore}
              </p>
              <p className="text-gray-500">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};