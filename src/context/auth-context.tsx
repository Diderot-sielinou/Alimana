'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type User, type UserRole, ROLE_PERMISSIONS } from '@/lib/auth';
import { logout as serverLogout } from '@/lib/auth';
import * as Sentry from '@sentry/nextjs';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user from localStorage or API
    const loadUser = async () => {
      try {
        // This would typically be an API call
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          // Add permissions based on role
          userData.permissions = ROLE_PERMISSIONS[userData.role as UserRole] || [];
          setUser(userData);
        }
      } catch (error) {
        if (error) {
          Sentry.captureException(new Error('Error loading user'));
          return;
        }
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
    } catch (error) {
      if (error) {
        Sentry.captureException(new Error('Login error'));
        return;
      }
      throw error;
    }
  };

  async function logout() {
    try {
      await serverLogout(); // POST /api/auth/logout
    } catch (error) {
      if (error) {
        Sentry.captureException(new Error('Logout failed'));
        return;
      }
    } finally {
      localStorage.removeItem('access_token');
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
