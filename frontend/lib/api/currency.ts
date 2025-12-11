import apiClient from './client';

export const currencyApi = {
  getExchangeRate: async (fromCurrency: string, toCurrency: string) => {
    const response = await apiClient.get('/currency/exchange-rate', {
      params: { from: fromCurrency, to: toCurrency },
    });
    return response.data;
  },

  getAllRates: async () => {
    const response = await apiClient.get('/currency/rates');
    return response.data;
  },

  swapCurrency: async (data: {
    fromCurrency: string;
    toCurrency: string;
    fromAmount: number;
  }) => {
    const response = await apiClient.post('/currency/swap', data);
    return response.data;
  },

  getExchangeHistory: async () => {
    const response = await apiClient.get('/currency/history');
    return response.data;
  },
};
