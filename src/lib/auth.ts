// src/lib/auth.api.ts
import { apiRequest } from './api';

/**
 * Authenticates a user by sending their email and password to the backend login endpoint.
 *
 * @param email - The user's email address
 * @param password - The user's password
 * @returns The response from the authentication API, typically including user data and authentication tokens
 */
export async function signIn(email: string, password: string) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

// 📝 Register new user
export async function signUp(data: {
  fullName: string;
  phone?: string;
  email: string;
  password?: string;
  avatar?: string;
  authProvider?: string;
  provider?: string;
  isActive?: boolean;
  canCreateStore?: boolean;
}) {
  return apiRequest('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });
}

export function signUpWithGoogle() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  window.location.href = `${API_BASE_URL}/api/auth/google`;
}

// 🌐 Google OAuth Sign-In (redirect to backend)
export function signInWithGoogle() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  window.location.href = `${API_BASE_URL}/api/auth/google`;
}

// 🛒 Select a store after login
export async function selectStore(storeUserId: number) {
  return apiRequest('/api/auth/select-store', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ storeUserId }),
    credentials: 'include',
  });
}

// 🔁 Refresh access token using refresh token cookie
export async function refreshToken() {
  return apiRequest('/api/auth/refresh', {
    method: 'POST',
    credentials: 'include',
  });
}

// 🚪 Logout user (clears all auth cookies)
export async function logout() {
  return apiRequest('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });
}

// 👤 Get user profile using access token
export async function getUserProfile() {
  return apiRequest('/api/auth/profile', {
    method: 'GET',
    credentials: 'include',
  });
}

// 🏪 Get store-specific dashboard
export async function getStoreDashboard() {
  return apiRequest('/api/auth/store-dashboard', {
    method: 'GET',
    credentials: 'include',
  });
}
