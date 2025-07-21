// hooks/useUser.ts
import { useEffect, useState } from 'react';

/**
 * React hook that manages user authentication state and loading status.
 *
 * Fetches the current user's profile from `/api/auth/profile` on mount, updating the `user` state with the result or `null` on error. Returns the user object (with a `role` property) or `null`, along with a loading indicator. Designed for reuse in components that need to access authentication status or user role.
 *
 * @returns An object containing the current `user` (with a `role` or `null`) and `isLoading` (boolean) status.
 */
export function useUser() {
  const [user, setUser] = useState<{ role: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/profile')
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  return { user, isLoading };
}
