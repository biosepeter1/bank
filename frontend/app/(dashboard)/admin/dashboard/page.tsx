'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Users,
  CreditCard,
  AlertCircle,
  TrendingUp,
  FileText,
  Shield,
  DollarSign,
  Activity,
  Sparkles,
  Zap,
  BarChart3,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { adminApi } from '@/lib/api/admin';
import { useBranding } from '@/contexts/BrandingContext';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

type DashboardStats = {
  totalUsers: number;
  activeUsers: number;
  pendingKYC: number;
  totalTransactions: number;
  totalVolume: number;
  activeCards: number;
  pendingApprovals: number;
  systemAlerts: number;
};

type TransactionVolumeData = {
  date: string;
  transactions: number;
  volume: number;
};

type TransactionTypeData = {
  name: string;
  value: number;
  color: string;
};

type SystemAlert = {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
};

type RecentActivity = {
  id: string;
  action: string;
  description: string;
  userName: string;
  userEmail?: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
};

export default function AdminDashboardPage() {
  
  const { branding } = useBranding();
const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    pendingKYC: 0,
    totalTransactions: 0,
    totalVolume: 0,
    activeCards: 0,
    pendingApprovals: 0,
    systemAlerts: 0,
  });
  const [volumeData, setVolumeData] = useState<TransactionVolumeData[]>([]);
  const [transactionTypes, setTransactionTypes] = useState<TransactionTypeData[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [alertsDialogOpen, setAlertsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setApiError(null);

      // Prefer backend dashboard stats for accurate counters; fallback to client-side aggregation
      const [adminStats, users, tx, txStats, pendingKyc] = await Promise.all([
        adminApi.getDashboardStats().catch(() => null),
        adminApi.getUsers().catch(() => []),
        adminApi.getAllTransactions({ limit: 500 }).catch(() => []),
        adminApi.getTransactionStats().catch(() => ({} as any)),
        adminApi.getPendingKYC().catch(() => []),
      ]);

      const totalUsers = adminStats?.totalUsers ?? (users || []).length;
      const activeUsers = adminStats?.activeUsers ?? (users || []).filter((u: any) => u.accountStatus === 'ACTIVE').length;
      // Compute "This month" transaction count when admin stats are unavailable
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      const monthCompleted = (tx || []).filter((t: any) => new Date(t.createdAt) >= startOfMonth && (t.status || '').toUpperCase() === 'COMPLETED').length;
      const monthAnyStatus = (tx || []).filter((t: any) => new Date(t.createdAt) >= startOfMonth).length;
      const allTime = (tx || []).length;

      // Prefer backend stat; else prefer month completed; if zero, fall back to month any-status; else all-time
      const totalTransactions = adminStats?.totalTransactions ?? (monthCompleted || monthAnyStatus || allTime);
      const totalVolume = adminStats?.totalVolume ?? (Number(txStats?.totalIncome || 0) + Number(txStats?.totalExpenses || 0));
      const activeCards = adminStats?.activeCards ?? 0;
      const pendingApprovals = adminStats?.pendingApprovals ?? 0;
      const systemAlerts = adminStats?.systemAlerts ?? 0;

      setStats((s) => ({
        ...s,
        totalUsers,
        activeUsers,
        pendingKYC: adminStats?.pendingKYC ?? (pendingKyc || []).length,
        totalTransactions,
        totalVolume,
        activeCards,
        pendingApprovals,
        systemAlerts,
      }));

      // Build transaction volume (last 14 days) and distribution from tx
      try {
        const now = new Date();
        const days = 14;
        const bucket: Record<string, { date: string; transactions: number; volume: number }> = {};
        for (let i = days - 1; i >= 0; i--) {
          const d = new Date(now);
          d.setDate(now.getDate() - i);
          const key = d.toISOString().slice(0, 10);
          bucket[key] = { date: key, transactions: 0, volume: 0 };
        }
        (tx || []).forEach((t: any) => {
          const key = new Date(t.createdAt).toISOString().slice(0, 10);
          if (bucket[key]) {
            bucket[key].transactions += 1;
            bucket[key].volume += Number(t.amount) || 0;
          }
        });
        setVolumeData(Object.values(bucket));

        const typeBuckets: Record<string, number> = { DEPOSIT: 0, WITHDRAWAL: 0, TRANSFER: 0 };
        (tx || []).forEach((t: any) => {
          if (typeBuckets[t.type] !== undefined) typeBuckets[t.type] += 1;
        });
        const totalCount = Object.values(typeBuckets).reduce((a, b) => a + b, 0) || 1;
        const colors: Record<string, string> = { DEPOSIT: '#10b981', WITHDRAWAL: '#ef4444', TRANSFER: '#3b82f6' };
        setTransactionTypes(Object.keys(typeBuckets).map((name) => ({ name, value: Math.round((typeBuckets[name] / totalCount) * 100), color: colors[name] })));

        // Recent activity from last 4 transactions
        const last = (tx || []).slice(0, 4).map((t: any, idx: number) => ({
          id: t.id,
          action: 'TRANSACTION',
          description: `${t.user?.firstName || 'User'} ${t.user?.lastName || ''} ${t.type.toLowerCase()} ${t.currency} ${Math.abs(Number(t.amount)).toLocaleString()}`.trim(),
          userName: `${t.user?.firstName || ''} ${t.user?.lastName || ''}`.trim(),
          userEmail: t.user?.email,
          timestamp: new Date(t.createdAt),
          metadata: { type: t.type, status: t.status },
        }));
        setRecentActivities(last);
      } catch (_) {
        setVolumeData([]);
        setTransactionTypes([]);
        setRecentActivities([]);
      }

      // Pending transfers count (legacy). If adminStats already provided a pendingApprovals value, keep it.
      if (!adminStats?.pendingApprovals) {
        try {
          const token = localStorage.getItem('accessToken');
          if (token) {
            const transfersRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transfers/admin/all`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (transfersRes.ok) {
              const transfers = await transfersRes.json();
              const pending = (transfers || []).filter((t: any) => t.status === 'PENDING').length;
              setStats((s) => ({ ...s, pendingApprovals: pending }));
            }
          }
        } catch (_) {}
      }

      setLoading(false);
    } catch (error: any) {
      setApiError(error?.message || 'Failed to load');
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      subtitle: `${stats.activeUsers} active`,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      link: '/admin/users',
    },
    {
      title: 'Pending KYC',
      value: stats.pendingKYC.toString(),
      subtitle: 'Awaiting review',
      icon: Shield,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      link: '/admin/kyc',
    },
    {
      title: 'Transactions',
      value: stats.totalTransactions.toLocaleString(),
      subtitle: 'This month',
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      link: '/admin/transactions',
    },
    {
      title: 'Transaction Volume',
      value: `₦${(stats.totalVolume / 1000000).toFixed(1)}M`,
      subtitle: 'Total processed',
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      link: '/admin/transactions',
    },
    {
      title: 'Active Cards',
      value: stats.activeCards.toLocaleString(),
      subtitle: 'Issued cards',
      icon: CreditCard,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      link: '/admin/cards',
    },
    {
      title: 'Pending Approvals',
      value: stats.pendingApprovals.toString(),
      subtitle: 'Require action',
      icon: FileText,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      link: '/admin/transfers',
    },
  ];

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mb-4"></div>
          <p className="text-gray-600 font-medium text-lg">Loading admin dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 p-6">
      {/* Modern Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-3 text-lg">Monitor and manage banking operations</p>
          </div>
          <div className="hidden md:flex gap-4">
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <Sparkles className="h-6 w-6 text-yellow-500 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Admin</p>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <Zap className="h-6 w-6 text-indigo-500 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Control</p>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <BarChart3 className="h-6 w-6 text-purple-500 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Analytics</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* API Error Banner */}
      {apiError && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-6 bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200 rounded-2xl shadow-lg"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-yellow-900 text-lg">API Connection Issue</p>
              <p className="text-sm text-yellow-700 mt-2">{apiError}</p>
              <p className="text-xs text-yellow-600 mt-2">
                Make sure the backend server is running on {process.env.NEXT_PUBLIC_API_URL}
              </p>
              <Button 
                size="sm" 
                onClick={fetchDashboardStats}
                className="mt-4 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white"
              >
                Retry Connection
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* System Alerts */}
      {stats.systemAlerts > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 p-6 bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 rounded-2xl shadow-lg flex items-center gap-4"
        >
          <div className="p-3 bg-red-100 rounded-xl">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-red-900 text-lg">
              {stats.systemAlerts} System Alert{stats.systemAlerts > 1 ? 's' : ''}
            </p>
            <p className="text-sm text-red-700">Require immediate attention</p>
          </div>
          <Button 
            size="sm"
            onClick={() => setAlertsDialogOpen(true)}
            className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white"
          >
            View Alerts
          </Button>
        </motion.div>
      )}

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8"
      >
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.title} variants={itemVariants}>
              <Link href={stat.link}>
                <Card className="border-none shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group bg-white/90 backdrop-blur-sm hover:scale-105">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-2 font-medium">{stat.title}</p>
                        <p className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{stat.value}</p>
                        <p className="text-sm text-gray-500 mt-2">{stat.subtitle}</p>
                      </div>
                      <div className={`p-4 rounded-2xl ${stat.bgColor} group-hover:scale-110 transition-transform`}>
                        <Icon className={`h-7 w-7 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6 md:grid-cols-2 mb-8"
      >
        <motion.div variants={itemVariants}>
          <Card className="border-none shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="border-b bg-gradient-to-r from-indigo-50 to-purple-50">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Zap className="h-5 w-5 text-indigo-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-6">
              <Link href="/admin/users">
                <Button variant="outline" className="w-full justify-start hover:bg-indigo-50 hover:border-indigo-300 transition-all group">
                  <Users className="mr-2 h-5 w-5 text-indigo-600 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Manage Users</span>
                </Button>
              </Link>
              <Link href="/admin/kyc">
                <Button variant="outline" className="w-full justify-start hover:bg-purple-50 hover:border-purple-300 transition-all group">
                  <Shield className="mr-2 h-5 w-5 text-purple-600 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Review KYC Documents</span>
                </Button>
              </Link>
              <Link href="/admin/transactions">
                <Button variant="outline" className="w-full justify-start hover:bg-green-50 hover:border-green-300 transition-all group">
                  <Activity className="mr-2 h-5 w-5 text-green-600 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">View Transactions</span>
                </Button>
              </Link>
              <Link href="/admin/reports">
                <Button variant="outline" className="w-full justify-start hover:bg-pink-50 hover:border-pink-300 transition-all group">
                  <FileText className="mr-2 h-5 w-5 text-pink-600 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Generate Reports</span>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={itemVariants}>
          <Card className="border-none shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-600" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {recentActivities.length > 0 ? (
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => {
                    const getActivityIcon = (action: string) => {
                      if (action.includes('USER') || action.includes('CREATED')) return Users;
                      if (action.includes('KYC')) return Shield;
                      if (action.includes('CARD')) return CreditCard;
                      return Activity;
                    };
                    
                    const getActivityColor = (action: string) => {
                      if (action.includes('USER') || action.includes('CREATED')) return { bg: 'bg-gradient-to-br from-green-50 to-emerald-50', icon: 'text-green-600' };
                      if (action.includes('KYC')) return { bg: 'bg-gradient-to-br from-orange-50 to-amber-50', icon: 'text-orange-600' };
                      if (action.includes('CARD')) return { bg: 'bg-gradient-to-br from-blue-50 to-cyan-50', icon: 'text-blue-600' };
                      return { bg: 'bg-gradient-to-br from-purple-50 to-pink-50', icon: 'text-purple-600' };
                    };
                    
                    const Icon = getActivityIcon(activity.action);
                    const colors = getActivityColor(activity.action);
                    const timeAgo = new Date(activity.timestamp).toLocaleString();
                    
                    return (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-start gap-4 p-3 rounded-xl hover:shadow-md transition-shadow ${index < recentActivities.length - 1 ? 'mb-3' : ''}`}
                      >
                        <div className={`p-3 ${colors.bg} rounded-xl shadow-sm`}>
                          <Icon className={`h-5 w-5 ${colors.icon}`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">{activity.description}</p>
                          <p className="text-xs text-gray-500 mt-1">{activity.userName} • {timeAgo}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No recent activities</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        {/* Transaction Volume Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Volume (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            {volumeData.length === 0 ? (
              <div className="h-80 flex items-center justify-center">
                <div className="text-center">
                  <Activity className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No transaction data available</p>
                  <p className="text-sm text-gray-400 mt-1">Data will appear once transactions are processed</p>
                </div>
              </div>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={volumeData}>
                  <defs>
                    <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                    tickFormatter={(value) => `₦${(value / 1000000).toFixed(1)}M`}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                    formatter={(value: number, name: string) => {
                      if (name === 'volume') {
                        return [`₦${value.toLocaleString()}`, 'Volume'];
                      }
                      return [value, 'Transactions'];
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="volume" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorVolume)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transaction Types Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {transactionTypes.length === 0 || transactionTypes.every(t => t.value === 0) ? (
              <div className="h-80 flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No transaction distribution data</p>
                  <p className="text-sm text-gray-400 mt-1">Data will appear once transactions are processed</p>
                </div>
              </div>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                  <Pie
                    data={transactionTypes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={800}
                  >
                    {transactionTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                    formatter={(value: number) => [`${value}%`, 'Percentage']}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    iconType="circle"
                    formatter={(value) => (
                      <span style={{ color: '#374151', fontSize: '14px' }}>
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Alerts Dialog */}
      <Dialog open={alertsDialogOpen} onOpenChange={setAlertsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>System Alerts</DialogTitle>
            <DialogDescription>
              {alerts.length} alert{alerts.length !== 1 ? 's' : ''} requiring attention
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {alerts.map((alert) => {
              const alertStyles = {
                error: {
                  bg: 'bg-red-50',
                  border: 'border-red-200',
                  icon: 'text-red-600',
                  title: 'text-red-900',
                  text: 'text-red-700',
                },
                warning: {
                  bg: 'bg-yellow-50',
                  border: 'border-yellow-200',
                  icon: 'text-yellow-600',
                  title: 'text-yellow-900',
                  text: 'text-yellow-700',
                },
                info: {
                  bg: 'bg-blue-50',
                  border: 'border-blue-200',
                  icon: 'text-blue-600',
                  title: 'text-blue-900',
                  text: 'text-blue-700',
                },
              };
              
              const style = alertStyles[alert.type];
              const timeAgo = new Date(alert.timestamp).toLocaleString();
              
              return (
                <div 
                  key={alert.id} 
                  className={`p-4 rounded-lg border ${style.bg} ${style.border}`}
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className={`h-5 w-5 mt-0.5 ${style.icon}`} />
                    <div className="flex-1">
                      <h4 className={`font-semibold ${style.title}`}>{alert.title}</h4>
                      <p className={`text-sm mt-1 ${style.text}`}>{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-2">{timeAgo}</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        // Mark as resolved
                        const newAlerts = alerts.filter(a => a.id !== alert.id);
                        setAlerts(newAlerts);
                        
                        // Update stats count
                        setStats(prev => ({
                          ...prev,
                          systemAlerts: newAlerts.length
                        }));
                        
                        // Close dialog if no alerts left
                        if (newAlerts.length === 0) {
                          setAlertsDialogOpen(false);
                        }
                      }}
                    >
                      Resolve
                    </Button>
                  </div>
                </div>
              );
            })}
            
            {alerts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No alerts at this time</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}


