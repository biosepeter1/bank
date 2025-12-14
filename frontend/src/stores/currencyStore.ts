import { create } from 'zustand';
import axios from 'axios';

interface CurrencyStore {
    exchangeRates: Record<string, number>;
    supportedCurrencies: string[];
    loading: boolean;
    error: string | null;

    // Actions
    getExchangeRate: (from: string, to: string) => Promise<number>;
    convertCurrency: (amount: number, from: string, to: string) => Promise<any>;
    getSupportedCurrencies: () => Promise<void>;
    getExchangeRateHistory: (from: string, to: string, days?: number) => Promise<any>;
    clearError: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const useCurrencyStore = create<CurrencyStore>((set, get) => ({
    exchangeRates: {},
    supportedCurrencies: [],
    loading: false,
    error: null,

    getExchangeRate: async (from, to) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/currency/exchange-rate/${from}/${to}`);
            const rate = response.data.rate;

            set((state) => ({
                exchangeRates: {
                    ...state.exchangeRates,
                    [`${from}_${to}`]: rate,
                },
                loading: false,
            }));

            return rate;
        } catch (err: any) {
            const error = err.response?.data?.message || 'Failed to fetch exchange rate';
            set({ error, loading: false });
            throw error;
        }
    },

    convertCurrency: async (amount, from, to) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/currency/convert`, {
                amount,
                fromCurrency: from,
                toCurrency: to,
            });

            set({ loading: false });
            return response.data;
        } catch (err: any) {
            const error = err.response?.data?.message || 'Failed to convert currency';
            set({ error, loading: false });
            throw error;
        }
    },

    getSupportedCurrencies: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/currency/supported`);
            set({ supportedCurrencies: response.data.currencies, loading: false });
        } catch (err: any) {
            const error = err.response?.data?.message || 'Failed to fetch supported currencies';
            set({ error, loading: false });
            throw error;
        }
    },

    getExchangeRateHistory: async (from, to, days = 30) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/currency/history/${from}/${to}`, {
                params: { days },
            });

            set({ loading: false });
            return response.data;
        } catch (err: any) {
            const error = err.response?.data?.message || 'Failed to fetch exchange rate history';
            set({ error, loading: false });
            throw error;
        }
    },

    clearError: () => set({ error: null }),
}));