// Dashboard Main Components
export { default as DashboardMain } from './DashboardMain';

// Dashboard Layout Components
export { Sidebar } from './layout/Sidebar';
export { DashboardHeader } from './layout/DashboardHeader';

// Dashboard Pages
export {
  DashboardOverview,
  TransactionsPage,
  TransfersPage,
  VirtualCardsPage,
  DepositsPage,
  CurrencySwapPage,
  LoansPage,
  SettingsPage,
  SupportPage,
} from './pages';

// Shared UI Components
export {
  StatusBadge,
  StatCard,
  TransactionItem,
  FormInput,
  FormSelect,
  FormTextarea,
} from './shared';

export type {
  StatusBadgeProps,
  StatCardProps,
  TransactionItemProps,
  FormInputProps,
  FormSelectProps,
  FormTextareaProps,
} from './shared';

// Overview Sub-components
export { BalanceCard } from './pages/overview/BalanceCard';
export { QuickActions } from './pages/overview/QuickActions';
export { RecentTransactions } from './pages/overview/RecentTransactions';
export { SpendingChart } from './pages/overview/SpendingChart';
