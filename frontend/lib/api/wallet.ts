import apiClient from './client';

export const walletApi = {
  getWallet: async () => {
    const response = await apiClient.get('/wallet');
    return response.data;
  },

  getBalance: async () => {
    const response = await apiClient.get('/wallet/balance');
    return response.data;
  },

  deposit: async (amount: number, description?: string) => {
    const response = await apiClient.post('/wallet/deposit', {
      amount,
      description,
    });
    return response.data;
  },

  withdraw: async (amount: number, description?: string) => {
    const response = await apiClient.post('/wallet/withdraw', {
      amount,
      description,
    });
    return response.data;
  },

  transfer: async (recipientId: string, amount: number, description?: string) => {
    const response = await apiClient.post('/wallet/transfer', {
      recipientId,
      amount,
      description,
    });
    return response.data;
  },
};
