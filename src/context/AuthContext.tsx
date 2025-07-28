// src/contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, Store, AuthState } from '@/types/auth';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

interface AuthContextType extends AuthState {
  signin: (email: string, password: string) => Promise<void>;
  signout: () => void;
  selectStore: (store: Store) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_STORE'; payload: Store | null }
  | { type: 'SIGN_OUT' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: !!action.payload,
        isLoading: false 
      };
    case 'SET_STORE':
      return { ...state, currentStore: action.payload };
    case 'SIGN_OUT':
      return { 
        user: null, 
        currentStore: null, 
        isAuthenticated: false, 
        isLoading: false 
      };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  currentStore: null,
  isAuthenticated: false,
  isLoading: true,
};

export const AuthProvider2: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check for existing auth on mount
    const token = localStorage.getItem('authToken');
    const storeData = localStorage.getItem('currentStore');
    
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      refreshUser();
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }

    if (storeData) {
      dispatch({ type: 'SET_STORE', payload: JSON.parse(storeData) });
    }
  }, []);

  const signin = async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await api.post('/auth/signin', { email, password });
      const { user, token } = response.data;
      
      localStorage.setItem('authToken', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      dispatch({ type: 'SET_USER', payload: user });
      toast.success('Connexion réussie');
    } catch (error: any) {
      dispatch({ type: 'SET_LOADING', payload: false });
      toast.error(error.response?.data?.message || 'Erreur de connexion');
      throw error;
    }
  };

  const signout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentStore');
    delete api.defaults.headers.common['Authorization'];
    dispatch({ type: 'SIGN_OUT' });
    toast.success('Déconnexion réussie');
  };

  const selectStore = (store: Store) => {
    localStorage.setItem('currentStore', JSON.stringify(store));
    dispatch({ type: 'SET_STORE', payload: store });
  };

  const refreshUser = async () => {
    try {
      const response = await api.get('/auth/me');
      dispatch({ type: 'SET_USER', payload: response.data.user });
    } catch (error) {
      signout();
    }
  };

  const value: AuthContextType = {
    ...state,
    signin,
    signout,
    selectStore,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const use2Auth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};