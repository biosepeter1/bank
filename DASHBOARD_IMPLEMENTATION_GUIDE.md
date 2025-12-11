# 🎯 User Dashboard Implementation Guide

## Overview

This guide details the implementation of a comprehensive user dashboard with 9 major feature sections, supporting infrastructure, and best practices for the RDN Banking Platform.

---

## 1. Dashboard Architecture

### Component Hierarchy

```
Dashboard (main page)
├── Header (Greeting + Time)
├── StatsCards (Balance, Income, Expenses)
├── MainCards
│   ├── QuickTransfer
│   ├── RecentTransactions
│   └── NotificationsDrawer
├── Charts (Animated Recharts)
├── FeatureTabs
│   ├── AccountSummary
│   ├── FundTransfers
│   ├── VirtualCards
│   ├── LoansGrants
│   ├── DepositFunds
│   ├── CurrencySwap
│   ├── Settings
│   └── Support
└── Footer (Help + Legal)
```

### State Management Flow

```
Zustand Stores (Root)
├── authStore         → User identity, permissions
├── walletStore       → Balance, accounts, currency
├── transactionStore  → Recent transactions, history
├── cardStore         → User cards, card requests
├── loanStore         → Loan applications, grants
├── settingsStore     → User preferences, theme
└── notificationStore → Alerts, messages

Each store updates independently with optimistic UI
```

---

## 2. Core Components Implementation

### 2.1 Enhanced Dashboard Overview

**File**: `frontend/app/(dashboard)/user/dashboard/page.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useWalletStore } from '@/stores/walletStore';
import { useNotificationStore } from '@/stores/notificationStore';
import Header from '@/components/dashboard/Header';
import StatsCards from '@/components/dashboard/StatsCards';
import QuickActionCards from '@/components/dashboard/QuickActionCards';
import RecentTransactionsWidget from '@/components/dashboard/RecentTransactionsWidget';
import NotificationsDrawer from '@/components/dashboard/NotificationsDrawer';
import ChartsWidget from '@/components/dashboard/ChartsWidget';

export default function UserDashboard() {
  const { user } = useAuthStore();
  const { wallet, fetchWallet } = useWalletStore();
  const { notifications, unreadCount } = useNotificationStore();
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchWallet(),
          // Fetch transactions, notifications, etc.
        ]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6 pb-20">
      <Header userName={user?.firstName} unreadNotifications={unreadCount} />
      
      <StatsCards wallet={wallet} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <QuickActionCards />
          <ChartsWidget />
          <RecentTransactionsWidget />
        </div>
        <aside>
          <NotificationsDrawer 
            notifications={notifications}
            onOpenChange={setDrawerOpen}
          />
        </aside>
      </div>
    </div>
  );
}
```

### 2.2 Header Component with Greeting

**File**: `frontend/components/dashboard/Header.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SessionTimer from '@/components/dashboard/SessionTimer';

interface HeaderProps {
  userName: string;
  unreadNotifications: number;
}

export default function Header({ userName, unreadNotifications }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [greeting, setGreeting] = useState<string>('');

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) setGreeting('Good Morning');
      else if (hour < 18) setGreeting('Good Afternoon');
      else setGreeting('Good Evening');

      setCurrentTime(new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }));
    };

    updateGreeting();
    const timer = setInterval(updateGreeting, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          {greeting}, {userName}! 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })} • {currentTime}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <SessionTimer />
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadNotifications > 0 && (
            <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
              {unreadNotifications}
            </span>
          )}
        </Button>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
```

### 2.3 Stats Cards Component

**File**: `frontend/components/dashboard/StatsCards.tsx`

```typescript
'use client';

import { Wallet, TrendingUp, TrendingDown, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useCurrency } from '@/lib/hooks/useCurrency';

interface StatsCardsProps {
  wallet: any;
}

export default function StatsCards({ wallet }: StatsCardsProps) {
  const { formatAmount, currency } = useCurrency();
  const [balanceVisible, setBalanceVisible] = useState(true);

  const stats = [
    {
      title: 'Total Balance',
      value: wallet?.balance || 0,
      icon: Wallet,
      color: 'bg-blue-500',
      trend: null,
    },
    {
      title: 'Total Income',
      value: wallet?.totalIncome || 0,
      icon: TrendingUp,
      color: 'bg-green-500',
      trend: '+12.5%',
    },
    {
      title: 'Total Expenses',
      value: wallet?.totalExpenses || 0,
      icon: TrendingDown,
      color: 'bg-red-500',
      trend: '-5.2%',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, idx) => (
        <Card key={idx} className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {stat.title}
            </CardTitle>
            <div className={`${stat.color} p-2 rounded-lg`}>
              <stat.icon className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {balanceVisible ? formatAmount(stat.value) : '••••••'}
                </div>
                {stat.trend && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    {stat.trend} this month
                  </p>
                )}
              </div>
              {stat.title === 'Total Balance' && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setBalanceVisible(!balanceVisible)}
                >
                  {balanceVisible ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

### 2.4 Notifications Drawer

**File**: `frontend/components/dashboard/NotificationsDrawer.tsx`

```typescript
'use client';

import { useState } from 'react';
import { X, Trash2, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNotificationStore } from '@/stores/notificationStore';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationsDrawerProps {
  notifications: any[];
  onOpenChange?: (open: boolean) => void;
}

export default function NotificationsDrawer({
  notifications,
  onOpenChange,
}: NotificationsDrawerProps) {
  const [open, setOpen] = useState(false);
  const { markAsRead, deleteNotification } = useNotificationStore();

  const handleOpen = () => {
    setOpen(!open);
    onOpenChange?.(!open);
  };

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, JSX.Element> = {
      SUCCESS: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      WARNING: <AlertCircle className="h-5 w-5 text-yellow-500" />,
      ERROR: <XCircle className="h-5 w-5 text-red-500" />,
      INFO: <Info className="h-5 w-5 text-blue-500" />,
    };
    return icons[type] || icons.INFO;
  };

  return (
    <>
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">
            Notifications ({notifications.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <AnimatePresence>
            {notifications.slice(0, 5).map((notif) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {notif.title}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                    {notif.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notif.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteNotification(notif.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
          {notifications.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              No notifications yet
            </p>
          )}
        </CardContent>
      </Card>
    </>
  );
}
```

---

## 3. Fund Transfers Module

### 3.1 Transfer Store (Zustand)

**File**: `frontend/stores/transferStore.ts`

```typescript
import { create } from 'zustand';
import { transferApi } from '@/lib/api/transfers';

interface BeneficiaryAccount {
  id: string;
  name: string;
  accountNumber: string;
  bankName: string;
  bankCode?: string;
  swiftCode?: string;
  type: 'INTERNAL' | 'DOMESTIC' | 'INTERNATIONAL';
}

interface TransferState {
  beneficiaries: BeneficiaryAccount[];
  pendingTransfers: any[];
  fetchBeneficiaries: () => Promise<void>;
  addBeneficiary: (data: Partial<BeneficiaryAccount>) => Promise<void>;
  deleteBeneficiary: (id: string) => Promise<void>;
  initiateTransfer: (data: any) => Promise<any>;
  validateTransferCodes: (codes: string[]) => Promise<boolean>;
}

export const useTransferStore = create<TransferState>((set) => ({
  beneficiaries: [],
  pendingTransfers: [],

  fetchBeneficiaries: async () => {
    try {
      const data = await transferApi.getBeneficiaries();
      set({ beneficiaries: data });
    } catch (error) {
      console.error('Error fetching beneficiaries:', error);
    }
  },

  addBeneficiary: async (data) => {
    try {
      const newBenef = await transferApi.createBeneficiary(data);
      set((state) => ({
        beneficiaries: [...state.beneficiaries, newBenef],
      }));
    } catch (error) {
      throw error;
    }
  },

  deleteBeneficiary: async (id) => {
    try {
      await transferApi.deleteBeneficiary(id);
      set((state) => ({
        beneficiaries: state.beneficiaries.filter((b) => b.id !== id),
      }));
    } catch (error) {
      throw error;
    }
  },

  initiateTransfer: async (data) => {
    try {
      const result = await transferApi.initiateTransfer(data);
      return result;
    } catch (error) {
      throw error;
    }
  },

  validateTransferCodes: async (codes) => {
    try {
      return await transferApi.validateCodes(codes);
    } catch (error) {
      return false;
    }
  },
}));
```

### 3.2 Transfer Tabs Component

**File**: `frontend/components/dashboard/tabs/TransfersTab.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LocalTransferForm from './LocalTransferForm';
import InternationalTransferForm from './InternationalTransferForm';
import BeneficiaryManager from './BeneficiaryManager';

export default function TransfersTab() {
  const [activeTab, setActiveTab] = useState('local');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="local">Local Transfer</TabsTrigger>
        <TabsTrigger value="international">International</TabsTrigger>
        <TabsTrigger value="beneficiaries">Beneficiaries</TabsTrigger>
      </TabsList>

      <TabsContent value="local" className="space-y-6">
        <LocalTransferForm />
      </TabsContent>

      <TabsContent value="international" className="space-y-6">
        <InternationalTransferForm />
      </TabsContent>

      <TabsContent value="beneficiaries" className="space-y-6">
        <BeneficiaryManager />
      </TabsContent>
    </Tabs>
  );
}
```

### 3.3 Local Transfer Form

**File**: `frontend/components/dashboard/tabs/LocalTransferForm.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransferStore } from '@/stores/transferStore';
import TransferReviewModal from '@/components/modals/TransferReviewModal';
import toast from 'react-hot-toast';

const localTransferSchema = z.object({
  recipientEmail: z.string().email('Invalid email'),
  amount: z.number().positive('Amount must be positive'),
  description: z.string().optional(),
});

type LocalTransferForm = z.infer<typeof localTransferSchema>;

export default function LocalTransferForm() {
  const { initiateTransfer } = useTransferStore();
  const [showReview, setShowReview] = useState(false);
  const [formData, setFormData] = useState<LocalTransferForm | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<LocalTransferForm>({
    resolver: zodResolver(localTransferSchema),
  });

  const handleSubmit = (data: LocalTransferForm) => {
    setFormData(data);
    setShowReview(true);
  };

  const handleConfirm = async () => {
    if (!formData) return;
    setLoading(true);
    try {
      await initiateTransfer({
        ...formData,
        transferType: 'INTERNAL',
      });
      toast.success('Transfer initiated successfully!');
      setShowReview(false);
      form.reset();
    } catch (error) {
      toast.error('Transfer failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Send Money to Another User</CardTitle>
          <CardDescription>
            Transfer funds to other RDN Banking Platform users instantly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Recipient Email</label>
              <Input
                placeholder="recipient@example.com"
                {...form.register('recipientEmail')}
              />
              {form.formState.errors.recipientEmail && (
                <p className="text-xs text-red-500 mt-1">
                  {form.formState.errors.recipientEmail.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Amount</label>
              <Input
                type="number"
                placeholder="0.00"
                step="0.01"
                {...form.register('amount', { valueAsNumber: true })}
              />
              {form.formState.errors.amount && (
                <p className="text-xs text-red-500 mt-1">
                  {form.formState.errors.amount.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Description (Optional)</label>
              <Input
                placeholder="Add a note about this transfer"
                {...form.register('description')}
              />
            </div>

            <Button type="submit" className="w-full">
              Review Transfer
            </Button>
          </form>
        </CardContent>
      </Card>

      {showReview && formData && (
        <TransferReviewModal
          transfer={formData}
          onConfirm={handleConfirm}
          onCancel={() => setShowReview(false)}
          loading={loading}
        />
      )}
    </>
  );
}
```

---

## 4. Virtual Cards Management

### 4.1 Cards Store

**File**: `frontend/stores/cardStore.ts`

```typescript
import { create } from 'zustand';
import { cardsApi } from '@/lib/api/cards';

interface CardState {
  cards: any[];
  cardRequests: any[];
  fetchCards: () => Promise<void>;
  fetchCardRequests: () => Promise<void>;
  requestCard: (type: string, currency: string) => Promise<void>;
  freezeCard: (cardId: string) => Promise<void>;
  unfreezeCard: (cardId: string) => Promise<void>;
}

export const useCardStore = create<CardState>((set) => ({
  cards: [],
  cardRequests: [],

  fetchCards: async () => {
    try {
      const data = await cardsApi.getCards();
      set({ cards: data });
    } catch (error) {
      console.error('Error fetching cards:', error);
    }
  },

  fetchCardRequests: async () => {
    try {
      const data = await cardsApi.getCardRequests();
      set({ cardRequests: data });
    } catch (error) {
      console.error('Error fetching card requests:', error);
    }
  },

  requestCard: async (type, currency) => {
    try {
      const newRequest = await cardsApi.requestCard({ type, currency });
      set((state) => ({
        cardRequests: [...state.cardRequests, newRequest],
      }));
    } catch (error) {
      throw error;
    }
  },

  freezeCard: async (cardId) => {
    try {
      await cardsApi.freezeCard(cardId);
      set((state) => ({
        cards: state.cards.map((card) =>
          card.id === cardId ? { ...card, status: 'BLOCKED' } : card
        ),
      }));
    } catch (error) {
      throw error;
    }
  },

  unfreezeCard: async (cardId) => {
    try {
      await cardsApi.unfreezeCard(cardId);
      set((state) => ({
        cards: state.cards.map((card) =>
          card.id === cardId ? { ...card, status: 'ACTIVE' } : card
        ),
      }));
    } catch (error) {
      throw error;
    }
  },
}));
```

### 4.2 Virtual Cards Display Component

**File**: `frontend/components/dashboard/tabs/VirtualCardsTab.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useCardStore } from '@/stores/cardStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Lock, Unlock, Eye, EyeOff } from 'lucide-react';
import CardRequestModal from '@/components/modals/CardRequestModal';
import VirtualCardDisplay from '@/components/cards/VirtualCardDisplay';
import { motion } from 'framer-motion';

export default function VirtualCardsTab() {
  const { cards, cardRequests, fetchCards, freezeCard, unfreezeCard } = useCardStore();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [revealedCardId, setRevealedCardId] = useState<string | null>(null);

  useEffect(() => {
    fetchCards();
  }, []);

  const handleFreeze = async (cardId: string) => {
    try {
      await freezeCard(cardId);
    } catch (error) {
      console.error('Error freezing card:', error);
    }
  };

  const handleUnfreeze = async (cardId: string) => {
    try {
      await unfreezeCard(cardId);
    } catch (error) {
      console.error('Error unfreezing card:', error);
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Request Card Button */}
        <Button
          onClick={() => setShowRequestModal(true)}
          className="w-full md:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Request New Card
        </Button>

        {/* Cards Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, idx) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <VirtualCardDisplay
                card={card}
                isRevealed={revealedCardId === card.id}
                onRevealToggle={() =>
                  setRevealedCardId(
                    revealedCardId === card.id ? null : card.id
                  )
                }
                onFreeze={() => handleFreeze(card.id)}
                onUnfreeze={() => handleUnfreeze(card.id)}
              />
            </motion.div>
          ))}
        </div>

        {/* Pending Requests */}
        {cardRequests.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Pending Requests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {cardRequests.map((request) => (
                <div key={request.id} className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{request.cardType}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      Requested {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-xs bg-yellow-200 dark:bg-yellow-800 px-2 py-1 rounded">
                    {request.status}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {showRequestModal && (
        <CardRequestModal onClose={() => setShowRequestModal(false)} />
      )}
    </>
  );
}
```

### 4.3 Virtual Card Display with Blur Animation

**File**: `frontend/components/cards/VirtualCardDisplay.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Eye, EyeOff, Lock, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface VirtualCardDisplayProps {
  card: any;
  isRevealed: boolean;
  onRevealToggle: () => void;
  onFreeze: () => void;
  onUnfreeze: () => void;
}

export default function VirtualCardDisplay({
  card,
  isRevealed,
  onRevealToggle,
  onFreeze,
  onUnfreeze,
}: VirtualCardDisplayProps) {
  const isFrozen = card.status === 'BLOCKED';

  return (
    <motion.div
      className="relative h-52 rounded-xl overflow-hidden"
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Card Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${
          card.cardType === 'VIRTUAL'
            ? 'from-blue-600 to-blue-800'
            : 'from-purple-600 to-purple-800'
        }`}
      />

      {/* Card Content */}
      <div className="relative p-6 h-full flex flex-col justify-between text-white">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs opacity-75">Card Type</p>
            <p className="text-sm font-semibold">{card.cardType}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            isFrozen
              ? 'bg-red-500/30 text-red-200'
              : 'bg-green-500/30 text-green-200'
          }`}>
            {isFrozen ? 'FROZEN' : 'ACTIVE'}
          </div>
        </div>

        {/* Card Number */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-2"
        >
          <p className="text-xs opacity-75">Card Number</p>
          <motion.div
            animate={{
              filter: isRevealed ? 'blur(0px)' : 'blur(10px)',
            }}
            transition={{ duration: 0.4 }}
            className="font-mono text-lg tracking-widest"
          >
            {card.cardNumber} •••• •••• ••••
          </motion.div>
        </motion.div>

        {/* Footer */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs opacity-75">Expires</p>
            <p className="font-mono">
              {String(card.expiryMonth).padStart(2, '0')}/
              {String(card.expiryYear).slice(-2)}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onRevealToggle}
              className="text-white hover:bg-white/20"
            >
              {isRevealed ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={isFrozen ? onUnfreeze : onFreeze}
              className="text-white hover:bg-white/20"
            >
              {isFrozen ? (
                <Unlock className="h-4 w-4" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
```

---

## 5. Settings & Profile Management

### 5.1 Settings Store

**File**: `frontend/stores/settingsStore.ts`

```typescript
import { create } from 'zustand';
import { profileApi } from '@/lib/api/profile';

interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  twoFactorEnabled: boolean;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setLanguage: (lang: string) => void;
  updateNotificationPreferences: (prefs: any) => Promise<void>;
  enableTwoFactor: () => Promise<string>; // Returns QR code
  confirmTwoFactor: (code: string) => Promise<boolean>;
  disableTwoFactor: (password: string) => Promise<boolean>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  theme: 'system',
  language: 'en',
  notifications: {
    email: true,
    sms: true,
    push: true,
  },
  twoFactorEnabled: false,

  setTheme: (theme) => {
    set({ theme });
    localStorage.setItem('theme', theme);
  },

  setLanguage: (lang) => {
    set({ language: lang });
    localStorage.setItem('language', lang);
  },

  updateNotificationPreferences: async (prefs) => {
    try {
      await profileApi.updateNotifications(prefs);
      set({ notifications: prefs });
    } catch (error) {
      throw error;
    }
  },

  enableTwoFactor: async () => {
    try {
      const { qrCode } = await profileApi.generateTwoFactorQR();
      return qrCode;
    } catch (error) {
      throw error;
    }
  },

  confirmTwoFactor: async (code) => {
    try {
      const result = await profileApi.verifyTwoFactorCode(code);
      set({ twoFactorEnabled: true });
      return result;
    } catch (error) {
      return false;
    }
  },

  disableTwoFactor: async (password) => {
    try {
      const result = await profileApi.disableTwoFactor(password);
      set({ twoFactorEnabled: false });
      return result;
    } catch (error) {
      return false;
    }
  },
}));
```

### 5.2 Settings Tab Component

**File**: `frontend/components/dashboard/tabs/SettingsTab.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileSettings from './ProfileSettings';
import SecuritySettings from './SecuritySettings';
import PreferencesSettings from './PreferencesSettings';
import KYCPanel from './KYCPanel';

export default function SettingsTab() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="preferences">Preferences</TabsTrigger>
        <TabsTrigger value="kyc">KYC</TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <ProfileSettings />
      </TabsContent>

      <TabsContent value="security">
        <SecuritySettings />
      </TabsContent>

      <TabsContent value="preferences">
        <PreferencesSettings />
      </TabsContent>

      <TabsContent value="kyc">
        <KYCPanel />
      </TabsContent>
    </Tabs>
  );
}
```

### 5.3 Security Settings Component

**File**: `frontend/components/dashboard/tabs/SecuritySettings.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSettingsStore } from '@/stores/settingsStore';
import { Switch } from '@/components/ui/switch';
import TwoFactorModal from '@/components/modals/TwoFactorModal';
import toast from 'react-hot-toast';

export default function SecuritySettings() {
  const { twoFactorEnabled, enableTwoFactor, disableTwoFactor } = useSettingsStore();
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const handleChangePassword = async (data: any) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // Call API to change password
      toast.success('Password changed successfully');
      form.reset();
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTwoFactor = async () => {
    if (!twoFactorEnabled) {
      setShowTwoFactorModal(true);
    } else {
      // Show password confirmation dialog for disabling
      try {
        await disableTwoFactor('');
        toast.success('Two-factor authentication disabled');
      } catch (error) {
        toast.error('Failed to disable 2FA');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(handleChangePassword)} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Current Password</label>
              <Input
                type="password"
                {...form.register('currentPassword')}
              />
            </div>
            <div>
              <label className="text-sm font-medium">New Password</label>
              <Input
                type="password"
                {...form.register('newPassword')}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Confirm Password</label>
              <Input
                type="password"
                {...form.register('confirmPassword')}
              />
            </div>
            <Button type="submit" loading={loading}>
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">
              Status: {twoFactorEnabled ? '🔒 Enabled' : '🔓 Disabled'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {twoFactorEnabled
                ? 'Your account is protected with 2FA'
                : 'Enable 2FA for enhanced security'}
            </p>
          </div>
          <Switch
            checked={twoFactorEnabled}
            onCheckedChange={handleToggleTwoFactor}
          />
        </CardContent>
      </Card>

      {showTwoFactorModal && (
        <TwoFactorModal
          onClose={() => setShowTwoFactorModal(false)}
          onComplete={() => {
            setShowTwoFactorModal(false);
            toast.success('Two-factor authentication enabled');
          }}
        />
      )}
    </div>
  );
}
```

---

## 6. Backend API Endpoints Needed

### 6.1 New Endpoints to Implement

```bash
# Transfers
POST   /transfers/local           # Local transfers
POST   /transfers/international   # International transfers
GET    /transfers/beneficiaries   # Get all beneficiaries
POST   /transfers/beneficiaries   # Add beneficiary
DELETE /transfers/beneficiaries/:id # Remove beneficiary
POST   /transfers/validate-codes  # Validate IMF/TAX/COT codes

# Loans & Grants
POST   /loans/apply               # Submit loan application
GET    /loans/applications        # Get user's loan applications
POST   /grants/apply              # Submit grant request
GET    /grants/requests           # Get grant requests

# Deposits
POST   /deposits/initiate         # Initiate deposit via payment gateway
POST   /deposits/webhook          # Webhook for payment confirmation
GET    /deposits/history          # Get deposit history

# Currency Exchange
POST   /currency/exchange-rate    # Get current exchange rate
POST   /currency/swap             # Execute currency swap
GET    /currency/rates            # Get all rates

# Profile & Settings
PATCH  /profile/update            # Update profile info
POST   /profile/picture           # Upload profile picture
POST   /profile/2fa/generate      # Generate 2FA QR
POST   /profile/2fa/verify        # Verify 2FA code
DELETE /profile/2fa               # Disable 2FA
PATCH  /profile/preferences       # Update notification preferences

# Cards
POST   /cards/request             # Request new card
GET    /cards/requests            # Get card requests
PATCH  /cards/:id/freeze          # Freeze card
PATCH  /cards/:id/unfreeze        # Unfreeze card

# Support
POST   /support/tickets           # Create support ticket
GET    /support/tickets           # Get user's tickets
POST   /support/tickets/:id/reply # Reply to ticket
```

### 6.2 API Client Updates

**File**: `frontend/lib/api/transfers.ts`

```typescript
import apiClient from './client';

export const transferApi = {
  initiateTransfer: async (data: any) => {
    const response = await apiClient.post('/transfers/local', data);
    return response.data;
  },

  getBeneficiaries: async () => {
    const response = await apiClient.get('/transfers/beneficiaries');
    return response.data;
  },

  createBeneficiary: async (data: any) => {
    const response = await apiClient.post('/transfers/beneficiaries', data);
    return response.data;
  },

  deleteBeneficiary: async (id: string) => {
    await apiClient.delete(`/transfers/beneficiaries/${id}`);
  },

  validateCodes: async (codes: string[]) => {
    const response = await apiClient.post('/transfers/validate-codes', { codes });
    return response.data.valid;
  },
};
```

---

## 7. Reusable UI Components Needed

### Components Checklist:
- [ ] `NotificationBell` - Notification dropdown
- [ ] `SessionTimer` - Login session countdown
- [ ] `ThemeToggle` - Dark/Light mode switcher
- [ ] `ProgressBar` - Animated transfer progress
- [ ] `ConfirmationModal` - Generic confirmation dialog
- [ ] `SuccessNotification` - Success toast with transaction ref
- [ ] `LoadingSkeletons` - Multiple loading states
- [ ] `EmptyState` - Empty list placeholder
- [ ] `ErrorBoundary` - Error handling wrapper
- [ ] `AnimatedNumber` - Number counter animation

---

## 8. Deployment & Testing Checklist

### Frontend Testing
- [ ] Desktop responsiveness (1920px, 1440px, 1024px)
- [ ] Mobile responsiveness (375px, 414px)
- [ ] Dark mode functionality
- [ ] Keyboard navigation
- [ ] Screen reader compatibility (axe DevTools)
- [ ] All animations smooth (60fps)

### Backend Testing
- [ ] All endpoints return proper status codes
- [ ] Proper error handling with meaningful messages
- [ ] Rate limiting on sensitive endpoints
- [ ] Transfer codes validation
- [ ] Payment webhook verification
- [ ] Concurrent transaction handling

### Performance
- [ ] Dashboard loads <2s
- [ ] Images optimized with Next.js Image
- [ ] API calls debounced/throttled
- [ ] Zustand stores subscriptions cleaned up
- [ ] Code splitting for lazy-loaded tabs

---

## 9. Implementation Priority

### Phase 1 (Week 1)
- [ ] Enhanced dashboard overview + Header
- [ ] Stats cards + Notifications drawer
- [ ] Update wallet store

### Phase 2 (Week 2)
- [ ] Local transfers + Beneficiary manager
- [ ] Virtual cards display + Request modal
- [ ] Backend transfer endpoints

### Phase 3 (Week 3)
- [ ] International transfers + Transfer codes validation
- [ ] Deposits + Payment gateway integration
- [ ] Currency swap

### Phase 4 (Week 4)
- [ ] Settings + Profile management + 2FA
- [ ] Loans & Grants
- [ ] Support & Communication
- [ ] Testing + Optimization

---

## 10. File Structure Summary

```
frontend/
├── app/(dashboard)/user/
│   ├── dashboard/
│   │   ├── page.tsx              # Main dashboard
│   │   └── layout.tsx
│   ├── wallet/
│   ├── transactions/
│   ├── cards/
│   ├── loans/
│   ├── deposits/
│   ├── settings/
│   └── support/
├── components/
│   ├── dashboard/
│   │   ├── Header.tsx
│   │   ├── StatsCards.tsx
│   │   ├── QuickActionCards.tsx
│   │   ├── RecentTransactionsWidget.tsx
│   │   ├── NotificationsDrawer.tsx
│   │   ├── ChartsWidget.tsx
│   │   ├── SessionTimer.tsx
│   │   └── tabs/
│   │       ├── TransfersTab.tsx
│   │       ├── VirtualCardsTab.tsx
│   │       ├── SettingsTab.tsx
│   │       └── LoansTab.tsx
│   ├── modals/
│   │   ├── TransferReviewModal.tsx
│   │   ├── CardRequestModal.tsx
│   │   ├── TwoFactorModal.tsx
│   │   └── ConfirmationModal.tsx
│   ├── cards/
│   │   └── VirtualCardDisplay.tsx
│   └── forms/
│       ├── ProfileForm.tsx
│       └── SecurityForm.tsx
├── stores/
│   ├── authStore.ts
│   ├── walletStore.ts
│   ├── transferStore.ts
│   ├── cardStore.ts
│   ├── loanStore.ts
│   ├── settingsStore.ts
│   └── notificationStore.ts
├── lib/
│   ├── api/
│   │   ├── transfers.ts
│   │   ├── loans.ts
│   │   ├── deposits.ts
│   │   ├── currency.ts
│   │   └── support.ts
│   └── hooks/
│       ├── useCurrency.ts
│       └── useNotifications.ts
```

---

## Quick Start: Implement Dashboard Enhancement

```bash
# 1. Create store files
touch frontend/stores/{walletStore,transferStore,cardStore,loanStore,settingsStore,notificationStore}.ts

# 2. Create component directories
mkdir -p frontend/components/{dashboard/tabs,modals,cards,forms}

# 3. Create API files
touch frontend/lib/api/{transfers,loans,deposits,currency,support}.ts

# 4. Start building components incrementally
# Focus on Header → StatsCards → NotificationsDrawer first

# 5. Test with backend by running
npm run backend  # Terminal 1
npm run frontend # Terminal 2
```

---

**Total Estimated Development Time**: 4 weeks (Phase 1-4)
**Team Size**: 2-3 frontend developers + 1-2 backend developers
**Core Dependencies**: Already installed (React Hook Form, Zod, Recharts, Framer Motion, shadcn/ui)
