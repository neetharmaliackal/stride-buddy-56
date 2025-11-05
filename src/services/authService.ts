import { API_ENDPOINTS } from '@/config/api';
import type { RegisterPayload, LoginPayload, AuthResponse } from '@/types/auth';

const TOKEN_KEY = 'fitness_access_token';
const REFRESH_TOKEN_KEY = 'fitness_refresh_token';

export const authService = {
  async register(data: RegisterPayload): Promise<{ detail: string }> {
    const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Registration failed');
    }

    return response.json();
  },

  async login(data: LoginPayload): Promise<AuthResponse> {
    const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }

    const tokens = await response.json();
    this.setTokens(tokens.access, tokens.refresh);
    return tokens;
  },

  setTokens(access: string, refresh: string) {
    localStorage.setItem(TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  },

  getAccessToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  clearTokens() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  },

  logout() {
    this.clearTokens();
  },
};
