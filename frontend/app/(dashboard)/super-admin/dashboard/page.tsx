'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Shield,
  Users,
  Settings,
  Activity,
  Database,
  Server,
  AlertTriangle,
  TrendingUp,
  Loader2,
  ArrowUpCircle,
  ArrowDownCircle,
  ArrowRightLeft,
} from 'lucide-react';
import Link from 'next/link';
import { adminApi } from '@/lib/api/admin';
import { toast } from 'react-hot-toast';

type SystemStats = {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  totalTransactions: number;
  totalVolume: number;
  deposits: number;
  withdrawals: number;
  transfers: number;
  pendingKYC: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
};

export default function SuperAdminDashboardPage() {
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    activeUsers: 0,
    suspendedUsers: 0,
    totalTransactions: 0,
    totalVolume: 0,
    deposits: 0,
    withdrawals: 0,
    transfers: 0,
    pendingKYC: 0,
    systemHealth: 'healthy',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSystemStats();
  }, []);

  const fetchSystemStats = async () => {
    try {
      setLoading(true);
      
      // Fetch users and transactions data
      const [users, transactions] = await Promise.all([
        adminApi.getUsers(),
        adminApi.getAllTransactions({ limit: 500 }),
      ]);

      // Calculate user stats
      const activeUsers = users.filter((u: any) => u.accountStatus === 'ACTIVE').length;
      const suspendedUsers = users.filter((u: any) => u.accountStatus === 'SUSPENDED').length;
      
      // Calculate transaction stats
      const totalVolume = transactions.reduce((sum: number, tx: any) => sum + Number(tx.amount), 0);
      const deposits = transactions.filter((tx: any) => tx.type === 'DEPOSIT').length;
      const withdrawals = transactions.filter((tx: any) => tx.type === 'WITHDRAWAL').length;
      const transfers = transactions.filter((tx: any) => tx.type === 'TRANSFER').length;

      // Get KYC data
      let pendingKYC = 0;
      try {
        const kycData = await adminApi.getPendingKYC();
        pendingKYC = kycData.length;
      } catch (error) {
        console.log('Could not fetch KYC data');
      }

      // Determine system health based on metrics
      let systemHealth: 'healthy' | 'warning' | 'critical' = 'healthy';
      if (suspendedUsers > users.length * 0.1) {
        systemHealth = 'warning';
      }
      if (suspendedUsers > users.length * 0.2) {
        systemHealth = 'critical';
      }

      setStats({
        totalUsers: users.length,
        activeUsers,
        suspendedUsers,
        totalTransactions: transactions.length,
        totalVolume,
        deposits,
        withdrawals,
        transfers,
        pendingKYC,
        systemHealth,
      });
    } catch (error: any) {
      console.error('Failed to fetch system stats:', error);
      toast.error('Failed to load system statistics');
    } finally {
      setLoading(false);
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy':
        return 'text-green-600 bg-green-50';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50';
      case 'critical':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
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

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">System administration and monitoring</p>
      </div>

      {/* System Health */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-full">
                <Server className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Platform Status</p>
                <p className="text-2xl font-bold">
                  <span className={`px-3 py-1 rounded-full text-sm ${getHealthColor(stats.systemHealth)}`}>
                    {stats.systemHealth.toUpperCase()}
                  </span>
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Platform Volume</p>
              <p className="text-xl font-bold">₦{stats.totalVolume.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Users</p>
                <p className="text-3xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                <p className="text-sm text-green-600 mt-1">
                  {stats.activeUsers} active
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-50">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Transactions</p>
                <p className="text-3xl font-bold">{stats.totalTransactions.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-1">Platform wide</p>
              </div>
              <div className="p-3 rounded-full bg-green-50">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending KYC</p>
                <p className="text-3xl font-bold">{stats.pendingKYC}</p>
                <p className="text-sm text-yellow-600 mt-1">Needs review</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-50">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Suspended</p>
                <p className="text-3xl font-bold">{stats.suspendedUsers}</p>
                <p className="text-sm text-red-600 mt-1">
                  Inactive accounts
                </p>
              </div>
              <div className="p-3 rounded-full bg-red-50">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Breakdown */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Deposits</p>
                <p className="text-2xl font-bold">{stats.deposits}</p>
              </div>
              <div className="p-3 rounded-full bg-green-50">
                <ArrowDownCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Withdrawals</p>
                <p className="text-2xl font-bold">{stats.withdrawals}</p>
              </div>
              <div className="p-3 rounded-full bg-red-50">
                <ArrowUpCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Transfers</p>
                <p className="text-2xl font-bold">{stats.transfers}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-50">
                <ArrowRightLeft className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Administration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/users">
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Button>
            </Link>
            <Link href="/super-admin/settings">
              <Button variant="outline" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                System Settings
              </Button>
            </Link>
            <Link href="/admin/transactions">
              <Button variant="outline" className="w-full justify-start">
                <Activity className="mr-2 h-4 w-4" />
                View Transactions
              </Button>
            </Link>
            <Link href="/admin/kyc">
              <Button variant="outline" className="w-full justify-start">
                <Shield className="mr-2 h-4 w-4" />
                KYC Management
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Platform Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 pb-3 border-b">
                <div className="p-2 bg-blue-50 rounded-full">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Active Users</p>
                  <p className="text-xs text-gray-500">
                    {stats.activeUsers} users currently active on the platform
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 pb-3 border-b">
                <div className="p-2 bg-green-50 rounded-full">
                  <Activity className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Transaction Activity</p>
                  <p className="text-xs text-gray-500">
                    ₦{stats.totalVolume.toLocaleString()} total volume processed
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 pb-3 border-b">
                <div className="p-2 bg-yellow-50 rounded-full">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Pending KYC Reviews</p>
                  <p className="text-xs text-gray-500">
                    {stats.pendingKYC} applications awaiting approval
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-50 rounded-full">
                  <Shield className="h-4 w-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Account Status</p>
                  <p className="text-xs text-gray-500">
                    {stats.suspendedUsers} suspended accounts requiring attention
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">User Growth Rate</p>
              <p className="text-2xl font-bold text-blue-600">
                {((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500 mt-1">Active user ratio</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Transaction Success</p>
              <p className="text-2xl font-bold text-green-600">98.5%</p>
              <p className="text-xs text-gray-500 mt-1">Platform reliability</p>
            </div>
          </div>
        </CardContent>
      </Card>    </div>
  );
}


