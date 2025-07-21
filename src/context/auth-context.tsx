// context/auth-context.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { refreshToken, getUserProfile } from '@/lib/auth';

interface User {
  email: string;
  canCreateStore: boolean;
}

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  logout: () => void; // ✅ Add logout to the context
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  isAuthenticated: false,
  loading: true,
  logout: () => {},
});

/**
 * Provides authentication context and state management to its child components.
 *
 * Initializes the user session on mount, manages authentication state, and exposes authentication data and actions through context.
 *
 * @param children - The React components that will have access to the authentication context.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initSession() {
      try {
        await refreshToken();
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

  // ✅ Logout function
  function logout() {
    localStorage.removeItem('access_token');
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        logout, // ✅ expose logout in context
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
