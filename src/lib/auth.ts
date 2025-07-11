import { apiRequest } from './api';

export async function signIn(email: string, password: string) {
  return apiRequest('/api/signin', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function signUp(firstName: string, lastName: string, email: string, password: string) {
  return apiRequest('/api/signup', {
    method: 'POST',
    body: JSON.stringify({ firstName, lastName, email, password }),
  });
}

// Redirects user to Google OAuth endpoint on the backend
export function signUpWithGoogle() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  window.location.href = `${API_BASE_URL}/api/auth/google`;
}
