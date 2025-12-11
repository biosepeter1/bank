import apiClient from './client';

export interface RegisterData {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  password: string;
  country?: string;
  currency?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const authApi = {
  register: async (data: RegisterData) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginData) => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    const response = await apiClient.patch('/auth/change-password', {
      currentPassword,
      newPassword,
      confirmPassword,
    });
    return response.data;
  },

  getUserSettings: async () => {
    const response = await apiClient.get('/auth/settings');
    return response.data as {
      emailTransactions: boolean;
      emailSecurity: boolean;
      emailMarketing: boolean;
      smsTransactions: boolean;
      smsSecurity: boolean;
      pushNotifications: boolean;
    };
  },

  updateUserSettings: async (settings: {
    emailTransactions?: boolean;
    emailSecurity?: boolean;
    emailMarketing?: boolean;
    smsTransactions?: boolean;
    smsSecurity?: boolean;
    pushNotifications?: boolean;
  }) => {
    const response = await apiClient.patch('/auth/settings', settings);
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data as {
      message: string;
      otpId: string;
      expiresIn: number;
    };
  },

  resetPassword: async (data: {
    otpId: string;
    code: string;
    newPassword: string;
  }) => {
    const response = await apiClient.post('/auth/reset-password', data);
    return response.data;
  },

  sendVerificationEmail: async () => {
    const response = await apiClient.post('/auth/send-verification-email');
    return response.data as {
      message: string;
      otpId: string;
      expiresIn: number;
    };
  },

  verifyEmail: async (otpId: string, code: string) => {
    const response = await apiClient.post('/auth/verify-email', { otpId, code });
    return response.data;
  },
};
