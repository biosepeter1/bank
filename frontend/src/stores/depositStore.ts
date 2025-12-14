import { create } from 'zustand';
import axios from 'axios';

interface Deposit {
    id: string;
    userId: string;
    amount: number;
    currency: string;
    depositMethod: string;
    paymentProvider: string;
    status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
    providerRef?: string;
    proofUrl?: string;
    createdAt: string;
    completedAt?: string;
}

interface DepositStore {
    deposits: Deposit[];
    currentDeposit: Deposit | null;
    loading: boolean;
    error: string | null;

    // Actions
    initiateDeposit: (amount: number, method: string) => Promise<any>;
    confirmDeposit: (reference: string) => Promise<void>;
    getDepositHistory: () => Promise<void>;
    getDepositById: (depositId: string) => Promise<void>;
    uploadDepositProof: (depositId: string, file: File) => Promise<void>;
    clearError: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const useDepositStore = create<DepositStore>((set) => ({
    deposits: [],
    currentDeposit: null,
    loading: false,
    error: null,

    initiateDeposit: async (amount, method) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post(
                `${API_URL}/deposits/initiate`,
                {
                    amount,
                    method,
                    currency: 'NGN',
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            set({ currentDeposit: response.data.deposit, loading: false });
            return response.data;
        } catch (err: any) {
            const error = err.response?.data?.message || 'Failed to initiate deposit';
            set({ error, loading: false });
            throw error;
        }
    },

    confirmDeposit: async (reference) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post(
                `${API_URL}/deposits/confirm`,
                { reference },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            set({ currentDeposit: response.data, loading: false });
        } catch (err: any) {
            const error = err.response?.data?.message || 'Failed to confirm deposit';
            set({ error, loading: false });
            throw error;
        }
    },

    getDepositHistory: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/deposits/history`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            set({ deposits: response.data, loading: false });
        } catch (err: any) {
            const error = err.response?.data?.message || 'Failed to fetch deposit history';
            set({ error, loading: false });
            throw error;
        }
    },

    getDepositById: async (depositId) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/deposits/${depositId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            set({ currentDeposit: response.data, loading: false });
        } catch (err: any) {
            const error = err.response?.data?.message || 'Failed to fetch deposit details';
            set({ error, loading: false });
            throw error;
        }
    },

    uploadDepositProof: async (depositId, file) => {
        set({ loading: true, error: null });
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post(
                `${API_URL}/deposits/${depositId}/upload-proof`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            set({ currentDeposit: response.data, loading: false });
        } catch (err: any) {
            const error = err.response?.data?.message || 'Failed to upload proof';
            set({ error, loading: false });
            throw error;
        }
    },

    clearError: () => set({ error: null }),
}));