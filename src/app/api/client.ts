import axios, { AxiosError } from 'axios';

/**
 * Shared axios instance for the Airline API.
 *
 * - Base URL comes from VITE_API_URL (falls back to "/api").
 * - Attaches the auth token (if any) on every request.
 * - Normalizes Laravel-style error payloads: { message, errors }.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

const AUTH_TOKEN_KEY = 'auth_token';

export function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string | null): void {
  if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
  else localStorage.removeItem(AUTH_TOKEN_KEY);
}

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/** Shape of an error the API returns (Laravel default). */
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; errors?: Record<string, string[]> }>) => {
    const apiError: ApiError = {
      message: error.response?.data?.message ?? error.message ?? 'Something went wrong',
      errors: error.response?.data?.errors,
      status: error.response?.status,
    };
    return Promise.reject(apiError);
  },
);
