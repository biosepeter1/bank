import { create } from 'zustand';
import { transferApi } from '@/lib/api/transfers';

export interface Beneficiary {
  id: string;
  name: string;
  accountNumber: string;
  bankName: string;
  bankCode?: string;
  swiftCode?: string;
  type: 'INTERNAL' | 'DOMESTIC' | 'INTERNATIONAL';
  isDefault: boolean;
  isVerified: boolean;
  createdAt: string;
}

interface TransferState {
  beneficiaries: Beneficiary[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchBeneficiaries: () => Promise<void>;
  addBeneficiary: (data: Partial<Beneficiary>) => Promise<void>;
  deleteBeneficiary: (id: string) => Promise<void>;
  initiateTransfer: (data: any) => Promise<any>;
  validateTransferCodes: (codes: string[]) => Promise<boolean>;
  resetError: () => void;
}

export const useTransferStore = create<TransferState>((set) => ({
  beneficiaries: [],
  loading: false,
  error: null,

  fetchBeneficiaries: async () => {
    set({ loading: true, error: null });
    try {
      const data = await transferApi.getBeneficiaries();
      set({ beneficiaries: data, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch beneficiaries',
        loading: false,
      });
    }
  },

  addBeneficiary: async (data) => {
    set({ loading: true, error: null });
    try {
      const newBenef = await transferApi.createBeneficiary(data);
      set((state) => ({
        beneficiaries: [...state.beneficiaries, newBenef],
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to add beneficiary',
        loading: false,
      });
      throw error;
    }
  },

  deleteBeneficiary: async (id) => {
    set({ loading: true, error: null });
    try {
      await transferApi.deleteBeneficiary(id);
      set((state) => ({
        beneficiaries: state.beneficiaries.filter((b) => b.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete beneficiary',
        loading: false,
      });
      throw error;
    }
  },

  initiateTransfer: async (data) => {
    set({ loading: true, error: null });
    try {
      const result = await transferApi.initiateTransfer(data);
      set({ loading: false });
      return result;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to initiate transfer',
        loading: false,
      });
      throw error;
    }
  },

  validateTransferCodes: async (codes) => {
    try {
      return await transferApi.validateCodes(codes);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to validate codes',
      });
      return false;
    }
  },

  resetError: () => set({ error: null }),
}));
