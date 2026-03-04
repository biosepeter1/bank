import api, { handleApiError } from './api';
import {
  User,
  Account,
  Transaction,
  Transfer,
  Beneficiary,
  Card,
  Deposit,
  ExchangeRate,
  Loan,
  LoanPayment,
  UserSettings,
  SavingsGoal,
  ApiResponse,
  PaginatedResponse,
} from '@/stores/types';

// ============================================
// AUTH ENDPOINTS
// ============================================
export const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post<ApiResponse<{ user: User; token: string }>>(
        '/auth/login',
        { email, password }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  signup: async (userData: Partial<User> & { password: string }) => {
    try {
      const response = await api.post<ApiResponse<{ user: User; token: string }>>(
        '/auth/signup',
        userData
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// ============================================
// USER ENDPOINTS
// ============================================
export const userService = {
  getProfile: async () => {
    try {
      const response = await api.get<ApiResponse<User>>('/auth/me');
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updateProfile: async (userData: Partial<User>) => {
    try {
      const response = await api.put<ApiResponse<User>>(
        '/auth/me',
        userData
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getAccounts: async () => {
    try {
      const response = await api.get<ApiResponse<Account[]>>('/users/accounts');
      return response.data.data || [];
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getSettings: async () => {
    try {
      const response = await api.get<ApiResponse<UserSettings>>(
        '/users/settings'
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updateSettings: async (settings: Partial<UserSettings>) => {
    try {
      const response = await api.put<ApiResponse<UserSettings>>(
        '/users/settings',
        settings
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// ============================================
// TRANSACTION ENDPOINTS
// ============================================
export const transactionService = {
  getTransactions: async (page = 1, limit = 20) => {
    try {
      const response = await api.get<
        ApiResponse<PaginatedResponse<Transaction>>
      >('/transactions', {
        params: { page, limit },
      });
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getTransactionDetails: async (id: string) => {
    try {
      const response = await api.get<ApiResponse<Transaction>>(
        `/transactions/${id}`
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  exportTransactions: async (format: 'csv' | 'pdf') => {
    try {
      const response = await api.get(`/transactions/export/${format}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// ============================================
// TRANSFER ENDPOINTS
// ============================================
export const transferService = {
  getTransfers: async (page = 1, limit = 20) => {
    try {
      const response = await api.get<
        ApiResponse<PaginatedResponse<Transfer>>
      >('/transfers', {
        params: { page, limit },
      });
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  createTransfer: async (transferData: Partial<Transfer>) => {
    try {
      const response = await api.post<ApiResponse<Transfer>>(
        '/transfers',
        transferData
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getBeneficiaries: async () => {
    try {
      const response = await api.get<ApiResponse<Beneficiary[]>>(
        '/transfers/beneficiaries'
      );
      return response.data.data || [];
    } catch (error) {
      throw handleApiError(error);
    }
  },

  addBeneficiary: async (beneficiary: Partial<Beneficiary>) => {
    try {
      const response = await api.post<ApiResponse<Beneficiary>>(
        '/transfers/beneficiaries',
        beneficiary
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  removeBeneficiary: async (id: string) => {
    try {
      await api.delete(`/transfers/beneficiaries/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// ============================================
// CARD ENDPOINTS
// ============================================
export const cardService = {
  getCards: async () => {
    try {
      const response = await api.get<ApiResponse<Card[]>>('/cards');
      return response.data.data || [];
    } catch (error) {
      throw handleApiError(error);
    }
  },

  createCard: async (cardData: Partial<Card>) => {
    try {
      const response = await api.post<ApiResponse<Card>>('/cards', cardData);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updateCard: async (id: string, cardData: Partial<Card>) => {
    try {
      const response = await api.put<ApiResponse<Card>>(
        `/cards/${id}`,
        cardData
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  freezeCard: async (id: string) => {
    try {
      const response = await api.post<ApiResponse<Card>>(
        `/cards/${id}/freeze`
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  unfreezeCard: async (id: string) => {
    try {
      const response = await api.post<ApiResponse<Card>>(
        `/cards/${id}/unfreeze`
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// ============================================
// DEPOSIT ENDPOINTS
// ============================================
export const depositService = {
  getDeposits: async (page = 1, limit = 20) => {
    try {
      const response = await api.get<
        ApiResponse<PaginatedResponse<Deposit>>
      >('/deposits', {
        params: { page, limit },
      });
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  createDeposit: async (depositData: Partial<Deposit>) => {
    try {
      const response = await api.post<ApiResponse<Deposit>>(
        '/deposits',
        depositData
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// ============================================
// CURRENCY ENDPOINTS
// ============================================
export const currencyService = {
  getExchangeRates: async () => {
    try {
      const response = await api.get<ApiResponse<ExchangeRate[]>>(
        '/currency/rates'
      );
      return response.data.data || [];
    } catch (error) {
      throw handleApiError(error);
    }
  },

  convertCurrency: async (
    fromAmount: number,
    fromCurrency: string,
    toCurrency: string
  ) => {
    try {
      const response = await api.post('/currency/convert', {
        fromAmount,
        fromCurrency,
        toCurrency,
      });
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// ============================================
// LOAN ENDPOINTS
// ============================================
export const loanService = {
  getLoans: async () => {
    try {
      const response = await api.get<ApiResponse<Loan[]>>('/loans');
      return response.data.data || [];
    } catch (error) {
      throw handleApiError(error);
    }
  },

  applyForLoan: async (loanData: Partial<Loan>) => {
    try {
      const response = await api.post<ApiResponse<Loan>>('/loans', loanData);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getLoanPayments: async (loanId: string) => {
    try {
      const response = await api.get<ApiResponse<LoanPayment[]>>(
        `/loans/${loanId}/payments`
      );
      return response.data.data || [];
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// ============================================
// SAVINGS GOAL ENDPOINTS
// ============================================
export const savingsService = {
  getGoals: async () => {
    try {
      const response = await api.get<ApiResponse<SavingsGoal[]>>(
        '/savings/goals'
      );
      return response.data.data || [];
    } catch (error) {
      throw handleApiError(error);
    }
  },

  createGoal: async (goalData: Partial<SavingsGoal>) => {
    try {
      const response = await api.post<ApiResponse<SavingsGoal>>(
        '/savings/goals',
        goalData
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updateGoal: async (id: string, goalData: Partial<SavingsGoal>) => {
    try {
      const response = await api.put<ApiResponse<SavingsGoal>>(
        `/savings/goals/${id}`,
        goalData
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  deleteGoal: async (id: string) => {
    try {
      await api.delete(`/savings/goals/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
