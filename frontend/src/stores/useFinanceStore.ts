import { create } from 'zustand';
import { Card, CardTransaction, Deposit, ExchangeRate, Loan, LoanPayment, SavingsGoal } from './types';

interface FinanceStore {
  // Cards
  cards: Card[];
  cardTransactions: CardTransaction[];
  
  // Deposits
  deposits: Deposit[];
  
  // Currency
  exchangeRates: ExchangeRate[];
  
  // Loans
  loans: Loan[];
  loanPayments: LoanPayment[];
  
  // Savings
  savingsGoals: SavingsGoal[];
  
  isLoading: boolean;
  error: string | null;

  // Card actions
  setCards: (cards: Card[]) => void;
  updateCard: (card: Card) => void;
  addCard: (card: Card) => void;
  removeCard: (id: string) => void;
  setCardTransactions: (transactions: CardTransaction[]) => void;
  
  // Deposit actions
  setDeposits: (deposits: Deposit[]) => void;
  addDeposit: (deposit: Deposit) => void;
  
  // Currency actions
  setExchangeRates: (rates: ExchangeRate[]) => void;
  getExchangeRate: (from: string, to: string) => ExchangeRate | undefined;
  
  // Loan actions
  setLoans: (loans: Loan[]) => void;
  addLoan: (loan: Loan) => void;
  updateLoan: (loan: Loan) => void;
  setLoanPayments: (payments: LoanPayment[]) => void;
  addLoanPayment: (payment: LoanPayment) => void;
  
  // Savings Goal actions
  setSavingsGoals: (goals: SavingsGoal[]) => void;
  addSavingsGoal: (goal: SavingsGoal) => void;
  updateSavingsGoal: (goal: SavingsGoal) => void;
  removeSavingsGoal: (id: string) => void;
  
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useFinanceStore = create<FinanceStore>((set, get) => ({
  cards: [],
  cardTransactions: [],
  deposits: [],
  exchangeRates: [],
  loans: [],
  loanPayments: [],
  savingsGoals: [],
  isLoading: false,
  error: null,

  // Card actions
  setCards: (cards) => set({ cards }),
  
  updateCard: (card) =>
    set((state) => ({
      cards: state.cards.map((c) => (c.id === card.id ? card : c)),
    })),
  
  addCard: (card) =>
    set((state) => ({
      cards: [...state.cards, card],
    })),
  
  removeCard: (id) =>
    set((state) => ({
      cards: state.cards.filter((c) => c.id !== id),
    })),
  
  setCardTransactions: (transactions) => set({ cardTransactions: transactions }),
  
  // Deposit actions
  setDeposits: (deposits) => set({ deposits }),
  
  addDeposit: (deposit) =>
    set((state) => ({
      deposits: [deposit, ...state.deposits],
    })),
  
  // Currency actions
  setExchangeRates: (rates) => set({ exchangeRates: rates }),
  
  getExchangeRate: (from, to) => {
    const state = get();
    return state.exchangeRates.find(
      (rate) => rate.fromCurrency === from && rate.toCurrency === to
    );
  },
  
  // Loan actions
  setLoans: (loans) => set({ loans }),
  
  addLoan: (loan) =>
    set((state) => ({
      loans: [...state.loans, loan],
    })),
  
  updateLoan: (loan) =>
    set((state) => ({
      loans: state.loans.map((l) => (l.id === loan.id ? loan : l)),
    })),
  
  setLoanPayments: (payments) => set({ loanPayments: payments }),
  
  addLoanPayment: (payment) =>
    set((state) => ({
      loanPayments: [payment, ...state.loanPayments],
    })),
  
  // Savings Goal actions
  setSavingsGoals: (goals) => set({ savingsGoals: goals }),
  
  addSavingsGoal: (goal) =>
    set((state) => ({
      savingsGoals: [...state.savingsGoals, goal],
    })),
  
  updateSavingsGoal: (goal) =>
    set((state) => ({
      savingsGoals: state.savingsGoals.map((g) => (g.id === goal.id ? goal : g)),
    })),
  
  removeSavingsGoal: (id) =>
    set((state) => ({
      savingsGoals: state.savingsGoals.filter((g) => g.id !== id),
    })),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
}));
