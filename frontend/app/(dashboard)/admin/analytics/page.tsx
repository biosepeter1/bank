'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Loader2,
  TrendingUp,
  Download,
  Calendar,
  DollarSign,
  Users,
  Activity
} from 'lucide-react';
import { adminApi } from '@/lib/api/admin';
import { toast } from 'react-hot-toast';
import { useBranding } from '@/contexts/BrandingContext';

type AnalyticsData = {
  users: any[];
  transactions: any[];
  dailyTransactions: any[];
  transactionsByType: any[];
  userGrowth: any[];
  revenueData: any[];
};

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AnalyticsPage() {

  const { branding } = useBranding();
  const [data, setData] = useState<AnalyticsData>({
    users: [],
    transactions: [],
    dailyTransactions: [],
    transactionsByType: [],
    userGrowth: [],
    revenueData: [],
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7days');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);

      const [users, transactions] = await Promise.all([
        adminApi.getUsers(),
        adminApi.getAllTransactions({ limit: 500 }),
      ]);

      // Process data for charts
      const processedData = processAnalyticsData(users, transactions);
      setData(processedData);
    } catch (error: any) {
      console.error('Failed to fetch analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const processAnalyticsData = (users: any[], transactions: any[]) => {
    // Transaction by type
    const transactionsByType = [
      {
        name: 'Deposits',
        value: transactions.filter(t => t.type === 'DEPOSIT').length,
        amount: transactions
          .filter(t => t.type === 'DEPOSIT')
          .reduce((sum, t) => sum + Number(t.amount), 0),
      },
      {
        name: 'Withdrawals',
        value: transactions.filter(t => t.type === 'WITHDRAWAL').length,
        amount: transactions
          .filter(t => t.type === 'WITHDRAWAL')
          .reduce((sum, t) => sum + Number(t.amount), 0),
      },
      {
        name: 'Transfers',
        value: transactions.filter(t => t.type === 'TRANSFER').length,
        amount: transactions
          .filter(t => t.type === 'TRANSFER')
          .reduce((sum, t) => sum + Number(t.amount), 0),
      },
    ];

    // Daily transactions for the last 7 days
    const dailyTransactions = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toISOString().split('T')[0];

      const dayTransactions = transactions.filter(t => {
        const txDate = new Date(t.createdAt).toISOString().split('T')[0];
        return txDate === dateStr;
      });

      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        transactions: dayTransactions.length,
        volume: dayTransactions.reduce((sum, t) => sum + Number(t.amount), 0),
        deposits: dayTransactions.filter(t => t.type === 'DEPOSIT').length,
        withdrawals: dayTransactions.filter(t => t.type === 'WITHDRAWAL').length,
        transfers: dayTransactions.filter(t => t.type === 'TRANSFER').length,
      };
    });

    // User growth over last 7 days
    const userGrowth = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toISOString().split('T')[0];

      const newUsers = users.filter(u => {
        const userDate = new Date(u.createdAt).toISOString().split('T')[0];
        return userDate === dateStr;
      });

      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        newUsers: newUsers.length,
        total: users.filter(u => new Date(u.createdAt) <= date).length,
      };
    });

    // Revenue data (transaction volume by day)
    const revenueData = dailyTransactions.map(day => ({
      date: day.date,
      revenue: Math.floor(day.volume * 0.015), // Assuming 1.5% transaction fee
      volume: day.volume,
    }));

    return {
      users,
      transactions,
      dailyTransactions,
      transactionsByType,
      userGrowth,
      revenueData,
    };
  };

  const exportReport = () => {
    try {
      // Create CSV content
      const csvData = [
        ['Metric', 'Value'],
        ['Total Volume', `₦${totalVolume.toLocaleString()}`],
        ['Average Transaction', `₦${Math.floor(avgTransactionValue).toLocaleString()}`],
        ['Total Users', data.users.length.toString()],
        ['Total Transactions', data.transactions.length.toString()],
        [''],
        ['Transaction Breakdown'],
        ['Type', 'Count', 'Amount'],
        ...data.transactionsByType.map(type => [
          type.name,
          type.value.toString(),
          `₦${type.amount.toLocaleString()}`
        ]),
        [''],
        ['Daily Activity (Last 7 Days)'],
        ['Date', 'Transactions', 'Volume', 'Deposits', 'Withdrawals', 'Transfers'],
        ...data.dailyTransactions.map(day => [
          day.date,
          day.transactions.toString(),
          `₦${day.volume.toLocaleString()}`,
          day.deposits.toString(),
          day.withdrawals.toString(),
          day.transfers.toString()
        ])
      ];

      const csvContent = csvData.map(row =>
        row.map(cell => `"${cell}"`).join(',')
      ).join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `analytics-report-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);

      toast.success('Analytics report exported successfully!');
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  const totalVolume = data.transactions.reduce((sum, t) => sum + Number(t.amount), 0);
  const avgTransactionValue = totalVolume / data.transactions.length || 0;

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Analytics & Reports</h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Platform insights and performance metrics</p>
        </div>
        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px] sm:w-[180px] h-9 sm:h-10">
              <Calendar className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportReport} size="sm" className="h-9 sm:h-10">
            <Download className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Export Report</span>
            <span className="sm:hidden">Export</span>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-2 md:grid-cols-4 mb-4 sm:mb-6 md:mb-8">
        <Card>
          <CardContent className="p-3 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Volume</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold">₦{totalVolume.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12.5% from last period
                </p>
              </div>
              <div className="p-2 sm:p-3 rounded-full bg-blue-50">
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Avg Transaction</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold">₦{Math.floor(avgTransactionValue).toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +5.2% from last period
                </p>
              </div>
              <div className="p-2 sm:p-3 rounded-full bg-green-50">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Users</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold">{data.users.length}</p>
                <p className="text-xs text-green-600 mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8.3% growth rate
                </p>
              </div>
              <div className="p-2 sm:p-3 rounded-full bg-purple-50">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Transactions</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold">{data.transactions.length}</p>
                <p className="text-xs text-green-600 mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +15.7% increase
                </p>
              </div>
              <div className="p-2 sm:p-3 rounded-full bg-orange-50">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 mb-4 sm:mb-6 md:mb-8">
        {/* Daily Transaction Volume */}
        <Card>
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Transaction Volume Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200} className="sm:!h-[250px] md:!h-[300px]">
              <LineChart data={data.dailyTransactions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(value: any) => `₦${Number(value).toLocaleString()}`}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line
                  type="monotone"
                  dataKey="volume"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Volume"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Transactions by Type */}
        <Card>
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Transaction Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200} className="sm:!h-[250px] md:!h-[300px]">
              <PieChart>
                <Pie
                  data={data.transactionsByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.transactionsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 mb-4 sm:mb-6 md:mb-8">
        {/* Daily Transactions Count */}
        <Card>
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Daily Transaction Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200} className="sm:!h-[250px] md:!h-[300px]">
              <BarChart data={data.dailyTransactions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="deposits" fill="#10b981" name="Deposits" />
                <Bar dataKey="withdrawals" fill="#ef4444" name="Withdrawals" />
                <Bar dataKey="transfers" fill="#3b82f6" name="Transfers" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Growth */}
        <Card>
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200} className="sm:!h-[250px] md:!h-[300px]">
              <LineChart data={data.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line
                  type="monotone"
                  dataKey="newUsers"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  name="New Users"
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Total Users"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Details Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction Type Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.transactionsByType.map((type, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <div>
                    <p className="font-semibold">{type.name}</p>
                    <p className="text-sm text-gray-600">{type.value} transactions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">₦{type.amount.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">
                    {((type.value / data.transactions.length) * 100).toFixed(1)}% of total
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


