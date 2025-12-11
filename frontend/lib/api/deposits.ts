import apiClient from './client';

export const depositsApi = {
  initiateDeposit: async (data: {
    amount: number;
    method: 'PAYSTACK' | 'USDT' | 'BANK_TRANSFER' | 'PAYPAL';
    currency?: string;
  }) => {
    const response = await apiClient.post('/deposits/initiate', data);
    return response.data;
  },

  getDepositHistory: async () => {
    const response = await apiClient.get('/deposits/history');
    return response.data;
  },

  getDepositById: async (id: string) => {
    const response = await apiClient.get(`/deposits/${id}`);
    return response.data;
  },

  uploadDepositProof: async (depositId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post(`/deposits/${depositId}/proof`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  confirmPaystackDeposit: async (reference: string) => {
    const response = await apiClient.post('/deposits/confirm-paystack', { reference });
    return response.data;
  },
};
