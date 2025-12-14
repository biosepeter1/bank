import { create } from 'zustand';
import axios from 'axios';

interface Investment {
    id: string;
    userId: string;
    planType: string;
    amount: number;
    roi: number;
    expectedReturn: number;
    totalReturn: number;
    status: 'ACTIVE' | 'COMPLETED' | 'LIQUIDATED';
    startDate: string;
    maturityDate: string;
    createdAt: string;
}

interface InvestmentPlan {
    name: string;
    minAmount: number;
    maxAmount: number | null;
    roi: number;
    duration: number;
}

interface InvestmentStore {
    investments: Investment[];
    investmentPlans: Record<string, InvestmentPlan>;
    investmentSummary: any | null;
    currentInvestment: Investment | null;
    loading: boolean;
    error: string | null;

    // Actions
    getInvestmentPlans: () => Promise<void>;
    createInvestment: (amount: number, planType: string) => Promise<any>;
    getUserInvestments: () => Promise<void>;
    getInvestmentSummary: () => Promise<void>;
    getInvestmentById: (investmentId: string) => Promise<void>;
    liquidateInvestment: (investmentId: string) => Promise<void>;
    clearError: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const useInvestmentStore = create<InvestmentStore>((set) => ({
    investments: [],
    investmentPlans: {},
    investmentSummary: null,
    currentInvestment: null,
    loading: false,
    error: null,

    getInvestmentPlans: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/investments/plans`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            set({ investmentPlans: response.data, loading: false });
        } catch (err: any) {
            const error = err.response?.data?.message || 'Failed to fetch investment plans';
            set({ error, loading: false });
            throw error;
        }
    },

    createInvestment: async (amount, planType) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post(
                `${API_URL}/investments/create`,
                { amount, planType },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            set((state) => ({
                currentInvestment: response.data,
                investments: [response.data, ...state.investments],
                loading: false,
            }));
            return response.data;
        } catch (err: any) {
            const error = err.response?.data?.message || 'Failed to create investment';
            set({ error, loading: false });
            throw error;
        }
    },

    getUserInvestments: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/investments/list`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            set({ investments: response.data, loading: false });
        } catch (err: any) {
            const error = err.response?.data?.message || 'Failed to fetch investments';
            set({ error, loading: false });
            throw error;
        }
    },

    getInvestmentSummary: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/investments/summary`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            set({ investmentSummary: response.data, loading: false });
        } catch (err: any) {
            const error = err.response?.data?.message || 'Failed to fetch investment summary';
            set({ error, loading: false });
            throw error;
        }
    },

    getInvestmentById: async (investmentId) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/investments/${investmentId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            set({ currentInvestment: response.data, loading: false });
        } catch (err: any) {
            const error = err.response?.data?.message || 'Failed to fetch investment';
            set({ error, loading: false });
            throw error;
        }
    },

    liquidateInvestment: async (investmentId) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post(
                `${API_URL}/investments/${investmentId}/liquidate`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            set((state) => ({
                investments: state.investments.map((inv) =>
                    inv.id === investmentId ? response.data : inv
                ),
                loading: false,
            }));
        } catch (err: any) {
            const error = err.response?.data?.message || 'Failed to liquidate investment';
            set({ error, loading: false });
            throw error;
        }
    },

    clearError: () => set({ error: null }),
}));