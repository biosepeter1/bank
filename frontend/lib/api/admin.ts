import apiClient from './client';

export const adminApi = {
  // Admin Dashboard
  getDashboardStats: async () => {
    const response = await apiClient.get('/admin/dashboard/stats');
    return response.data as {
      totalUsers: number;
      activeUsers: number;
      pendingKYC: number;
      totalTransactions: number;
      totalVolume: number;
      activeCards: number;
      pendingApprovals: number;
      systemAlerts: number;
    };
  },

  // User Management
  getUsers: async () => {
    const response = await apiClient.get('/users');
    return response.data;
  },

  getUserById: async (id: string) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  updateUserStatus: async (userId: string, data: any) => {
    const response = await apiClient.patch(`/users/${userId}/status`, data);
    return response.data;
  },

  deleteUser: async (userId: string) => {
    const response = await apiClient.delete(`/users/${userId}`);
    return response.data;
  },

  adjustUserBalance: async (userId: string, data: any) => {
    const response = await apiClient.post(`/users/${userId}/balance`, data);
    return response.data;
  },

  clearUserAccount: async (userId: string, reason: string) => {
    const response = await apiClient.post(`/wallet/admin/${userId}/clear`, { reason });
    return response.data;
  },

  createUser: async (userData: {
    firstName: string;
    lastName: string;
    username?: string;
    email: string;
    phone: string;
    password: string;
    country?: string;
    accountType?: string;
    currency?: string;
    transactionPin?: string;
    initialBalance?: number;
  }) => {
    const response = await apiClient.post('/admin/users/create', userData);
    return response.data;
  },

  resetUserPassword: async (userId: string) => {
    const response = await apiClient.post(`/users/${userId}/reset-password`);
    return response.data;
  },

  sendUserEmail: async (userId: string, data: any) => {
    const response = await apiClient.post(`/users/${userId}/send-email`, data);
    return response.data;
  },

  // KYC Management - try multiple endpoint patterns
  getAllKYC: async () => {
    const possibleEndpoints = [
      '/kyc/all',         // All KYC documents
      '/kyc',             // Fallback
      '/admin/kyc',       // Admin KYC
      '/kyc/pending',     // Legacy
    ];

    let lastError;
    for (const endpoint of possibleEndpoints) {
      try {
        console.log(`🔄 Trying KYC endpoint: ${endpoint}`);
        const response = await apiClient.get(endpoint);
        console.log(`✅ Success with KYC endpoint: ${endpoint}`);
        return response.data;
      } catch (error: any) {
        console.log(`❌ Failed with KYC endpoint ${endpoint}:`, error.response?.status);
        lastError = error;
        if (error.response?.status === 401 || error.response?.status === 403) {
          break;
        }
      }
    }

    throw lastError;
  },

  getPendingKYC: async () => {
    const response = await apiClient.get('/kyc/pending');
    return response.data;
  },

  approveKYC: async (kycId: string) => {
    const response = await apiClient.post(`/kyc/review/${kycId}`, {
      status: 'APPROVED',
    });
    return response.data;
  },

  rejectKYC: async (kycId: string, rejectionReason: string) => {
    const response = await apiClient.post(`/kyc/review/${kycId}`, {
      status: 'REJECTED',
      rejectionReason,
    });
    return response.data;
  },

  // Transfer code management (admin)
  getUserCodes: async (userId: string) => {
    const res = await apiClient.get(`/transfers/codes/admin/${userId}`);
    return res.data as { forced: boolean; codes: Array<{ type: 'COT' | 'IMF' | 'TAX'; code: string; isActive: boolean; isVerified: boolean; activatedAt?: string; verifiedAt?: string }> };
  },
  setUserCodesForce: async (userId: string, forced: boolean) => {
    const res = await apiClient.patch(`/transfers/codes/admin/${userId}/force`, { forced });
    return res.data as { forced: boolean };
  },

  // Transaction Monitoring  
  getAllTransactions: async (params?: {
    limit?: number;
    offset?: number;
    type?: string;
    status?: string;
  }) => {
    const response = await apiClient.get('/transactions/all', { params });
    return response.data;
  },

  getTransactionStats: async () => {
    const response = await apiClient.get('/transactions/admin/stats');
    return response.data;
  },

  // Settings Management
  getSettings: async () => {
    const response = await apiClient.get('/settings');
    return response.data;
  },

  updateSettings: async (settings: any) => {
    const response = await apiClient.put('/settings', settings);
    return response.data;
  },

  testEmail: async (to?: string) => {
    const response = await apiClient.post('/settings/test-email', to ? { to } : {});
    return response.data;
  },
};
