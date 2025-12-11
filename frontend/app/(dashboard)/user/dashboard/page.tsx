'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBranding } from '@/contexts/BrandingContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowRightLeft,
  Send,
  Download,
  CreditCard,
  FileText,
  Bell,
  X,
  DollarSign,
  PiggyBank,
  Zap,
  ChevronRight,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Clock,
  Plus,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import toast from 'react-hot-toast';
import apiClient from '@/lib/api/client';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const pulseVariants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    transition: { duration: 2, repeat: Infinity }
  }
};

export default function EnhancedUserDashboard() {
  const router = useRouter();
  const { branding } = useBranding();
  const [balance, setBalance] = useState(0);
  const [displayBalance, setDisplayBalance] = useState(0);
  const [showBalance, setShowBalance] = useState(true);
  const [currency, setCurrency] = useState('USD');
  const [userName, setUserName] = useState('');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    pendingTransactions: 0,
    savings: 0,
    thisMonth: 0,
  });
  const [loading, setLoading] = useState(true);

  // Fetch real data from API
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch user data including wallet balance
      const userResponse = await apiClient.get('/auth/me');
      const userData = userResponse.data;
      const targetBalance = parseFloat(userData.wallet?.balance) || 0;
      const userCurrency = userData.wallet?.currency || userData.currency || 'USD';
      const userFirstName = userData.firstName || 'User';
      setBalance(targetBalance);
      setDisplayBalance(targetBalance); // Show immediately without animation
      setCurrency(userCurrency);
      setUserName(userFirstName);
      
      console.log('💰 User wallet balance:', targetBalance, userCurrency);

      // Fetch stats from backend
      try {
        const statsResponse = await apiClient.get('/transactions/stats');
        const statsData = statsResponse.data;

        // Also get latest 5 transactions for display
        const recentResponse = await apiClient.get('/transactions?limit=5');
        const recentData = recentResponse.data;

        if (Array.isArray(recentData)) {
          setTransactions(recentData.map((t: any) => {
            const amount = typeof t.signedAmount === 'number' ? t.signedAmount : Number(t.amount) || 0;
            return {
              id: t.id,
              type: t.type,
              description: t.description || t.type,
              amount,
              date: new Date(t.createdAt),
              status: t.status,
            };
          }));
        }

        setStats({
          totalIncome: Number(statsData.totalIncome) || 0,
          totalExpenses: Number(statsData.totalExpenses) || 0,
          pendingTransactions: Number(statsData.transactionCount) ? 0 : 0, // Simplified; pending not provided in stats
          savings: 0,
          thisMonth: Number(statsData.thisMonth ?? statsData.thisMonthNet ?? 0),
        });
      } catch (err) {
        console.error('Stats fetch failed:', err);
      }

      // Fetch notifications (optional - fail silently if endpoint doesn't exist)
      try {
        const notificationsResponse = await apiClient.get('/notifications?limit=3');
        const notificationsData = notificationsResponse.data;
        if (Array.isArray(notificationsData)) {
          setNotifications(notificationsData.map((n: any) => ({
            id: n.id,
            type: n.type.toLowerCase(),
            message: n.message,
            time: new Date(n.createdAt).toLocaleString(),
          })));
        }
      } catch (err: any) {
        // Silently ignore 404 - notifications feature not implemented
        if (err.response?.status !== 404) {
          console.error('Notifications fetch failed:', err);
        }
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    // Map currency codes to locale
    const localeMap: Record<string, string> = {
      'USD': 'en-US',
      'GBP': 'en-GB',
      'EUR': 'en-EU',
      'NGN': 'en-NG',
    };
    
    const locale = localeMap[currency] || 'en-US';
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const quickActions = [
    { icon: Send, label: 'Transfer Funds', color: 'blue', action: () => router.push('/user/transfer') },
    { icon: Download, label: 'Deposit', color: 'green', action: () => router.push('/user/deposit') },
    { icon: CreditCard, label: 'Virtual Cards', color: 'purple', action: () => router.push('/user/cards') },
    { icon: FileText, label: 'Apply for Loan', color: 'orange', action: () => router.push('/user/loans') },
  ];

  const dismissNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getTransactionIcon = (type: string, amount: number, status: string) => {
    if (status !== 'COMPLETED') return AlertCircle;
    return amount >= 0 ? TrendingUp : TrendingDown;
  };

  const getTransactionColor = (type: string, amount: number, status: string) => {
    if (status !== 'COMPLETED') {
      return 'text-gray-600 bg-gray-100';
    }
    return amount >= 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'PENDING': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'FAILED': return <AlertCircle className="w-4 h-4 text-red-600" />;
      default: return null;
    }
  };

  const getStatusLabel = (status: string) => {
    if (status === 'FAILED') return 'Rejected';
    if (status === 'PENDING') return 'Pending';
    if (status === 'COMPLETED') return 'Completed';
    return status;
  };

  return (
    <>      
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900 p-4 md:p-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto space-y-6"
        >
          {/* Header with animated gradient */}
          <motion.div variants={itemVariants} className="relative">
            <div className="relative z-10">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-extrabold mb-2"
              >
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                  Dashboard
                </span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-gray-600 dark:text-gray-300 text-lg"
              >
                Welcome back, <span className="font-semibold text-gray-800 dark:text-white">{userName || 'User'}</span>! Here's your financial overview.
              </motion.p>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-br from-pink-400/20 to-purple-400/20 rounded-full blur-2xl" />
          </motion.div>


          {/* Main Balance Card - Enhanced with glassmorphism */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card 
              className="relative overflow-hidden border-none shadow-2xl backdrop-blur-xl"
              style={{
                background: `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)`
              }}
            >
              {/* Animated background shapes */}
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 90, 0]
                }}
                transition={{ duration: 20, repeat: Infinity }}
                className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-2xl" 
              />
              <motion.div 
                animate={{ 
                  scale: [1, 1.3, 1],
                  rotate: [0, -90, 0]
                }}
                transition={{ duration: 15, repeat: Infinity }}
                className="absolute bottom-0 left-0 w-48 h-48 bg-pink-500/20 rounded-full -ml-24 -mb-24 blur-2xl" 
              />
              {/* Sparkle effect */}
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
              
              <CardContent className="relative p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-blue-100 text-sm font-medium mb-2">Total Balance</p>
                    <div className="flex items-center gap-4">
                      <motion.h2
                        key={displayBalance}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-bold text-white"
                      >
                        {showBalance ? formatCurrency(displayBalance) : '••••••'}
                      </motion.h2>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowBalance(!showBalance)}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition"
                      >
                        {showBalance ? (
                          <EyeOff className="w-5 h-5 text-white" />
                        ) : (
                          <Eye className="w-5 h-5 text-white" />
                        )}
                      </motion.button>
                    </div>
                  </div>
                  
                  <motion.div
                    variants={pulseVariants}
                    initial="initial"
                    animate="animate"
                    className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl"
                  >
                    <Wallet className="w-8 h-8 text-white" />
                  </motion.div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">
                  <motion.div 
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="p-4 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg"
                  >
                    <div className="flex items-center gap-2 text-emerald-200 text-sm mb-1 font-medium">
                      <TrendingUp className="w-4 h-4" />
                      <span>Income</span>
                    </div>
                    <p className="text-2xl md:text-3xl font-bold text-white">
                      {formatCurrency(stats.totalIncome)}
                    </p>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="p-4 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg"
                  >
                    <div className="flex items-center gap-2 text-rose-200 text-sm mb-1 font-medium">
                      <TrendingDown className="w-4 h-4" />
                      <span>Expenses</span>
                    </div>
                    <p className="text-2xl md:text-3xl font-bold text-white">
                      {formatCurrency(stats.totalExpenses)}
                    </p>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions - Enhanced cards */}
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Zap className="w-6 h-6 text-yellow-500" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.button
                    key={index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.08, y: -8, rotateY: 5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={action.action}
                    className="group relative p-6 bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border border-gray-200 dark:border-slate-700"
                  >
                    {/* Gradient overlay on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br from-${action.color}-500/10 via-${action.color}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300`} />
                    
                    <div className="relative">
                      <motion.div 
                        className={`p-3 bg-gradient-to-br from-${action.color}-100 to-${action.color}-50 dark:from-${action.color}-900/30 dark:to-${action.color}-800/20 rounded-xl inline-flex mb-3 shadow-sm`}
                        whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Icon className={`w-6 h-6 text-${action.color}-600 dark:text-${action.color}-400`} />
                      </motion.div>
                      <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">{action.label}</p>
                      <motion.div
                        className="flex items-center gap-1 mt-2"
                        initial={{ opacity: 0.5, x: 0 }}
                        whileHover={{ opacity: 1, x: 4 }}
                      >
                        <span className="text-xs text-gray-500 dark:text-gray-400">Go</span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </motion.div>
                    </div>
                    
                    {/* Shine effect on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:animate-shine" />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Stats Overview - Enhanced with gradients and animations */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div whileHover={{ scale: 1.03, y: -4 }} transition={{ type: "spring" }}>
              <Card className="border-none shadow-xl hover:shadow-2xl transition-all bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-slate-800 dark:to-slate-900 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                <CardContent className="p-6 relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Pending</p>
                      <p className="text-4xl font-extrabold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                        {stats.pendingTransactions}
                      </p>
                    </div>
                    <motion.div 
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="p-4 bg-gradient-to-br from-yellow-200 to-orange-200 dark:from-yellow-900/50 dark:to-orange-900/50 rounded-2xl shadow-lg"
                    >
                      <Clock className="w-8 h-8 text-yellow-700 dark:text-yellow-300" />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03, y: -4 }} transition={{ type: "spring" }}>
              <Card className="border-none shadow-xl hover:shadow-2xl transition-all bg-gradient-to-br from-emerald-50 to-green-50 dark:from-slate-800 dark:to-slate-900 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                <CardContent className="p-6 relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Savings</p>
                      <p className="text-4xl font-extrabold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                        {formatCurrency(stats.savings)}
                      </p>
                    </div>
                    <motion.div 
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="p-4 bg-gradient-to-br from-emerald-200 to-green-200 dark:from-emerald-900/50 dark:to-green-900/50 rounded-2xl shadow-lg"
                    >
                      <PiggyBank className="w-8 h-8 text-emerald-700 dark:text-emerald-300" />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03, y: -4 }} transition={{ type: "spring" }}>
              <Card className="border-none shadow-xl hover:shadow-2xl transition-all bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-900 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                <CardContent className="p-6 relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">This Month</p>
                      <p className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {formatCurrency(stats.thisMonth)}
                      </p>
                    </div>
                    <motion.div 
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="p-4 bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-900/50 dark:to-pink-900/50 rounded-2xl shadow-lg"
                    >
                      <Zap className="w-8 h-8 text-purple-700 dark:text-purple-300" />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Recent Transactions - Enhanced */}
          <motion.div variants={itemVariants}>
            <Card className="border-none shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader className="border-b dark:border-slate-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <ArrowRightLeft className="w-6 h-6 text-blue-600" />
                      Recent Transactions
                    </CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 font-medium">
                      Your latest activity
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push('/user/transactions')}
                    className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-2"
                  >
                    View All
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y dark:divide-slate-700">
                  {transactions.map((transaction, index) => {
                    const Icon = getTransactionIcon(transaction.type, transaction.amount, transaction.status);
                    const colorClass = getTransactionColor(transaction.type, transaction.amount, transaction.status);
                    
                    return (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ x: 4, backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                        className="p-5 cursor-pointer transition-all hover:shadow-md rounded-lg mx-2 my-1"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${colorClass}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {transaction.description}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {transaction.date.toLocaleDateString()}
                                </p>
                                {getStatusIcon(transaction.status)}
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className={`text-lg font-bold ${
                              transaction.status !== 'COMPLETED'
                                ? 'text-gray-500 dark:text-gray-400'
                                : transaction.amount >= 0
                                  ? 'text-green-600 dark:text-green-400'
                                  : 'text-red-600 dark:text-red-400'
                            }`}>
                              {transaction.status === 'COMPLETED' && transaction.amount >= 0 ? '+' : ''}
                              {formatCurrency(transaction.amount)}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {getStatusLabel(transaction.status)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Floating Action Button (Mobile) */}
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="md:hidden fixed bottom-6 right-6 p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl z-50"
          >
            <Plus className="w-6 h-6" />
          </motion.button>
        </motion.div>
      </div>
    </>
  );
}

