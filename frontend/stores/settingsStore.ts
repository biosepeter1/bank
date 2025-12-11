import { create } from 'zustand';
import { profileApi } from '@/lib/api/profile';

interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
}

interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: NotificationPreferences;
  twoFactorEnabled: boolean;
  loading: boolean;
  error: string | null;
  
  // Actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setLanguage: (lang: string) => void;
  updateNotificationPreferences: (prefs: NotificationPreferences) => Promise<void>;
  enableTwoFactor: () => Promise<string>;
  confirmTwoFactor: (code: string) => Promise<boolean>;
  disableTwoFactor: (password: string) => Promise<boolean>;
  resetError: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  theme: 'system',
  language: 'en',
  notifications: {
    email: true,
    sms: true,
    push: true,
  },
  twoFactorEnabled: false,
  loading: false,
  error: null,

  setTheme: (theme) => {
    set({ theme });
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
  },

  setLanguage: (lang) => {
    set({ language: lang });
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  },

  updateNotificationPreferences: async (prefs) => {
    set({ loading: true, error: null });
    try {
      await profileApi.updateNotifications(prefs);
      set({ notifications: prefs, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update preferences',
        loading: false,
      });
      throw error;
    }
  },

  enableTwoFactor: async () => {
    set({ loading: true, error: null });
    try {
      const { qrCode } = await profileApi.generateTwoFactorQR();
      set({ loading: false });
      return qrCode;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to enable 2FA',
        loading: false,
      });
      throw error;
    }
  },

  confirmTwoFactor: async (code) => {
    set({ loading: true, error: null });
    try {
      const result = await profileApi.verifyTwoFactorCode(code);
      set({ twoFactorEnabled: true, loading: false });
      return result;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to verify code',
        loading: false,
      });
      return false;
    }
  },

  disableTwoFactor: async (password) => {
    set({ loading: true, error: null });
    try {
      const result = await profileApi.disableTwoFactor(password);
      set({ twoFactorEnabled: false, loading: false });
      return result;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to disable 2FA',
        loading: false,
      });
      return false;
    }
  },

  resetError: () => set({ error: null }),
}));
