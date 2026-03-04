// ============================================
// USER & AUTHENTICATION TYPES
// ============================================
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  accountStatus: 'active' | 'inactive' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
}

export interface Account {
  id: string;
  userId: string;
  accountNumber: string;
  accountType: 'checking' | 'savings' | 'money-market';
  currency: string;
  balance: number;
  status: 'active' | 'frozen' | 'closed';
  createdAt: Date;
}

// ============================================
// TRANSACTION TYPES
// ============================================
export interface Transaction {
  id: string;
  accountId: string;
  type: 'debit' | 'credit';
  amount: number;
  currency: string;
  description: string;
  category: string;
  status: 'completed' | 'pending' | 'failed';
  date: Date;
  recipient?: string;
  reference?: string;
  metadata?: Record<string, any>;
}

export interface TransactionFilter {
  type?: 'debit' | 'credit';
  category?: string;
  status?: 'completed' | 'pending' | 'failed';
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  searchQuery?: string;
}

// ============================================
// TRANSFER TYPES
// ============================================
export interface Transfer {
  id: string;
  fromAccountId: string;
  toAccountId?: string;
  recipientName: string;
  recipientBank?: string;
  recipientAccount: string;
  amount: number;
  currency: string;
  type: 'local' | 'international';
  status: 'completed' | 'pending' | 'failed';
  fee: number;
  date: Date;
  reference: string;
}

export interface Beneficiary {
  id: string;
  userId: string;
  name: string;
  accountNumber: string;
  bankName?: string;
  bankCode?: string;
  country?: string;
  isFrequent: boolean;
  createdAt: Date;
}

// ============================================
// CARD TYPES
// ============================================
export interface Card {
  id: string;
  accountId: string;
  cardNumber: string;
  cardType: 'virtual' | 'physical';
  cardBrand: 'visa' | 'mastercard' | 'amex';
  holderName: string;
  expiryDate: string;
  cvv?: string;
  status: 'active' | 'frozen' | 'expired' | 'canceled';
  dailyLimit: number;
  monthlyLimit: number;
  transactionLimit?: number;
  createdAt: Date;
}

export interface CardTransaction {
  id: string;
  cardId: string;
  merchant: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'declined';
  date: Date;
  category: string;
}

// ============================================
// DEPOSIT TYPES
// ============================================
export interface Deposit {
  id: string;
  accountId: string;
  amount: number;
  currency: string;
  paymentMethod: 'bank-transfer' | 'card' | 'wallet' | 'crypto';
  status: 'completed' | 'pending' | 'failed';
  reference: string;
  date: Date;
  fee: number;
}

// ============================================
// CURRENCY TYPES
// ============================================
export interface ExchangeRate {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  updatedAt: Date;
  bid?: number;
  ask?: number;
}

export interface CurrencyConversion {
  fromAmount: number;
  fromCurrency: string;
  toAmount: number;
  toCurrency: string;
  rate: number;
  fee?: number;
  total?: number;
  timestamp: Date;
}

// ============================================
// LOAN TYPES
// ============================================
export interface Loan {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  interestRate: number;
  term: number; // in months
  status: 'active' | 'completed' | 'defaulted' | 'pending';
  monthlyPayment: number;
  totalPayment: number;
  paidAmount: number;
  startDate: Date;
  endDate: Date;
  nextPaymentDate?: Date;
  purpose?: string;
}

export interface LoanPayment {
  id: string;
  loanId: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: Date;
  dueDate: Date;
  reference: string;
}

// ============================================
// SETTINGS TYPES
// ============================================
export interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  newsletter: boolean;
  transactions: boolean;
  transfers: boolean;
  deposits: boolean;
  loans: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  twoFactorMethod?: 'email' | 'sms' | 'authenticator';
  biometricEnabled: boolean;
  loginAlerts: boolean;
  deviceManagement: DeviceInfo[];
}

export interface DeviceInfo {
  id: string;
  name: string;
  type: 'mobile' | 'desktop' | 'tablet';
  lastLogin: Date;
  ipAddress: string;
  isCurrentDevice: boolean;
}

export interface UserSettings {
  userId: string;
  theme: 'light' | 'dark' | 'auto';
  language: string;
  currency: string;
  timezone: string;
  dateFormat: string;
  notifications: NotificationSettings;
  security: SecuritySettings;
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    showBalance: boolean;
    allowNotifications: boolean;
  };
}

// ============================================
// SAVINGS GOAL TYPES
// ============================================
export interface SavingsGoal {
  id: string;
  userId: string;
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  targetDate: Date;
  category: string;
  icon?: string;
  createdAt: Date;
}

// ============================================
// NOTIFICATION TYPES
// ============================================
export interface Notification {
  id: string;
  userId: string;
  type: 'transaction' | 'transfer' | 'alert' | 'promotion' | 'security';
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: Date;
}

// ============================================
// API RESPONSE TYPES
// ============================================
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  error?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  status: number;
  message: string;
  code: string;
  details?: Record<string, any>;
}
