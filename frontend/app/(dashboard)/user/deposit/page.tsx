'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CreditCard, Bitcoin, Wallet, Building, CheckCircle, Loader2, DollarSign, Copy, AlertCircle, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useSettings } from '@/contexts/SettingsContext';
import { useBranding } from '@/contexts/BrandingContext';
import { useCurrency } from '@/lib/hooks/useCurrency';

type DepositMethod = 'usdt' | 'bitcoin';

type DepositHistory = {
  id: string;
  amount: number;
  currency: string;
  depositMethod: string;
  status: string;
  createdAt: string;
};

export default function DepositPage() {
  
  const { branding } = useBranding();
const { settings } = useSettings();
  const { currency, formatAmount } = useCurrency();
  const [selectedMethod, setSelectedMethod] = useState<DepositMethod | null>(null);
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [depositHistory, setDepositHistory] = useState<DepositHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    fetchDepositHistory();
  }, []);

  const fetchDepositHistory = async () => {
    try {
      setHistoryLoading(true);
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/deposits/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setDepositHistory(data);
      }
    } catch (error) {
      console.error('Failed to fetch deposit history:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const depositMethods = [
    { id: 'usdt' as DepositMethod, name: 'USDT', icon: DollarSign, bgColor: 'bg-green-100', iconColor: 'text-green-600', borderColor: 'border-green-200' },
    { id: 'bitcoin' as DepositMethod, name: 'Bitcoin', icon: Bitcoin, bgColor: 'bg-orange-100', iconColor: 'text-orange-600', borderColor: 'border-orange-200' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const depositAmount = parseFloat(amount);
    
    if (!amount || depositAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    // Validate minimum deposit amounts
    if (selectedMethod === 'usdt') {
      if (depositAmount < 10) {
        toast.error(`Minimum deposit amount is ${formatAmount(10)}`);
        return;
      }
    }
    
    if (selectedMethod === 'bitcoin') {
      if (depositAmount < 0.0001) {
        toast.error('Minimum Bitcoin deposit is 0.0001 BTC');
        return;
      }
    }
    
    setLoading(true);
    try {
      // Call the backend API to create deposit
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/deposits/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
          body: JSON.stringify({
          amount: depositAmount,
          method: selectedMethod === 'usdt' ? 'USDT' : 'BITCOIN',
          currency: selectedMethod === 'bitcoin' ? 'BTC' : 'USD',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Deposit created:', data);
        setShowConfirmModal(true);
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to create deposit');
      }
    } catch (error) {
      console.error('Deposit error:', error);
      toast.error('Deposit failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmClose = () => {
    setShowConfirmModal(false);
    setSelectedMethod(null);
    setAmount('');
    // Refresh deposit history to show the new deposit
    fetchDepositHistory();
  };

  const handleDeleteDeposit = async (depositId: string) => {
    if (!confirm('Are you sure you want to delete this deposit from your history?')) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/deposits/${depositId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast.success('Deposit deleted successfully');
        fetchDepositHistory();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to delete deposit');
      }
    } catch (error) {
      console.error('Failed to delete deposit:', error);
      toast.error('Failed to delete deposit');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 p-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 mb-3">
          <div 
            className="w-1.5 h-8 rounded-full"
            style={{ background: branding.colors.primary }}
          />
          <h1 className="text-4xl font-bold" style={{ color: branding.colors.primary }}>
            Add Funds
          </h1>
        </div>
        <p className="text-gray-600 text-lg ml-4">Quick and secure deposits to your account</p>
      </motion.div>

      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden mb-8 shadow-2xl"
        style={{
          background: `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)`
        }}
      >
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-4 border-white/5 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border-4 border-white/5 rounded-full"></div>
        </div>

        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 h-full">
            {[...Array(144)].map((_, i) => (
              <div key={i} className="border border-white/50"></div>
            ))}
          </div>
        </div>

        <div className="relative z-10 p-12 text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 shadow-lg"
          >
            <Wallet className="h-10 w-10 text-white" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-white mb-3"
          >
            Fund Your Account
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-white/90 text-lg max-w-2xl mx-auto"
          >
            Choose your preferred deposit method and start transacting instantly
          </motion.p>
          
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center gap-8 mt-8"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-white">&lt; 10min</div>
              <div className="text-sm text-white/80">Processing Time</div>
            </div>
            <div className="w-px bg-white/20"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">24/7</div>
              <div className="text-sm text-white/80">Support</div>
            </div>
            <div className="w-px bg-white/20"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">100%</div>
              <div className="text-sm text-white/80">Secure</div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Deposit Methods Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-none shadow-xl bg-white/95 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div 
                className="w-1 h-6 rounded-full"
                style={{ background: branding.colors.primary }}
              />
              <h3 className="text-xl font-bold text-gray-800">Choose Payment Method</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              {depositMethods.map((method) => {
                const Icon = method.icon;
                const isSelected = selectedMethod === method.id;
                
                return (
                  <motion.button
                    key={method.id}
                    whileHover={{ scale: 1.03, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedMethod(method.id)}
                    className="relative flex items-center gap-4 p-6 rounded-2xl border-2 transition-all overflow-hidden group"
                    style={{
                      borderColor: isSelected ? branding.colors.primary : '#e5e7eb',
                      background: isSelected 
                        ? `linear-gradient(135deg, ${branding.colors.primary}10 0%, ${branding.colors.secondary}10 100%)`
                        : 'white',
                      boxShadow: isSelected ? `0 8px 20px ${branding.colors.primary}20` : '0 2px 8px rgba(0,0,0,0.05)'
                    }}
                  >
                    {/* Animated background */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: `linear-gradient(135deg, ${branding.colors.primary}05 0%, ${branding.colors.secondary}05 100%)`
                      }}
                    />
                    
                    <div 
                      className="relative p-4 rounded-xl shadow-sm"
                      style={{ background: `${method.id === 'usdt' ? '#10b981' : '#f59e0b'}15` }}
                    >
                      <Icon 
                        className="h-7 w-7"
                        style={{ color: method.id === 'usdt' ? '#10b981' : '#f59e0b' }}
                      />
                    </div>
                    <div className="flex-1 text-left relative">
                      <p className="font-bold text-gray-900 text-lg">{method.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {method.id === 'usdt' ? 'TRC20 Network' : 'BTC Network'}
                      </p>
                    </div>
                    <div 
                      className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 relative transition-all"
                      style={{
                        borderColor: isSelected ? branding.colors.primary : '#d1d5db',
                        background: isSelected ? branding.colors.primary : 'transparent'
                      }}
                    >
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                          className="w-3 h-3 bg-white rounded-full"
                        />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Amount Input */}
            {selectedMethod && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div>
                  <Label htmlFor="amount" className="text-base font-semibold text-gray-700">
                    Enter Amount {selectedMethod === 'bitcoin' ? '(in BTC)' : `(${currency.symbol})`}
                  </Label>
                  <div className="relative mt-2">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">
                      {selectedMethod === 'bitcoin' ? '₿' : currency.symbol}
                    </span>
                    <Input
                      id="amount"
                      type="number"
                      step={selectedMethod === 'bitcoin' ? '0.0001' : '0.01'}
                      min={selectedMethod === 'bitcoin' ? '0.0001' : '10'}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder={selectedMethod === 'bitcoin' ? '0.0000' : '0.00'}
                      required
                      className="pl-8 h-14 text-lg border-gray-300 focus:border-violet-500 focus:ring-violet-500"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {selectedMethod === 'bitcoin' 
                      ? 'Minimum deposit: 0.0001 BTC' 
                      : `Minimum deposit: ${formatAmount(10)}`}
                  </p>
                </div>

                {/* Payment Details */}
                {selectedMethod === 'usdt' && settings.payment.usdtWalletAddress && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-4">
                    <h4 className="font-semibold text-green-900 text-lg">USDT Deposit Information</h4>
                    
                    {/* Important Notice */}
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-yellow-800">Important Information</p>
                          <ul className="text-xs text-yellow-700 mt-1 space-y-1 list-disc list-inside">
                            <li>Network: <strong>TRC20 (TRON)</strong></li>
                            <li>Minimum deposit: <strong>$10 USDT</strong></li>
                            <li>Confirmations required: <strong>1 confirmation</strong></li>
                            <li>Processing time: <strong>10-30 minutes</strong></li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    {/* QR Code */}
                    <div className="flex justify-center">
                      <div className="bg-white p-4 rounded-lg border-2 border-green-300 shadow-sm">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(settings.payment.usdtWalletAddress)}`}
                          alt="USDT QR Code"
                          className="w-48 h-48"
                        />
                        <p className="text-xs text-center text-gray-600 mt-2">Scan with your wallet app</p>
                      </div>
                    </div>
                    
                    {/* Wallet Address */}
                    <div>
                      <Label className="text-sm font-semibold text-green-900">Wallet Address (TRC20)</Label>
                      <div className="bg-white rounded-lg p-3 border border-green-200 mt-1">
                        <p className="text-sm font-mono text-gray-800 break-all">{settings.payment.usdtWalletAddress}</p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(settings.payment.usdtWalletAddress, 'USDT Address')}
                          className="mt-2 w-full"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Address
                        </Button>
                      </div>
                    </div>
                    
                    {/* Instructions */}
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <h5 className="font-semibold text-green-900 text-sm mb-2">How to Deposit:</h5>
                      <ol className="text-xs text-gray-700 space-y-1.5 list-decimal list-inside">
                        <li>Open your USDT wallet (Trust Wallet, Binance, etc.)</li>
                        <li>Select <strong>Send USDT</strong> and choose <strong>TRC20 network</strong></li>
                        <li>Scan the QR code or paste the wallet address above</li>
                        <li>Enter the amount you want to deposit (minimum $10)</li>
                        <li>Confirm the transaction and wait for confirmation</li>
                        <li>Your account will be credited automatically after 1 confirmation</li>
                      </ol>
                    </div>
                    
                    {/* Warning */}
                    <div className="bg-red-50 border-l-4 border-red-400 p-3">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-red-800">⚠️ Warning</p>
                          <p className="text-xs text-red-700 mt-1">
                            Only send USDT via <strong>TRC20 network</strong>. Sending via other networks (ERC20, BEP20) will result in loss of funds!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedMethod === 'bitcoin' && settings.payment.btcWalletAddress && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 space-y-4">
                    <h4 className="font-semibold text-orange-900 text-lg">Bitcoin Deposit Information</h4>
                    
                    {/* Important Notice */}
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-yellow-800">Important Information</p>
                          <ul className="text-xs text-yellow-700 mt-1 space-y-1 list-disc list-inside">
                            <li>Network: <strong>Bitcoin (BTC)</strong></li>
                            <li>Minimum deposit: <strong>0.0001 BTC</strong></li>
                            <li>Confirmations required: <strong>3 confirmations</strong></li>
                            <li>Processing time: <strong>30-60 minutes</strong></li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    {/* QR Code */}
                    <div className="flex justify-center">
                      <div className="bg-white p-4 rounded-lg border-2 border-orange-300 shadow-sm">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(settings.payment.btcWalletAddress)}`}
                          alt="Bitcoin QR Code"
                          className="w-48 h-48"
                        />
                        <p className="text-xs text-center text-gray-600 mt-2">Scan with your wallet app</p>
                      </div>
                    </div>
                    
                    {/* Wallet Address */}
                    <div>
                      <Label className="text-sm font-semibold text-orange-900">Bitcoin Wallet Address</Label>
                      <div className="bg-white rounded-lg p-3 border border-orange-200 mt-1">
                        <p className="text-sm font-mono text-gray-800 break-all">{settings.payment.btcWalletAddress}</p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(settings.payment.btcWalletAddress, 'Bitcoin Address')}
                          className="mt-2 w-full"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Address
                        </Button>
                      </div>
                    </div>
                    
                    {/* Instructions */}
                    <div className="bg-white rounded-lg p-4 border border-orange-200">
                      <h5 className="font-semibold text-orange-900 text-sm mb-2">How to Deposit:</h5>
                      <ol className="text-xs text-gray-700 space-y-1.5 list-decimal list-inside">
                        <li>Open your Bitcoin wallet (Coinbase, Blockchain, etc.)</li>
                        <li>Select <strong>Send Bitcoin</strong></li>
                        <li>Scan the QR code or paste the wallet address above</li>
                        <li>Enter the amount you want to deposit (minimum 0.0001 BTC)</li>
                        <li>Confirm the transaction and pay the network fee</li>
                        <li>Your account will be credited after 3 network confirmations</li>
                      </ol>
                    </div>
                    
                    {/* Warning */}
                    <div className="bg-red-50 border-l-4 border-red-400 p-3">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-red-800">⚠️ Warning</p>
                          <p className="text-xs text-red-700 mt-1">
                            Only send Bitcoin (BTC) to this address. Sending other cryptocurrencies will result in permanent loss of funds!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}


                <Button
                  type="submit"
                  disabled={loading || !amount}
                  className="w-full h-12 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold text-base shadow-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Confirm Deposit
                    </>
                  )}
                </Button>
              </motion.form>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Deposit History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8"
      >
        <Card className="border-none shadow-xl bg-white">
          <CardContent className="p-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-6">Recent Deposits</h3>
            
            {historyLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : depositHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p>No deposits yet</p>
                <p className="text-sm text-gray-400 mt-1">Your deposit history will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {depositHistory.slice(0, 5).map((deposit) => (
                  <div
                    key={deposit.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${
                        deposit.depositMethod === 'USDT' ? 'bg-green-100' :
                        deposit.depositMethod === 'BITCOIN' ? 'bg-orange-100' :
                        'bg-blue-100'
                      }`}>
                        {deposit.depositMethod === 'USDT' ? (
                          <DollarSign className="h-5 w-5 text-green-600" />
                        ) : deposit.depositMethod === 'BITCOIN' ? (
                          <Bitcoin className="h-5 w-5 text-orange-600" />
                        ) : (
                          <Building className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          ${deposit.amount.toLocaleString()} {deposit.currency}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(deposit.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div>
                        {deposit.status === 'PENDING' && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full border border-yellow-200">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Pending
                          </span>
                        )}
                        {deposit.status === 'PROCESSING' && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full border border-blue-200">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Processing
                          </span>
                        )}
                        {deposit.status === 'COMPLETED' && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full border border-green-200">
                            <CheckCircle className="h-3 w-3" />
                            Completed
                          </span>
                        )}
                        {deposit.status === 'FAILED' && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full border border-red-200">
                            <AlertCircle className="h-3 w-3" />
                            Rejected
                          </span>
                        )}
                      </div>
                      {(deposit.status === 'COMPLETED' || deposit.status === 'FAILED') && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteDeposit(deposit.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Confirmation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl">Deposit Submitted!</DialogTitle>
            <DialogDescription className="text-center text-base">
              Your deposit request has been received and is being processed.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Amount:</span>
                <span className="text-sm font-semibold text-gray-900">{formatAmount(Number(amount) || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Method:</span>
                <span className="text-sm font-semibold text-gray-900">
                  {depositMethods.find(m => m.id === selectedMethod)?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <span className="text-sm font-semibold text-yellow-600">Pending</span>
              </div>
            </div>

            <p className="text-sm text-gray-600 text-center">
              You will receive a notification once your deposit is verified and credited to your account.
            </p>

            <Button onClick={handleConfirmClose} className="w-full bg-violet-600 hover:bg-violet-700">
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

