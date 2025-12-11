'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet as WalletIcon, TrendingUp, TrendingDown, ArrowRightLeft, RefreshCw, Eye, EyeOff, Copy, CheckCircle } from 'lucide-react';
import { walletApi } from '@/lib/api/wallet';
import { LazyDepositModal, LazyWithdrawModal, LazyTransferModal } from '@/components/wallet/LazyModals';
import { Toaster } from 'react-hot-toast';
import { useCurrency } from '@/lib/hooks/useCurrency';
import { useBranding } from '@/contexts/BrandingContext';

export default function WalletPage() {
  const { branding } = useBranding();
  const { currency, formatAmount } = useCurrency();
  const [wallet, setWallet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      const walletData = await walletApi.getWallet();
      setWallet(walletData);
    } catch (error) {
      // Silent error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadWalletData();
  };

  const handleWalletUpdate = () => {
    loadWalletData();
  };

  const copyWalletId = () => {
    if (wallet?.id) {
      navigator.clipboard.writeText(wallet.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Wallet</h1>
          <p className="text-gray-600">Manage your wallet and transactions</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </motion.div>

      {/* Balance Card */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
        <Card className="bg-gradient-to-br from-blue-600 to-purple-700 text-white shadow-2xl border-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <WalletIcon className="h-6 w-6" />
              Available Balance
            </CardTitle>
            <CardDescription className="text-blue-100">Your current wallet balance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <motion.div key={wallet?.balance} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-bold">
                    {showBalance ? formatAmount(wallet?.balance ? Number(wallet.balance) : 0) : '••••••'}
                  </motion.div>
                  <p className="text-sm text-blue-100 mt-2">Currency: {currency.code}</p>
                </div>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setShowBalance(!showBalance)} className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition">
                  {showBalance ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </motion.button>
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-100">
                <span>Last updated:</span>
                <span>{new Date(wallet?.updatedAt).toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Perform wallet operations quickly</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={() => setDepositModalOpen(true)} className="h-auto py-6 flex-col gap-2 bg-green-600 hover:bg-green-700 w-full shadow-md">
                  <TrendingUp className="h-8 w-8" />
                  <div>
                    <p className="font-semibold">Deposit Money</p>
                    <p className="text-xs opacity-90">Add funds to your wallet</p>
                  </div>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={() => setWithdrawModalOpen(true)} disabled={!wallet?.balance || Number(wallet.balance) <= 0} className="h-auto py-6 flex-col gap-2 bg-red-600 hover:bg-red-700 w-full shadow-md">
                  <TrendingDown className="h-8 w-8" />
                  <div>
                    <p className="font-semibold">Withdraw Money</p>
                    <p className="text-xs opacity-90">Cash out from wallet</p>
                  </div>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={() => setTransferModalOpen(true)} disabled={!wallet?.balance || Number(wallet.balance) <= 0} className="h-auto py-6 flex-col gap-2 bg-blue-600 hover:bg-blue-700 w-full shadow-md">
                  <ArrowRightLeft className="h-8 w-8" />
                  <div>
                    <p className="font-semibold">Transfer Money</p>
                    <p className="text-xs opacity-90">Send to another user</p>
                  </div>
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Wallet Information */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Wallet Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b hover:bg-gray-50 transition px-2 -mx-2 rounded">
                <span className="text-gray-600">Wallet ID</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">{wallet?.id?.slice(0, 8)}...</span>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={copyWalletId} className="p-1 hover:bg-gray-200 rounded transition">
                    {copied ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-gray-600" />}
                  </motion.button>
                </div>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600">Account Holder</span>
                <span className="font-medium">{wallet?.user?.firstName} {wallet?.user?.lastName}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600">Email</span>
                <span className="font-medium">{wallet?.user?.email}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600">Currency</span>
                <span className="font-medium">{wallet?.currency || 'NGN'}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600">Created</span>
                <span className="font-medium">{new Date(wallet?.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Lazy Loaded Modals */}
      <LazyDepositModal isOpen={depositModalOpen} onClose={() => setDepositModalOpen(false)} onSuccess={handleWalletUpdate} />
      <LazyWithdrawModal isOpen={withdrawModalOpen} onClose={() => setWithdrawModalOpen(false)} onSuccess={handleWalletUpdate} currentBalance={Number(wallet?.balance) || 0} />
      <LazyTransferModal isOpen={transferModalOpen} onClose={() => setTransferModalOpen(false)} onSuccess={handleWalletUpdate} currentBalance={Number(wallet?.balance) || 0} />
    </div>
  );
}

