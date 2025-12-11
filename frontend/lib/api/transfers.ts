import apiClient from './client';

export const transferApi = {
  initiateTransfer: async (data: {
    recipientEmail: string;
    amount: number;
    description?: string;
  }) => {
    const response = await apiClient.post('/transfers/local', data);
    return response.data;
  },

  initiateInternationalTransfer: async (data: {
    beneficiaryName: string;
    beneficiaryAccount: string;
    bankName: string;
    bankCode?: string;
    swiftCode?: string;
    amount: number;
    currency?: string;
    description?: string;
    transferCodes?: string[];
  }) => {
    const response = await apiClient.post('/transfers/international', data);
    return response.data;
  },

  getBeneficiaries: async () => {
    const response = await apiClient.get('/transfers/beneficiaries');
    return response.data;
  },

  createBeneficiary: async (data: {
    name: string;
    accountNumber: string;
    bankName: string;
    bankCode?: string;
    transferType: 'INTERNAL' | 'DOMESTIC' | 'INTERNATIONAL';
    swiftCode?: string;
    iban?: string;
    country?: string;
  }) => {
    const response = await apiClient.post('/transfers/beneficiaries', data);
    return response.data;
  },

  deleteBeneficiary: async (id: string) => {
    const response = await apiClient.delete(`/transfers/beneficiaries/${id}`);
    return response.data;
  },

  validateCodes: async (codes: string[]) => {
    const response = await apiClient.post('/transfers/validate-codes', { codes });
    return response.data.valid;
  },

  // Stepwise transfer code flow (user)
  requestCode: async (type: 'COT'|'IMF'|'TAX') => {
    const res = await apiClient.post('/transfers/codes/request', { type });
    return res.data;
  },
  verifyCode: async (type: 'COT'|'IMF'|'TAX', code: string) => {
    const res = await apiClient.post('/transfers/codes/verify', { type, code });
    return res.data;
  },
  getCodesStatus: async () => {
    const res = await apiClient.get('/transfers/codes/status');
    return res.data as { required: boolean; status: Record<string, { isActive: boolean; isVerified: boolean }> };
  },

  // Admin endpoints for transfer codes
  listAdminCodeRequests: async () => {
    const res = await apiClient.get('/transfers/codes/admin/requests');
    return res.data as Array<{ userId: string; userEmail: string; userName: string; type: 'COT'|'IMF'|'TAX'; requestedAt: string }>;
  },
  approveAdminCode: async (userId: string, type: 'COT'|'IMF'|'TAX') => {
    const res = await apiClient.patch(`/transfers/codes/admin/${userId}/${type}/approve`);
    return res.data;
  },
};
