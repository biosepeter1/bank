import { create } from 'zustand';
import { walletApi } from '@/lib/api/wallet';

interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

interface WalletState {
  wallet: Wallet | null;
  totalIncome: number;
  totalExpenses: number;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchWallet: () => Promise<void>;
  updateBalance: (amount: number) => void;
  resetError: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  wallet: null,
  totalIncome: 0,
  totalExpenses: 0,
  loading: false,
  error: null,

  fetchWallet: async () => {
    set({ loading: true, error: null });
    try {
      const wallet = await walletApi.getWallet();
      
      // Calculate income/expenses from transactions
      const stats = await walletApi.getStats();
      
      set({
        wallet,
        totalIncome: stats.income || 0,
        totalExpenses: stats.expenses || 0,
        loading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch wallet',
        loading: false,
      });
    }
  },

  updateBalance: (amount: number) => {
    set((state) => {
      if (!state.wallet) return state;
      return {
        wallet: {
          ...state.wallet,
          balance: state.wallet.balance + amount,
        },
      };
    });
  },

  resetError: () => set({ error: null }),
}));
