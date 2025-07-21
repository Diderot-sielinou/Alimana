// hooks/useUser.ts
import { useEffect, useState } from 'react';

interface User {
  role: string;
  name: string;
  storeId: string;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/api/auth/profile', { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(error);
          setUser(null);
        }
      })
      .finally(() => setIsLoading(false));
    return () => controller.abort();
  }, []);

  return { user, isLoading };
}
