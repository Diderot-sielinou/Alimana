'use client';

import { useAuth } from '@/context/auth-context';
import { ReactNode } from 'react';

type CanProps = {
  permission: string | string[];
  mode?: 'any' | 'all'; // any = au moins une, all = toutes requises
  children: ReactNode;
};

export default function Can({ permission, mode = 'any', children }: CanProps) {
  const { hasPermission } = useAuth();

  const permissions = Array.isArray(permission) ? permission : [permission];

  const isAllowed =
    mode === 'all'
      ? permissions.every((p) => hasPermission(p))
      : permissions.some((p) => hasPermission(p));

  if (!isAllowed) return null;

  return <>{children}</>;
}
