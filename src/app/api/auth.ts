import { apiClient, setAuthToken } from './client';
import type { User } from '../types';

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
}

/** POST /auth/login */
export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/login', payload);
  return data;
}

/** POST /auth/register */
export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/register', payload);
  return data;
}

/** GET /auth/me — used to restore a session from a stored token. */
export async function getMe(): Promise<User> {
  const { data } = await apiClient.get<User>('/auth/me');
  return data;
}

/** POST /auth/logout — best-effort; always clears the local token. */
export async function logout(): Promise<void> {
  try {
    await apiClient.post('/auth/logout');
  } finally {
    setAuthToken(null);
  }
}

/** PUT /auth/change-password */
export async function changePassword(payload: ChangePasswordPayload): Promise<void> {
  await apiClient.put('/auth/change-password', payload);
}
