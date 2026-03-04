import { create } from 'zustand';
import { Transaction, Transfer, Beneficiary, TransactionFilter } from './types';

interface TransactionStore {
  transactions: Transaction[];
  transfers: Transfer[];
  beneficiaries: Beneficiary[];
  isLoading: boolean;
  error: string | null;

  // Transaction actions
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  filterTransactions: (filter: TransactionFilter) => Transaction[];
  
  // Transfer actions
  setTransfers: (transfers: Transfer[]) => void;
  addTransfer: (transfer: Transfer) => void;
  
  // Beneficiary actions
  setBeneficiaries: (beneficiaries: Beneficiary[]) => void;
  addBeneficiary: (beneficiary: Beneficiary) => void;
  removeBeneficiary: (id: string) => void;
  
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useTransactionStore = create<TransactionStore>((set, get) => ({
  transactions: [],
  transfers: [],
  beneficiaries: [],
  isLoading: false,
  error: null,

  setTransactions: (transactions) => set({ transactions }),
  
  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions],
    })),
  
  filterTransactions: (filter) => {
    const state = get();
    return state.transactions.filter((tx) => {
      if (filter.type && tx.type !== filter.type) return false;
      if (filter.category && tx.category !== filter.category) return false;
      if (filter.status && tx.status !== filter.status) return false;
      if (filter.startDate && tx.date < filter.startDate) return false;
      if (filter.endDate && tx.date > filter.endDate) return false;
      if (filter.minAmount && tx.amount < filter.minAmount) return false;
      if (filter.maxAmount && tx.amount > filter.maxAmount) return false;
      if (
        filter.searchQuery &&
        !tx.description
          .toLowerCase()
          .includes(filter.searchQuery.toLowerCase())
      )
        return false;
      return true;
    });
  },
  
  setTransfers: (transfers) => set({ transfers }),
  
  addTransfer: (transfer) =>
    set((state) => ({
      transfers: [transfer, ...state.transfers],
    })),
  
  setBeneficiaries: (beneficiaries) => set({ beneficiaries }),
  
  addBeneficiary: (beneficiary) =>
    set((state) => ({
      beneficiaries: [...state.beneficiaries, beneficiary],
    })),
  
  removeBeneficiary: (id) =>
    set((state) => ({
      beneficiaries: state.beneficiaries.filter((b) => b.id !== id),
    })),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
}));
