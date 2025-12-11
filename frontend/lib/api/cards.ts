import apiClient from './client';

export const cardsApi = {
  getUserCards: async () => {
    const response = await apiClient.get('/cards');
    return response.data;
  },

  getUserCardRequests: async () => {
    const response = await apiClient.get('/cards/requests');
    return response.data;
  },

  getCardById: async (cardId: string) => {
    const response = await apiClient.get(`/cards/${cardId}`);
    return response.data;
  },

  createVirtualCard: async (cardType?: 'VIRTUAL' | 'PHYSICAL', reason?: string) => {
    const response = await apiClient.post('/cards/create', { cardType, reason });
    return response.data;
  },

  fundCard: async (cardId: string, amount: number) => {
    const response = await apiClient.post(`/cards/${cardId}/fund`, { amount });
    return response.data as { message: string; transactionId: string };
  },

  withdrawCard: async (cardId: string, amount: number) => {
    const response = await apiClient.post(`/cards/${cardId}/withdraw`, { amount });
    return response.data as { message: string; transactionId: string };
  },

  getCardPan: async (cardId: string) => {
    const response = await apiClient.get(`/cards/${cardId}/pan`);
    return response.data as { brand: string; pan: string; cvv: string; expiryMonth: number; expiryYear: number };
  },

  blockCard: async (cardId: string) => {
    const response = await apiClient.post(`/cards/${cardId}/block`);
    return response.data;
  },

  unblockCard: async (cardId: string) => {
    const response = await apiClient.post(`/cards/${cardId}/unblock`);
    return response.data;
  },

  // Admin endpoints
  getAllCardRequests: async (status?: string) => {
    const response = await apiClient.get('/cards/admin/requests', {
      params: { status },
    });
    return response.data;
  },

  approveCardRequest: async (requestId: string) => {
    const response = await apiClient.post(`/cards/admin/requests/${requestId}/approve`);
    return response.data;
  },

  rejectCardRequest: async (requestId: string, reason: string) => {
    const response = await apiClient.post(`/cards/admin/requests/${requestId}/reject`, {
      reason,
    });
    return response.data;
  },
};
