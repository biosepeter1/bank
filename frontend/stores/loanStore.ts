import { create } from 'zustand';
import { loansApi } from '@/lib/api/loans';

export interface LoanApplication {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  duration: number;
  purpose: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'COMPLETED' | 'DEFAULTED';
  interestRate?: number;
  monthlyPayment?: number;
  totalRepaid?: number;
  createdAt: string;
}

export interface Grant {
  id: string;
  userId: string;
  type: 'TAX_REFUND' | 'GOVERNMENT_GRANT' | 'BUSINESS_GRANT' | 'EDUCATIONAL_GRANT';
  amount: number;
  currency: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  purpose: string;
  createdAt: string;
}

interface LoanState {
  applications: LoanApplication[];
  grants: Grant[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchApplications: () => Promise<void>;
  fetchGrants: () => Promise<void>;
  applyForLoan: (data: Partial<LoanApplication>) => Promise<void>;
  requestGrant: (data: Partial<Grant>) => Promise<void>;
  resetError: () => void;
}

export const useLoanStore = create<LoanState>((set) => ({
  applications: [],
  grants: [],
  loading: false,
  error: null,

  fetchApplications: async () => {
    set({ loading: true, error: null });
    try {
      const data = await loansApi.getApplications();
      set({ applications: data, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch loan applications',
        loading: false,
      });
    }
  },

  fetchGrants: async () => {
    set({ loading: true, error: null });
    try {
      const data = await loansApi.getGrants();
      set({ grants: data, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch grants',
        loading: false,
      });
    }
  },

  applyForLoan: async (data) => {
    set({ loading: true, error: null });
    try {
      const newApp = await loansApi.applyForLoan(data);
      set((state) => ({
        applications: [...state.applications, newApp],
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to apply for loan',
        loading: false,
      });
      throw error;
    }
  },

  requestGrant: async (data) => {
    set({ loading: true, error: null });
    try {
      const newGrant = await loansApi.requestGrant(data);
      set((state) => ({
        grants: [...state.grants, newGrant],
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to request grant',
        loading: false,
      });
      throw error;
    }
  },

  resetError: () => set({ error: null }),
}));
