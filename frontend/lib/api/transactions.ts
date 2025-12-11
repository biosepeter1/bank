import apiClient from './client';

export const transactionsApi = {
  getTransactions: async () => {
    const response = await apiClient.get('/transactions');
    return response.data;
  },

  getTransactionById: async (id: string) => {
    const response = await apiClient.get(`/transactions/${id}`);
    return response.data;
  },

  getTransactionStats: async () => {
    const response = await apiClient.get('/transactions/stats');
    return response.data;
  },
};
