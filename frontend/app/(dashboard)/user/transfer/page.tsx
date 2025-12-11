'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Send, CheckCircle, Loader2, Zap, Shield, TrendingUp, Building2, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useCurrency } from '@/lib/hooks/useCurrency';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api/client';
import { EmailVerificationAlert } from '@/components/EmailVerificationAlert';
import { useAuthStore } from '@/stores/authStore';

export default function LocalTransferPage() {
  
  const { branding } = useBranding();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpId, setOtpId] = useState<string | null>(null);
  const [resendIn, setResendIn] = useState(0);
  const { currency, formatAmount } = useCurrency();
  const router = useRouter();

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const me = await apiClient.get('/auth/me');
        const country = me.data?.country || me.data?.wallet?.currencyCountry;
        if (active && country && country.toUpperCase() !== 'NG') {
          router.replace('/user/international');
        }
      } catch (_) {
        // ignore
      }
    })();
    return () => { active = false; };
  }, [router]);

  const [transferData, setTransferData] = useState({
    beneficiaryName: '',
    accountNumber: '',
    routingCode: '',
    amount: '',
    description: '',
  });

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check email verification FIRST
    if (!user?.isEmailVerified) {
      toast.error('Please verify your email address before making transfers. Check your profile page.');
      return;
    }
    
    setLoading(true);

    try {
      // Start email OTP
      const start = await apiClient.post('/otp/start', {
        purpose: 'TRANSFER',
        metadata: {
          amount: Number(transferData.amount || 0),
          transferType: 'LOCAL',
          beneficiaryName: transferData.beneficiaryName,
          beneficiaryAccount: transferData.accountNumber,
          bankName: 'LOCAL',
          country: 'NG',
          description: transferData.description,
        },
      });
      setOtpId(start.data.otpId);
      setShowOtpModal(true);
      setResendIn(30);
      const t = setInterval(() => setResendIn((s) => { if (s <= 1) { clearInterval(t); return 0; } return s - 1; }), 1000);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to start verification');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerification = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      toast.error('Please enter complete OTP');
      return;
    }
    if (!otpId) {
      toast.error('Verification has not started');
      return;
    }

    setLoading(true);
    try {
      // Verify OTP first
      await apiClient.post('/otp/verify', { otpId, code: otpCode });
      
      // Now submit the actual transfer request
      await apiClient.post('/transfers/request/local', {
        recipientAccount: transferData.accountNumber,
        amount: Number(transferData.amount),
        description: transferData.description || `Transfer to ${transferData.beneficiaryName}`,
      });
      
      toast.success('Transfer request submitted successfully! Awaiting admin approval.');
      setShowOtpModal(false);
      setOtp(['', '', '', '', '', '']);
      
      // Reset form
      setTransferData({
        beneficiaryName: '',
        accountNumber: '',
        routingCode: '',
        amount: '',
        description: '',
      });
      
      // Optionally redirect to transfers page
setTimeout(() => router.push('/user/dashboard'), 1500);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Transfer failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      {/* Email Verification Alert */}
      <EmailVerificationAlert />
      
      {/* Modern Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
                <Send className="h-8 w-8 text-white" />
              </div>
              Local Transfer
            </h1>
            <p className="text-gray-600 mt-3 text-lg">Send money instantly within your country</p>
          </div>
          <div className="hidden md:flex gap-4">
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <Zap className="h-6 w-6 text-yellow-500 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Instant</p>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <Shield className="h-6 w-6 text-green-500 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Secure</p>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <TrendingUp className="h-6 w-6 text-blue-500 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Free</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Local Transfer Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-none shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Building2 className="h-6 w-6 text-blue-600" />
              Transfer Details
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">Fill in the recipient's information</p>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleTransfer} className="space-y-6">
              <div>
                <Label htmlFor="beneficiaryName">Beneficiary Name</Label>
                <Input
                  id="beneficiaryName"
                  value={transferData.beneficiaryName}
                  onChange={(e) => setTransferData({ ...transferData, beneficiaryName: e.target.value })}
                  placeholder="John Doe"
                  required
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="accountNumber">Account Number / Phone</Label>
                  <Input
                    id="accountNumber"
                    value={transferData.accountNumber}
                    onChange={(e) => setTransferData({ ...transferData, accountNumber: e.target.value })}
                    placeholder="0801234567890 or account number"
                    required
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter recipient's phone number or account ID</p>
                </div>

                <div>
                  <Label htmlFor="routingCode">Routing Code / Sort Code</Label>
                  <Input
                    id="routingCode"
                    value={transferData.routingCode}
                    onChange={(e) => setTransferData({ ...transferData, routingCode: e.target.value })}
                    placeholder="123456789"
                    required
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="amount">Amount ({currency.symbol})</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={transferData.amount}
                  onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })}
                  placeholder="0.00"
                  required
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">No fees for local transfers</p>
              </div>

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  value={transferData.description}
                  onChange={(e) => setTransferData({ ...transferData, description: e.target.value })}
                  placeholder="Payment for..."
                  className="mt-1"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-sm text-blue-900 mb-2">Transfer Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-semibold">{formatAmount(parseFloat(transferData.amount || '0') || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transfer Fee:</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-blue-200">
                    <span className="text-gray-900 font-semibold">Total:</span>
                    <span className="font-bold text-blue-600">{formatAmount(parseFloat(transferData.amount || '0') || 0)}</span>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Money
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* OTP Verification Modal */}
      <Dialog open={showOtpModal} onOpenChange={setShowOtpModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Transaction</DialogTitle>
            <DialogDescription>
              Enter the 6-digit code sent to your email address
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className="w-12 h-12 text-center text-lg font-semibold"
                />
              ))}
            </div>

            <div className="text-center text-sm text-gray-600 mt-2">
              Didn't receive it? {resendIn > 0 ? (
                <span>Resend in {resendIn}s</span>
              ) : (
                <button
                  type="button"
                  className="text-blue-600 hover:underline"
                  onClick={async () => {
                    try {
                      const start = await apiClient.post('/otp/start', {
                        purpose: 'TRANSFER',
                        metadata: {
                          amount: Number(transferData.amount || 0),
                          transferType: 'LOCAL',
                          beneficiaryName: transferData.beneficiaryName,
                          beneficiaryAccount: transferData.accountNumber,
                          bankName: 'LOCAL',
                          country: 'NG',
                          description: transferData.description,
                        },
                      });
                      setOtpId(start.data.otpId);
                      setOtp(['','','','','','']);
                      setResendIn(30);
                      const t = setInterval(() => setResendIn((s) => { if (s <= 1) { clearInterval(t); return 0; } return s - 1; }), 1000);
                      toast.success('Code resent to your email');
                    } catch (err: any) {
                      toast.error(err?.response?.data?.message || 'Failed to resend code');
                    }
                  }}
                >
                  Resend to email
                </button>
              )}
            </div>

            <AnimatePresence>
              {otp.join('').length === 6 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex justify-center"
                >
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </motion.div>
              )}
            </AnimatePresence>

            <Button onClick={handleOtpVerification} className="w-full" disabled={loading || otp.join('').length !== 6}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify & Complete'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

