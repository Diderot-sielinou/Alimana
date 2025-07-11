import { apiRequest } from './api';

export async function signIn(data: { email: string; password: string }) {
  return apiRequest('/api/signin', {
    method: 'POST',
    body: JSON.stringify({ data }),
  });
}

export async function signUp(data: { fullName: string; email: string; password: string }) {
  return apiRequest('/api/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Redirects user to Google OAuth endpoint on the backend
export function signUpWithGoogle() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  window.location.href = `${API_BASE_URL}/api/auth/google`;
}
