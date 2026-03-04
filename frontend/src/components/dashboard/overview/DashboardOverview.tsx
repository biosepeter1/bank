import React, { useEffect } from 'react';
import { Send, TrendingUp, CreditCard, PlusCircle, Eye, EyeOff, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useWalletStore } from '@/stores/walletStore';
import BalanceCard from './BalanceCard';
import QuickActions from './QuickActions';
import RecentTransactions from './RecentTransactions';
import SpendingChart from './SpendingChart';

const DashboardOverview: React.FC = () => {
  const { wallet, transactions } = useWalletStore();
  const [showBalance, setShowBalance] = React.useState(true);

  const stats = [
    {
      label: 'Income',
      amount: wallet?.income || 0,
      change: '+12.5%',
      icon: ArrowDownLeft,
      color: 'green',
    },
    {
      label: 'Expenses',
      amount: wallet?.expenses || 0,
      change: '-8.2%',
      icon: ArrowUpRight,
      color: 'red',
    },
    {
      label: 'Investments',
      amount: wallet?.investments || 0,
      change: '+24.3%',
      icon: TrendingUp,
      color: 'blue',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, John! 👋</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Here's what's happening with your account today</p>
      </div>

      {/* Balance Card */}
      <BalanceCard balance={wallet?.balance || 0} showBalance={showBalance} onToggle={() => setShowBalance(!showBalance)} />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">₦{(stat.amount).toLocaleString('en-NG')}</p>
                  <p className={`text-xs font-semibold mt-2 ${
                    stat.color === 'green' ? 'text-green-600' :
                    stat.color === 'red' ? 'text-red-600' :
                    'text-blue-600'
                  }`}>{stat.change} from last month</p>
                </div>
                <div className={`p-3 rounded-lg ${
                  stat.color === 'green' ? 'bg-green-100 dark:bg-green-900/20' :
                  stat.color === 'red' ? 'bg-red-100 dark:bg-red-900/20' :
                  'bg-blue-100 dark:bg-blue-900/20'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    stat.color === 'green' ? 'text-green-600' :
                    stat.color === 'red' ? 'text-red-600' :
                    'text-blue-600'
                  }`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Charts and Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spending Chart */}
        <div className="lg:col-span-2">
          <SpendingChart />
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Account Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Cards</span>
                <span className="font-semibold">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Active Loans</span>
                <span className="font-semibold">1</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Investments</span>
                <span className="font-semibold text-green-600">₦250,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Pending Transfers</span>
                <span className="font-semibold text-yellow-600">2</span>
              </div>
            </div>
          </div>

          {/* Goals */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <h3 className="font-semibold mb-4">Savings Goal</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>65%</span>
                </div>
                <div className="w-full bg-white/30 rounded-full h-2">
                  <div className="bg-white rounded-full h-2 w-2/3"></div>
                </div>
              </div>
              <p className="text-sm text-blue-100">₦650,000 of ₦1,000,000 saved</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <RecentTransactions transactions={transactions?.slice(0, 5) || []} />
    </div>
  );
};

export default DashboardOverview;
