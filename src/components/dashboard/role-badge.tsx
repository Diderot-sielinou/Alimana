import { Badge } from '@/components/ui/badge';
import { UserRole, getRoleDisplayName } from '@/lib/auth';

interface RoleBadgeProps {
  role: UserRole;
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const getVariant = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'default' as const;
      case UserRole.STORE_MANAGER:
        return 'secondary' as const;
      case UserRole.SALESPERSON:
        return 'outline' as const;
      case UserRole.CASHIER:
        return 'outline' as const;
      default:
        return 'outline' as const;
    }
  };

  return (
    <Badge variant={getVariant(role)} className={className}>
      {getRoleDisplayName(role)}
    </Badge>
  );
}
