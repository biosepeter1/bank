'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Globe, CheckCircle, Loader2, Send, Zap, Shield, TrendingUp, Building2, Mail, KeyRound } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useCurrency } from '@/lib/hooks/useCurrency';
import { useBranding } from '@/contexts/BrandingContext';
import apiClient from '@/lib/api/client';
import { useRouter } from 'next/navigation';
import { EmailVerificationAlert } from '@/components/EmailVerificationAlert';
import { useAuthStore } from '@/stores/authStore';

export default function InternationalTransferPage() {
  
  const { branding } = useBranding();
  const { user } = useAuthStore();
  const { currency, formatAmount } = useCurrency();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpId, setOtpId] = useState<string | null>(null);
  const [resendIn, setResendIn] = useState(0);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [currentCodeType, setCurrentCodeType] = useState<'COT' | 'IMF' | 'TAX' | null>(null);
  const [verifiedCodes, setVerifiedCodes] = useState<Set<string>>(new Set());

  const [transferData, setTransferData] = useState({
    beneficiaryName: '',
    accountNumber: '',
    swiftCode: '',
    iban: '',
    bankName: '',
    country: '',
    amount: '',
    description: '',
    cot: '',
    imf: '',
    tax: '',
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
      // Basic client-side required checks
      const requiredFields = [
        transferData.beneficiaryName,
        transferData.bankName,
        transferData.country,
        transferData.accountNumber,
        transferData.swiftCode,
        transferData.amount,
      ];
      if (requiredFields.some((v) => !v || String(v).trim() === '')) {
        toast.error('Please complete all required fields');
        setLoading(false);
        return;
      }

      // Start email OTP for international transfer
      const start = await apiClient.post('/otp/start', {
        purpose: 'TRANSFER',
        metadata: {
          amount: Number(transferData.amount || 0),
          transferType: 'INTERNATIONAL',
          beneficiaryName: transferData.beneficiaryName,
          beneficiaryAccount: transferData.accountNumber,
          bankName: transferData.bankName,
          swiftCode: transferData.swiftCode,
          iban: transferData.iban,
          country: transferData.country,
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

  const submitInternational = async () => {
    await apiClient.post('/transfers/international', {
      beneficiaryName: transferData.beneficiaryName,
      beneficiaryAccount: transferData.accountNumber,
      bankName: transferData.bankName,
      swiftCode: transferData.swiftCode || undefined,
      amount: Number(transferData.amount),
      currency: currency.code,
      description: transferData.description || `International transfer to ${transferData.beneficiaryName}`,
      country: transferData.country,
    });
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

      // Try to submit transfer
      await submitInternational();
      toast.success('International transfer submitted successfully!');
      setShowOtpModal(false);
      setOtp(['', '', '', '', '', '']);
      setTransferData({
        beneficiaryName: '',
        accountNumber: '',
        swiftCode: '',
        iban: '',
        bankName: '',
        country: '',
        amount: '',
        description: '',
        cot: '',
        imf: '',
        tax: '',
      });
      setTimeout(() => router.push('/user/dashboard'), 1200);
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || '';
      // Check if codes are required
      if (errorMsg.includes('Transfer codes required') || errorMsg.includes('COT')) {
        setShowOtpModal(false);
        setOtp(['', '', '', '', '', '']);
        // Start the code verification flow
        const allCodes: Array<'COT' | 'IMF' | 'TAX'> = ['COT', 'IMF', 'TAX'];
        const firstUnverified = allCodes.find(type => !verifiedCodes.has(type));
        if (firstUnverified) {
          setCurrentCodeType(firstUnverified);
          setShowCodeModal(true);
        }
      } else {
        toast.error(errorMsg || 'Transfer failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCodeRequest = async () => {
    if (!currentCodeType) return;
    
    try {
      await apiClient.post('/transfers/codes/request', { type: currentCodeType });
      toast.success(`${currentCodeType} code request sent. Admin will approve shortly.`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || `Failed to request ${currentCodeType} code`);
    }
  };

  const handleCodeVerify = async () => {
    if (!currentCodeType || !transferData[currentCodeType.toLowerCase() as 'cot' | 'imf' | 'tax']) {
      toast.error('Please enter the code');
      return;
    }

    setLoading(true);
    try {
      const codeValue = transferData[currentCodeType.toLowerCase() as 'cot' | 'imf' | 'tax'];
      const result = await apiClient.post('/transfers/codes/verify', { 
        type: currentCodeType, 
        code: codeValue 
      });
      
      if (result.data.verified) {
        // Mark this code as verified
        const newVerified = new Set(verifiedCodes);
        newVerified.add(currentCodeType);
        setVerifiedCodes(newVerified);
        toast.success(`${currentCodeType} code verified!`);
        
        // Move to next code or complete transfer
        const allCodes: Array<'COT' | 'IMF' | 'TAX'> = ['COT', 'IMF', 'TAX'];
        const nextCode = allCodes.find(type => !newVerified.has(type));
        
        if (nextCode) {
          setCurrentCodeType(nextCode);
        } else {
          // All codes verified, retry transfer
          setShowCodeModal(false);
          try {
            await submitInternational();
            toast.success('International transfer submitted successfully!');
            setTransferData({
              beneficiaryName: '',
              accountNumber: '',
              swiftCode: '',
              iban: '',
              bankName: '',
              country: '',
              amount: '',
              description: '',
              cot: '',
              imf: '',
              tax: '',
            });
            setVerifiedCodes(new Set());
            setTimeout(() => router.push('/user/dashboard'), 1200);
          } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Transfer failed');
          }
        }
      } else {
        toast.error('Invalid code. Please try again.');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Code verification failed');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 p-6">
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
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <div 
                className="p-3 rounded-2xl shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)`
                }}
              >
                <Globe className="h-8 w-8 text-white" />
              </div>
              <span style={{ color: branding.colors.primary }}>International Wire Transfer</span>
            </h1>
            <p className="text-gray-600 mt-3 text-lg">Send money across borders securely</p>
          </div>
          <div className="hidden md:flex gap-4">
            <div className="text-center p-4 bg-white rounded-xl shadow-sm border">
              <Zap className="h-6 w-6 mx-auto mb-1" style={{ color: branding.colors.secondary }} />
              <p className="text-xs text-gray-600">Fast</p>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm border">
              <Shield className="h-6 w-6 mx-auto mb-1" style={{ color: branding.colors.primary }} />
              <p className="text-xs text-gray-600">Secure</p>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm border">
              <TrendingUp className="h-6 w-6 mx-auto mb-1" style={{ color: branding.colors.secondary }} />
              <p className="text-xs text-gray-600">Best Rates</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* International Transfer Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-none shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader 
            className="border-b"
            style={{
              background: `linear-gradient(135deg, ${branding.colors.primary}15 0%, ${branding.colors.secondary}15 100%)`
            }}
          >
            <CardTitle className="text-2xl font-bold flex items-center gap-2" style={{ color: branding.colors.primary }}>
              <Building2 className="h-6 w-6" style={{ color: branding.colors.primary }} />
              Transfer Details
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">Fill in the recipient's international banking information</p>
          </CardHeader>
          <CardContent className="pt-8">
            <form onSubmit={handleTransfer} className="space-y-8">
              {/* Beneficiary Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <div 
                    className="w-1 h-6 rounded-full"
                    style={{ background: branding.colors.primary }}
                  />
                  <h3 className="font-semibold text-lg text-gray-800">Recipient Information</h3>
                </div>
                
                <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl border shadow-sm space-y-4">
                  <div>
                    <Label htmlFor="beneficiaryName" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <span>Beneficiary Name</span>
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="beneficiaryName"
                      value={transferData.beneficiaryName}
                      onChange={(e) => setTransferData({ ...transferData, beneficiaryName: e.target.value })}
                      placeholder="e.g., John Doe"
                      required
                      className="mt-2 h-11 border-gray-300 focus:border-transparent focus:ring-2 transition-all"
                      style={{ '--tw-ring-color': branding.colors.primary } as any}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bankName" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <span>Bank Name</span>
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="bankName"
                        value={transferData.bankName}
                        onChange={(e) => setTransferData({ ...transferData, bankName: e.target.value })}
                        placeholder="e.g., Bank of America"
                        required
                        className="mt-2 h-11 border-gray-300 focus:border-transparent focus:ring-2 transition-all"
                        style={{ '--tw-ring-color': branding.colors.primary } as any}
                      />
                    </div>

                    <div>
                      <Label htmlFor="country" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <span>Country</span>
                        <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={transferData.country}
                        onValueChange={(value) => setTransferData({ ...transferData, country: value })}
                      >
                        <SelectTrigger className="mt-2 h-11 border-gray-300">
                          <SelectValue placeholder="Select destination country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us">🇺🇸 United States</SelectItem>
                          <SelectItem value="uk">🇬🇧 United Kingdom</SelectItem>
                          <SelectItem value="ca">🇨🇦 Canada</SelectItem>
                          <SelectItem value="au">🇦🇺 Australia</SelectItem>
                          <SelectItem value="de">🇩🇪 Germany</SelectItem>
                          <SelectItem value="fr">🇫🇷 France</SelectItem>
                          <SelectItem value="jp">🇯🇵 Japan</SelectItem>
                          <SelectItem value="cn">🇨🇳 China</SelectItem>
                          <SelectItem value="in">🇮🇳 India</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Banking Details Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <div 
                    className="w-1 h-6 rounded-full"
                    style={{ background: branding.colors.primary }}
                  />
                  <h3 className="font-semibold text-lg text-gray-800">Banking Details</h3>
                </div>
                
                <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl border shadow-sm space-y-4">
                  <div>
                    <Label htmlFor="accountNumber" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <span>Account Number</span>
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="accountNumber"
                      value={transferData.accountNumber}
                      onChange={(e) => setTransferData({ ...transferData, accountNumber: e.target.value })}
                      placeholder="Enter account number"
                      required
                      className="mt-2 h-11 border-gray-300 focus:border-transparent focus:ring-2 transition-all font-mono"
                      style={{ '--tw-ring-color': branding.colors.primary } as any}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="swiftCode" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <span>SWIFT/BIC Code</span>
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="swiftCode"
                        value={transferData.swiftCode}
                        onChange={(e) => setTransferData({ ...transferData, swiftCode: e.target.value.toUpperCase() })}
                        placeholder="e.g., ABCDUS33XXX"
                        required
                        className="mt-2 h-11 border-gray-300 focus:border-transparent focus:ring-2 transition-all uppercase font-mono"
                        style={{ '--tw-ring-color': branding.colors.primary } as any}
                        maxLength={11}
                      />
                      <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                        <span className="inline-block w-1 h-1 rounded-full bg-gray-400"></span>
                        8 or 11 characters
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="iban" className="text-sm font-medium text-gray-700">IBAN (Optional)</Label>
                      <Input
                        id="iban"
                        value={transferData.iban}
                        onChange={(e) => setTransferData({ ...transferData, iban: e.target.value.toUpperCase() })}
                        placeholder="e.g., GB29NWBK60161331926819"
                        className="mt-2 h-11 border-gray-300 focus:border-transparent focus:ring-2 transition-all uppercase font-mono"
                        style={{ '--tw-ring-color': branding.colors.primary } as any}
                      />
                      <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                        <span className="inline-block w-1 h-1 rounded-full bg-gray-400"></span>
                        For European transfers
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transfer Amount Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <div 
                    className="w-1 h-6 rounded-full"
                    style={{ background: branding.colors.primary }}
                  />
                  <h3 className="font-semibold text-lg text-gray-800">Transfer Amount</h3>
                </div>
                
                <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl border shadow-sm space-y-4">
                  <div>
                    <Label htmlFor="amount" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <span>Amount ({currency.symbol})</span>
                      <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative mt-2">
                      <span 
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold"
                        style={{ color: branding.colors.primary }}
                      >
                        {currency.symbol}
                      </span>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        value={transferData.amount}
                        onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })}
                        placeholder="0.00"
                        required
                        className="h-14 pl-12 text-lg font-semibold border-gray-300 focus:border-transparent focus:ring-2 transition-all"
                        style={{ '--tw-ring-color': branding.colors.primary } as any}
                      />
                    </div>
                    {transferData.amount && parseFloat(transferData.amount) > 0 && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-gray-600 mt-2 flex items-center gap-1.5"
                      >
                        <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: branding.colors.secondary }}></span>
                        Transfer fee: <span className="font-semibold">{formatAmount((parseFloat(transferData.amount) || 0) * 0.02)}</span> (2%)
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description (Optional)</Label>
                    <Input
                      id="description"
                      value={transferData.description}
                      onChange={(e) => setTransferData({ ...transferData, description: e.target.value })}
                      placeholder="e.g., Payment for services, Invoice #123"
                      className="mt-2 h-11 border-gray-300 focus:border-transparent focus:ring-2 transition-all"
                      style={{ '--tw-ring-color': branding.colors.primary } as any}
                    />
                  </div>

                  <div 
                    className="p-4 rounded-lg border flex items-center gap-3"
                    style={{ 
                      background: `linear-gradient(135deg, ${branding.colors.primary}08 0%, ${branding.colors.secondary}08 100%)`,
                      borderColor: `${branding.colors.primary}20`
                    }}
                  >
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: `${branding.colors.primary}15` }}
                    >
                      <Building2 className="w-5 h-5" style={{ color: branding.colors.primary }} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Payment Method</p>
                      <p className="text-xs text-gray-500 mt-0.5">Bank Transfer via SWIFT Network</p>
                    </div>
                  </div>
                </div>
              </div>


              {/* Transfer Summary */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl p-6 shadow-lg border-2"
                style={{
                  background: `linear-gradient(135deg, ${branding.colors.primary}12 0%, ${branding.colors.secondary}12 100%)`,
                  borderColor: `${branding.colors.primary}25`
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)` }}
                  >
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="font-bold text-lg" style={{ color: branding.colors.primary }}>Transfer Summary</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 text-sm">Transfer Amount</span>
                    <span className="font-semibold text-gray-900 text-base">{formatAmount(parseFloat(transferData.amount || '0') || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 text-sm">Service Fee (2%)</span>
                    <span className="font-semibold text-gray-900 text-base">{formatAmount((parseFloat(transferData.amount || '0') || 0) * 0.02)}</span>
                  </div>
                  <div 
                    className="flex justify-between items-center pt-4 mt-2 border-t-2"
                    style={{ borderColor: `${branding.colors.primary}30` }}
                  >
                    <span className="text-gray-900 font-bold text-base">Total Debit</span>
                    <span 
                      className="font-bold text-2xl"
                      style={{ color: branding.colors.primary }}
                    >
                      {formatAmount((parseFloat(transferData.amount || '0') || 0) * 1.02)}
                    </span>
                  </div>
                </div>
              </motion.div>

              <Button 
                type="submit" 
                className="w-full text-white shadow-lg transition-all duration-300 hover:shadow-xl" 
                style={{
                  background: `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)`
                }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send International Transfer
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* OTP Verification Modal - Enhanced */}
      <Dialog open={showOtpModal} onOpenChange={setShowOtpModal}>
        <DialogContent className="sm:max-w-md overflow-hidden border-0 shadow-2xl">
          {/* Animated Background Gradient */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              background: `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)`
            }}
          />
          
          {/* Decorative Circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-10 blur-3xl"
            style={{ background: branding.colors.primary }}
          />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full opacity-10 blur-3xl"
            style={{ background: branding.colors.secondary }}
          />
          
          <DialogHeader className="relative z-10">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="mx-auto mb-4 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)`
              }}
            >
              <Shield className="w-8 h-8 text-white" />
            </motion.div>
            <DialogTitle className="text-center text-2xl font-bold" style={{ color: branding.colors.primary }}>
              Verify Transaction
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              Enter the 6-digit code sent to your email
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-6 relative z-10">
            {/* OTP Input with Enhanced Styling */}
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Input
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className="w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl transition-all duration-200 focus:scale-110"
                    style={{
                      borderColor: digit ? branding.colors.primary : '#e5e7eb',
                      color: branding.colors.primary,
                      boxShadow: digit ? `0 0 0 3px ${branding.colors.primary}20` : 'none'
                    }}
                  />
                </motion.div>
              ))}
            </div>

            {/* Success Animation */}
            <AnimatePresence>
              {otp.join('').length === 6 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ type: "spring", duration: 0.5 }}
                  className="flex justify-center"
                >
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full blur-xl animate-pulse"
                      style={{ background: branding.colors.secondary }}
                    />
                    <CheckCircle className="h-16 w-16 relative z-10" style={{ color: branding.colors.secondary }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Timer/Resend Section */}
            <div className="text-center">
              {resendIn > 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                  style={{ 
                    background: `${branding.colors.primary}10`,
                    color: branding.colors.primary 
                  }}
                >
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: branding.colors.primary }} />
                  Code expires in {resendIn}s
                </motion.div>
              ) : (
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-105 shadow-lg"
                  style={{ 
                    background: `linear-gradient(135deg, ${branding.colors.primary}15 0%, ${branding.colors.secondary}15 100%)`,
                    color: branding.colors.primary,
                    border: `2px solid ${branding.colors.primary}30`
                  }}
                  onClick={async () => {
                    try {
                      const start = await apiClient.post('/otp/start', {
                        purpose: 'TRANSFER',
                        metadata: {
                          amount: Number(transferData.amount || 0),
                          transferType: 'INTERNATIONAL',
                          beneficiaryName: transferData.beneficiaryName,
                          beneficiaryAccount: transferData.accountNumber,
                          bankName: transferData.bankName,
                          swiftCode: transferData.swiftCode,
                          iban: transferData.iban,
                          country: transferData.country,
                          description: transferData.description,
                        },
                      });
                      setOtpId(start.data.otpId);
                      setOtp(['', '', '', '', '', '']);
                      setResendIn(30);
                      const t = setInterval(() => setResendIn((s) => { if (s <= 1) { clearInterval(t); return 0; } return s - 1; }), 1000);
                      toast.success('Code resent to your email');
                    } catch (err: any) {
                      toast.error(err?.response?.data?.message || 'Failed to resend code');
                    }
                  }}
                >
                  <Mail className="w-4 h-4" />
                  Resend Code
                </button>
              )}
            </div>

            {/* Verify Button */}
            <Button 
              onClick={handleOtpVerification} 
              className="w-full h-12 text-base font-semibold shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl text-white" 
              disabled={loading || otp.join('').length !== 6}
              style={{
                background: `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)`
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Verify & Complete Transfer
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* COT/IMF/TAX Code Modal - Enhanced */}
      <Dialog open={showCodeModal} onOpenChange={setShowCodeModal}>
        <DialogContent className="sm:max-w-lg overflow-hidden border-0 shadow-2xl">
          {/* Animated Background */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              background: `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)`
            }}
          />
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-3xl"
            style={{ background: branding.colors.secondary }}
          />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-10 blur-3xl"
            style={{ background: branding.colors.primary }}
          />

          <DialogHeader className="relative z-10">
            {/* Animated Icon */}
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="mx-auto mb-4 w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)`
              }}
            >
              {/* Shimmer Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />
              <KeyRound className="w-10 h-10 text-white relative z-10" />
            </motion.div>

            <DialogTitle className="text-center text-2xl font-bold" style={{ color: branding.colors.primary }}>
              {currentCodeType} Verification Required
            </DialogTitle>
            <DialogDescription className="text-center text-base px-4">
              {currentCodeType === 'COT' && '🔐 Cost of Transfer code is required for international compliance'}
              {currentCodeType === 'IMF' && '🌍 International Monetary Fund code ensures regulatory compliance'}
              {currentCodeType === 'TAX' && '📋 Tax clearance code is required for legal compliance'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-6 relative z-10">
            {/* Enhanced Info Box */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl p-4 border-2 shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${branding.colors.primary}08 0%, ${branding.colors.secondary}08 100%)`,
                borderColor: `${branding.colors.primary}30`
              }}
            >
              <div className="flex items-start gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md"
                  style={{ background: `${branding.colors.primary}20` }}
                >
                  <Shield className="w-5 h-5" style={{ color: branding.colors.primary }} />
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1" style={{ color: branding.colors.primary }}>
                    📢 Important Notice
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    This security code must be issued by our admin team. Click <strong>"Request Code"</strong> to submit your request, then check your email for the code.
                  </p>
                </div>
              </div>
            </motion.div>
            
            {/* Code Input with Enhanced Styling */}
            <div>
              <Label 
                htmlFor="transferCode" 
                className="text-base font-semibold mb-3 flex items-center gap-2"
                style={{ color: branding.colors.primary }}
              >
                <KeyRound className="w-4 h-4" />
                Enter {currentCodeType} Code
              </Label>
              <div className="relative">
                <Input
                  id="transferCode"
                  type="text"
                  placeholder="XXXX-XXXX-XXXX"
                  value={transferData[currentCodeType?.toLowerCase() as 'cot' | 'imf' | 'tax'] || ''}
                  onChange={(e) => setTransferData({
                    ...transferData,
                    [currentCodeType?.toLowerCase() as string]: e.target.value.toUpperCase()
                  })}
                  className="mt-2 h-14 text-center text-lg font-bold tracking-wider border-2 rounded-xl uppercase transition-all"
                  style={{
                    borderColor: transferData[currentCodeType?.toLowerCase() as 'cot' | 'imf' | 'tax'] ? branding.colors.primary : '#e5e7eb',
                    color: branding.colors.primary
                  }}
                />
                {transferData[currentCodeType?.toLowerCase() as 'cot' | 'imf' | 'tax'] && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: `${branding.colors.secondary}20` }}
                    >
                      <CheckCircle className="w-5 h-5" style={{ color: branding.colors.secondary }} />
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Progress Tracker */}
            <div 
              className="p-4 rounded-xl border shadow-sm"
              style={{ 
                background: `${branding.colors.primary}05`,
                borderColor: `${branding.colors.primary}20`
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Verification Progress</span>
                <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ 
                  background: `${branding.colors.secondary}20`,
                  color: branding.colors.secondary 
                }}>
                  {verifiedCodes.size}/3 Complete
                </span>
              </div>
              <div className="flex gap-2 mt-3">
                {['COT', 'IMF', 'TAX'].map((code) => (
                  <div
                    key={code}
                    className="flex-1 h-2 rounded-full transition-all duration-500"
                    style={{
                      background: verifiedCodes.has(code as any) 
                        ? `linear-gradient(90deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)`
                        : '#e5e7eb'
                    }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs font-medium">
                {['COT', 'IMF', 'TAX'].map((code) => (
                  <span 
                    key={code}
                    style={{ color: verifiedCodes.has(code as any) ? branding.colors.primary : '#9ca3af' }}
                  >
                    {code} {verifiedCodes.has(code as any) && '✓'}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleCodeRequest}
                variant="outline"
                className="flex-1 h-12 font-semibold border-2 transition-all hover:scale-[1.02] hover:shadow-lg"
                style={{
                  borderColor: branding.colors.primary,
                  color: branding.colors.primary
                }}
                disabled={loading}
              >
                <Mail className="w-4 h-4 mr-2" />
                Request Code
              </Button>
              <Button
                onClick={handleCodeVerify}
                className="flex-1 h-12 font-semibold text-white shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                style={{
                  background: `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)`
                }}
                disabled={loading || !transferData[currentCodeType?.toLowerCase() as 'cot' | 'imf' | 'tax']}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Verify Code
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}

