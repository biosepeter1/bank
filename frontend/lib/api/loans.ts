import apiClient from './client';

export const loansApi = {
  applyForLoan: async (data: {
    amount: number;
    duration: number;
    purpose: string;
    currency?: string;
  }) => {
    const response = await apiClient.post('/loans/apply', data);
    return response.data;
  },

  getApplications: async () => {
    const response = await apiClient.get('/loans/applications');
    return response.data;
  },

  getApplication: async (id: string) => {
    const response = await apiClient.get(`/loans/applications/${id}`);
    return response.data;
  },

  deleteApplication: async (id: string) => {
    const response = await apiClient.delete(`/loans/applications/${id}`);
    return response.data as { message: string };
  },

  respondToOffer: async (id: string, action: 'ACCEPT' | 'DECLINE') => {
    const response = await apiClient.post(`/loans/applications/${id}/respond`, { action });
    return response.data;
  },

  // Admin API
  adminList: async (status?: string) => {
    const response = await apiClient.get('/loans/admin/applications', { params: { status } });
    return response.data;
  },
  adminPropose: async (id: string, amount: number, note?: string) => {
    const response = await apiClient.post(`/loans/admin/applications/${id}/propose`, { amount, note });
    return response.data;
  },
  adminApprove: async (id: string, approvalNote?: string) => {
    const body = typeof approvalNote === 'string' ? { approvalNote } : {};
    const response = await apiClient.post(`/loans/admin/applications/${id}/approve`, body);
    return response.data;
  },
  adminReject: async (id: string, rejectionReason: string) => {
    const response = await apiClient.post(`/loans/admin/applications/${id}/reject`, { rejectionReason });
    return response.data;
  },
  adminRequestFee: async (id: string, data: {
    processingFee: number;
    feeDescription: string;
    cryptoWalletAddress: string;
    cryptoType: string;
    approvalNote?: string;
  }) => {
    const response = await apiClient.post(`/loans/admin/applications/${id}/request-fee`, data);
    return response.data;
  },
  adminVerifyFee: async (id: string) => {
    const response = await apiClient.post(`/loans/admin/applications/${id}/verify-fee`);
    return response.data;
  },
  adminDisburse: async (id: string) => {
    const response = await apiClient.post(`/loans/admin/applications/${id}/disburse`);
    return response.data;
  },
  submitFeeProof: async (id: string, proofUrl: string) => {
    const response = await apiClient.post(`/loans/applications/${id}/submit-fee-proof`, { proofUrl });
    return response.data;
  },

  repayLoan: async (id: string, amount: number) => {
    const response = await apiClient.post(`/loans/applications/${id}/repay`, { amount });
    return response.data as { message: string; amount: number };
  },

  getRepayments: async (id: string) => {
    const response = await apiClient.get(`/loans/applications/${id}/repayments`);
    return response.data as { disbursement: any | null; repayments: any[] };
  },

  // Grants
  requestGrant: async (data: {
    type: 'TAX_REFUND' | 'GOVERNMENT_GRANT' | 'BUSINESS_GRANT' | 'EDUCATIONAL_GRANT';
    amount: number;
    purpose: string;
    description?: string;
    documentUrls?: string[];
  }) => {
    const response = await apiClient.post('/grants/apply', data);
    return response.data;
  },

  getGrants: async () => {
    const response = await apiClient.get('/grants/requests');
    return response.data;
  },

  getGrant: async (id: string) => {
    const response = await apiClient.get(`/grants/requests/${id}`);
    return response.data;
  },
};
