'use client';

import { useEffect, useState } from 'react';
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
  const [balance, setBalance] = useState(0);
  const [displayBalance, setDisplayBalance] = useState(0);
  const [showBalance, setShowBalance] = useState(true);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'success', message: 'Deposit of $500 successful', time: '2 mins ago' },
    { id: 2, type: 'warning', message: 'Low balance alert', time: '1 hour ago' },
    { id: 3, type: 'info', message: 'New feature: Currency Swap', time: '3 hours ago' },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'DEPOSIT', description: 'Salary Payment', amount: 5000, date: new Date(), status: 'COMPLETED' },
    { id: 2, type: 'WITHDRAWAL', description: 'ATM Withdrawal', amount: 200, date: new Date(), status: 'COMPLETED' },
    { id: 3, type: 'TRANSFER', description: 'Transfer to John Doe', amount: 150, date: new Date(), status: 'PENDING' },
    { id: 4, type: 'DEPOSIT', description: 'Refund', amount: 75, date: new Date(), status: 'COMPLETED' },
    { id: 5, type: 'WITHDRAWAL', description: 'Online Purchase', amount: 320, date: new Date(), status: 'COMPLETED' },
  ]);
  const [stats, setStats] = useState({
    totalIncome: 12500,
    totalExpenses: 8340,
    pendingTransactions: 3,
  });

  // Simulated balance animation on mount
  useEffect(() => {
    const targetBalance = 15428.50;
    setBalance(targetBalance);
    
    let current = 0;
    const increment = targetBalance / 100;
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetBalance) {
        setDisplayBalance(targetBalance);
        clearInterval(timer);
      } else {
        setDisplayBalance(current);
      }
    }, 15);

    return () => clearInterval(timer);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const quickActions = [
    { icon: Send, label: 'Transfer Funds', color: 'blue', action: () => toast.success('Opening transfer...') },
    { icon: Download, label: 'Deposit', color: 'green', action: () => toast.success('Opening deposit...') },
    { icon: CreditCard, label: 'Virtual Cards', color: 'purple', action: () => toast.success('Opening cards...') },
    { icon: FileText, label: 'Apply for Loan', color: 'orange', action: () => toast.success('Opening loan form...') },
  ];

  const dismissNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'DEPOSIT': return TrendingUp;
      case 'WITHDRAWAL': return TrendingDown;
      case 'TRANSFER': return ArrowRightLeft;
      default: return DollarSign;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'DEPOSIT': return 'text-green-600 bg-green-50';
      case 'WITHDRAWAL': return 'text-red-600 bg-red-50';
      case 'TRANSFER': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'PENDING': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'FAILED': return <AlertCircle className="w-4 h-4 text-red-600" />;
      default: return null;
    }
  };

  return (
    <>      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto space-y-6"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Welcome back! Here's your financial overview.
              </p>
            </div>
            
            {/* Notifications Bell */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-3 bg-white dark:bg-slate-800 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              <Bell className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              {notifications.length > 0 && (
                <motion.span
                  variants={pulseVariants}
                  initial="initial"
                  animate="animate"
                  className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold"
                >
                  {notifications.length}
                </motion.span>
              )}
            </motion.button>
          </motion.div>

          {/* Notifications Panel */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -20, height: 0 }}
                className="overflow-hidden"
              >
                <Card className="border-blue-200 dark:border-blue-800">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Notifications</CardTitle>
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800"
                      >
                        <Bell className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800 dark:text-gray-200">{notification.message}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                        </div>
                        <button
                          onClick={() => dismissNotification(notification.id)}
                          className="p-1 hover:bg-white dark:hover:bg-slate-800 rounded-full transition flex-shrink-0"
                        >
                          <X className="w-3 h-3 text-gray-400" />
                        </button>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Balance Card */}
          <motion.div variants={itemVariants}>
            <Card className="relative overflow-hidden border-none shadow-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
              
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
                  <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                    <div className="flex items-center gap-2 text-green-200 text-sm mb-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>Income</span>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {formatCurrency(stats.totalIncome)}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                    <div className="flex items-center gap-2 text-red-200 text-sm mb-1">
                      <TrendingDown className="w-4 h-4" />
                      <span>Expenses</span>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {formatCurrency(stats.totalExpenses)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants}>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.button
                    key={index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={action.action}
                    className="group relative p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br from-${action.color}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                    
                    <div className="relative">
                      <div className={`p-3 bg-${action.color}-100 dark:bg-${action.color}-900/30 rounded-xl inline-flex mb-3 group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-6 h-6 text-${action.color}-600 dark:text-${action.color}-400`} />
                      </div>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">{action.label}</p>
                      <ChevronRight className="w-5 h-5 text-gray-400 mt-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Stats Overview */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pending</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stats.pendingTransactions}
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                    <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Savings</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(4088)}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                    <PiggyBank className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">This Month</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(2340)}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                    <Zap className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Transactions */}
          <motion.div variants={itemVariants}>
            <Card className="border-none shadow-lg">
              <CardHeader className="border-b dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Recent Transactions</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Your latest activity
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
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
                    const Icon = getTransactionIcon(transaction.type);
                    const colorClass = getTransactionColor(transaction.type);
                    
                    return (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                        className="p-4 cursor-pointer transition-colors"
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
                              transaction.type === 'DEPOSIT' 
                                ? 'text-green-600 dark:text-green-400' 
                                : 'text-red-600 dark:text-red-400'
                            }`}>
                              {transaction.type === 'DEPOSIT' ? '+' : '-'}
                              {formatCurrency(transaction.amount)}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {transaction.status}
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

