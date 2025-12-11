'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { adminApi } from '@/lib/api/admin';

type SiteSettings = {
  general: {
    siteName: string;
    siteDescription: string;
    logo: string;
    favicon: string;
    supportEmail: string;
    supportPhone: string;
  };
  payment: {
    usdtWalletAddress: string;
    btcWalletAddress: string;
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  security: {
    enableTransferCodes: boolean;
    enableTwoFactor: boolean;
    maxLoginAttempts: number;
    sessionTimeout: number;
    requireKycForTransactions: boolean;
    requireKycForCards: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    transactionAlerts: boolean;
    securityAlerts: boolean;
  };
  limits: {
    minDeposit: number;
    maxDeposit: number;
    minWithdrawal: number;
    maxWithdrawal: number;
    minTransfer: number;
    maxTransfer: number;
    dailyTransferLimit: number;
  };
};

// Default settings - only used as fallback if API fails completely
// These should match what's configured in the admin settings
const defaultSettings: SiteSettings = {
  general: {
    siteName: 'United Bank of Africa',
    siteDescription: 'Digital Banking Solution',
    logo: 'https://i.ibb.co/2YHvfg7h/ng-uba-logo.png',
    favicon: '/favicon.ico',
    supportEmail: 'support@unitedbankafrica.com',
    supportPhone: '+234 800 000 0000',
  },
  payment: {
    usdtWalletAddress: '',
    btcWalletAddress: '',
    bankName: 'United Bank of Africa',
    accountNumber: '',
    accountName: 'United Bank of Africa',
  },
  security: {
    enableTransferCodes: true,
    enableTwoFactor: true,
    maxLoginAttempts: 5,
    sessionTimeout: 30,
    requireKycForTransactions: true,
    requireKycForCards: true,
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    transactionAlerts: true,
    securityAlerts: true,
  },
  limits: {
    minDeposit: 1000,
    maxDeposit: 10000000,
    minWithdrawal: 1000,
    maxWithdrawal: 5000000,
    minTransfer: 100,
    maxTransfer: 5000000,
    dailyTransferLimit: 10000000,
  },
};

type SettingsContextType = {
  settings: SiteSettings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  // Initialize with cached settings from localStorage if available
  const [settings, setSettings] = useState<SiteSettings>(() => {
    if (typeof window !== 'undefined') {
      const version = localStorage.getItem('siteSettingsVersion');
      const cached = localStorage.getItem('siteSettings');

      // Invalidate cache if version doesn't match
      if (version !== '2.0') {
        localStorage.removeItem('siteSettings');
        localStorage.removeItem('siteSettingsVersion');
        return defaultSettings;
      }

      if (cached) {
        try {
          return JSON.parse(cached);
        } catch {
          return defaultSettings;
        }
      }
    }
    return defaultSettings;
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const data = await adminApi.getSettings();
      setSettings(data);
      // Cache settings in localStorage for instant load next time
      if (typeof window !== 'undefined') {
        localStorage.setItem('siteSettings', JSON.stringify(data));
        // Store a version flag to invalidate old cache if needed
        localStorage.setItem('siteSettingsVersion', '2.0');
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      // Use default settings on error
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const refreshSettings = async () => {
    await fetchSettings();
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
