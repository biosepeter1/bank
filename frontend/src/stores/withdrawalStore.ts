import { create } from 'zustand';
import axios from 'axios';

interface Withdrawal {
    id: string;
    userId: string;
    amount: number;
    fee: number;
    totalAmount: number;
    withdrawalMethod: string;
    accountNumber: string;
    bankCode: string;
    accountName: string;
    status: 'PENDING' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';
    narration?: string;
    createdAt: string;
    processedAt?: string;
}

interface WithdrawalStore {
    withdrawals: Withdrawal[];
    currentWithdrawal: Withdrawal | null;
    loading: boolean;
    error: string | null;

    // Actions
    initiateWithdrawal: (data: any) => Promise<any>;
    getWithdrawalHistory: () => Promise<void>;
    getWithdrawalById: (withdrawalId: string) => Promise<void>;
    cancelWithdrawal: (withdrawalId: string) => Promise<void>;
    clearError: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const useWithdrawalStore = create<WithdrawalStore>((set) => ({
    withdrawals: [],
    currentWithdrawal: null,
    loading: false,
    error: null,

    initiateWithdrawal: async (data) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/withdrawals/initiate`, data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            set({ currentWithdrawal: response.data, loading: false });
            return response.data;
        } catch (err: any) {
            const error = err.response?.data?.message || 'Failed to initiate withdrawal';
            set({ error, loading: false });
            throw error;
        }
    },

    getWithdrawalHistory: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/withdrawals/history`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            set({ withdrawals: response.data, loading: false });
        } catch (err: any) {
            const error = err.response?.data?.message || 'Failed to fetch withdrawal history';
            set({ error, loading: false });
            throw error;
        }
    },

    getWithdrawalById: async (withdrawalId) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/withdrawals/${withdrawalId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            set({ currentWithdrawal: response.data, loading: false });
        } catch (err: any) {
            const error = err.response?.data?.message || 'Failed to fetch withdrawal details';
            set({ error, loading: false });
            throw error;
        }
    },

    cancelWithdrawal: async (withdrawalId) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post(
                `${API_URL}/withdrawals/${withdrawalId}/cancel`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            // Update the withdrawal in the list
            set((state) => ({
                withdrawals: state.withdrawals.map((w) =>
                    w.id === withdrawalId ? response.data : w
                ),
                loading: false,
            }));
        } catch (err: any) {
            const error = err.response?.data?.message || 'Failed to cancel withdrawal';
            set({ error, loading: false });
            throw error;
        }
    },

    clearError: () => set({ error: null }),
}));