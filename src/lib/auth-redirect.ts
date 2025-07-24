type Store = {
  id: string;
  name: string;
};

type User = {
  role: string;
  stores?: Store[];
};

export function getRedirectPath(user: User): string {
  if (!user.stores || user.stores.length === 0) {
    return '/create-store';
  }

  if (user.role === 'cashier') {
    return '/sales/create';
  }

  if (user.stores.length === 1) {
    return '/dashboard';
  }

  return '/select-store';
}
