import { create } from 'zustand';
import api from '@/services/api';
import { transactionService } from '@/services/apiService';

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending';
}

interface Wallet {
  balance: number;
  income: number;
  expenses: number;
  investments: number;
  currency: string;
}

interface WalletStore {
  wallet: Wallet | null;
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  
  getWalletData: () => Promise<void>;
  setWallet: (wallet: Wallet) => void;
  setTransactions: (transactions: Transaction[]) => void;
}

export const useWalletStore = create<WalletStore>((set) => ({
  wallet: null,
  transactions: [],
  isLoading: false,
  error: null,
  
  getWalletData: async () => {
    set({ isLoading: true, error: null });
    try {
      console.log('🔄 Fetching wallet data from API...');
      
      // Fetch wallet data from API
      const walletResponse = await api.get('/wallet');
      const walletData = walletResponse.data;
      
      console.log('✅ Wallet API Response:', walletData);
      console.log('💰 Balance:', walletData.balance, 'Currency:', walletData.currency);
      
      // Calculate income, expenses, and investments from transactions
      let transactionsData;
      try {
        transactionsData = await transactionService.getTransactions(1, 100);
      } catch (txError) {
        console.error('Failed to fetch transactions:', txError);
        transactionsData = { items: [] };
      }
      
      const txns = transactionsData?.items || [];
      
      let income = 0;
      let expenses = 0;
      
      txns.forEach((tx: any) => {
        const txType = (tx.type || '').toUpperCase();
        if (txType === 'CREDIT' || txType === 'DEPOSIT' || txType === 'ADJUSTMENT') {
          income += Number(tx.amount) || 0;
        } else if (txType === 'DEBIT' || txType === 'WITHDRAWAL' || txType === 'TRANSFER') {
          expenses += Number(tx.amount) || 0;
        }
      });
      
      // Parse wallet balance properly
      const balance = Number(walletData.balance) || 0;
      
      set({ 
        wallet: {
          balance,
          income,
          expenses,
          investments: 0, // TODO: fetch from investments API
          currency: walletData.currency || 'NGN',
        },
        transactions: txns.map((tx: any) => ({
          id: tx.id,
          type: (tx.type || '').toLowerCase(),
          amount: Number(tx.amount) || 0,
          description: tx.description || tx.narration || 'Transaction',
          date: tx.createdAt || tx.date,
          status: (tx.status || '').toLowerCase(),
        })),
        isLoading: false 
      });
    } catch (error: any) {
      console.error('Error fetching wallet data:', error);
      console.error('Error response:', error.response?.data);
      set({ 
        error: error.response?.data?.message || error.message || 'Failed to fetch wallet data',
        isLoading: false 
      });
    }
  },
  
  setWallet: (wallet) => set({ wallet }),
  
  setTransactions: (transactions) => set({ transactions }),
}));
