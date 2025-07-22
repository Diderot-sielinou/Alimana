'use client';

import type { ReactNode } from 'react';
import { useAuth } from '@/context/auth-context';
import { hasPermission, hasAnyPermission } from '@/lib/auth';
import type { Permission } from '@/lib/auth';

interface PermissionGuardProps {
  children: ReactNode;
  permission?: Permission;
  permissions?: Permission[];
  fallback?: ReactNode;
  requireAll?: boolean;
}

export function PermissionGuard({
  children,
  permission,
  permissions = [],
  fallback = null,
  requireAll = false,
}: PermissionGuardProps) {
  const { user } = useAuth();

  if (!user) return <>{fallback}</>;

  let hasAccess = false;

  if (permission) {
    hasAccess = hasPermission(user, permission);
  } else if (permissions.length > 0) {
    if (requireAll) {
      hasAccess = permissions.every((p) => hasPermission(user, p));
    } else {
      hasAccess = hasAnyPermission(user, permissions);
    }
  } else {
    hasAccess = true;
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}
