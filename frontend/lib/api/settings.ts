import apiClient from './client';

export interface SystemSettings {
  general: {
    siteName: string;
    siteDescription: string;
    logo?: string;
    favicon?: string;
    supportEmail: string;
    supportPhone: string;
    bankName: string;
    bankCode: string;
  };
  payment: {
    usdtWalletAddress?: string;
    btcWalletAddress?: string;
    bankName?: string;
    accountNumber?: string;
    accountName?: string;
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
  email: {
    provider: string;
    smtpHost?: string;
    smtpPort?: number;
    smtpUser?: string;
    fromAddress?: string;
    fromName?: string;
  };
}

export const settingsApi = {
  getSettings: async (): Promise<SystemSettings> => {
    const response = await apiClient.get('/settings');
    return response.data;
  },

  updateSettings: async (settings: Partial<SystemSettings>) => {
    const response = await apiClient.put('/settings', settings);
    return response.data;
  },
};
