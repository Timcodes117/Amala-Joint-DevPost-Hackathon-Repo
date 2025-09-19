import { axiosPost, axiosGet } from './api';

// Types for authentication
export interface LoginCredentials {
  email: string;
  password: string;
  [key: string]: string | number | undefined;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  phone?: string;
  age?: number;
  [key: string]: string | number | undefined;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    user: {
      _id: string;
      name: string;
      email: string;
      phone?: string;
      age?: number;
      created_at: string;
      updated_at: string;
      is_active: boolean;
    };
    access_token: string;
    refresh_token: string;
  };
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  age?: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

// Authentication service functions
export const authService = {
  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axiosPost('/api/auth/login', credentials as Record<string, string | number>);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed. Please try again.'
      };
    }
  },

  // Signup user
  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    try {
      const response = await axiosPost('/api/auth/signup', credentials as Record<string, string | number>);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Signup failed. Please try again.'
      };
    }
  },

  // Get current user info
  async getCurrentUser(token: string): Promise<{ success: boolean; data?: User; error?: string }> {
    try {
      const response = await axiosGet('/api/auth/me', {
        'Authorization': `Bearer ${token}`
      } as any);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get user info'
      };
    }
  },

  // Verify token
  async verifyToken(token: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await axiosGet('/api/auth/verify', {
        'Authorization': `Bearer ${token}`
      } as any);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: 'Token verification failed'
      };
    }
  },

  // Refresh token
  async refreshToken(refreshToken: string): Promise<{ success: boolean; data?: { access_token: string }; error?: string }> {
    try {
      const response = await axiosPost('/api/auth/refresh', {}, {
        'Authorization': `Bearer ${refreshToken}`
      } as any);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: 'Token refresh failed'
      };
    }
  }
};

// Storage keys for tokens
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data'
};
