'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { refreshToken, getUserProfile } from '@/lib/auth';

interface User {
  email: string;
  canCreateStore: boolean;
  // Add other user fields if needed
}

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  isAuthenticated: false,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initSession() {
      try {
        await refreshToken();

        // Explicitly type the result as User
        const profile = (await getUserProfile()) as User;
        setUser(profile);
      } catch (error) {
        console.error('Session init failed:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    initSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
