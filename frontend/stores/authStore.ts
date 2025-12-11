import { create } from 'zustand';
import { authApi, LoginData, RegisterData } from '@/lib/api/auth';
import { toast } from 'react-toastify';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  country?: string;
  currency?: string;
  role: string;
  accountStatus: string;
  isEmailVerified?: boolean;
  phone?: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (data: LoginData) => {
    set({ isLoading: true });
    try {
      const response = await authApi.login(data);

      // Save tokens
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);

      // Save user country and currency to localStorage
      if (response.user.country) {
        localStorage.setItem('userCountry', response.user.country);
      }
      if (response.user.currency) {
        localStorage.setItem('userCurrency', JSON.stringify({ code: response.user.currency, symbol: '₦' }));
      }

      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      });

      toast.success('Login successful!');
    } catch (error: any) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  },

  register: async (data: RegisterData) => {
    set({ isLoading: true });
    try {
      const response = await authApi.register(data);

      // Save tokens
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);

      // Save user country and currency to localStorage (already saved in register page, but ensure consistency)
      if (response.user.country) {
        localStorage.setItem('userCountry', response.user.country);
      }
      if (response.user.currency) {
        localStorage.setItem('userCurrency', JSON.stringify({ code: response.user.currency, symbol: '₦' }));
      }

      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      });

      toast.success('Registration successful!');
    } catch (error: any) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({
      user: null,
      isAuthenticated: false,
    });
    toast.info('Logged out successfully');
  },

  fetchProfile: async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!token) {
      set({ user: null, isAuthenticated: false });
      throw new Error('No token found');
    }

    try {
      const user = await authApi.getProfile();
      set({
        user,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      set({
        user: null,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  setUser: (user: User) => {
    set({ user, isAuthenticated: true });
  },
}));
