'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { ArrowRightLeft, Loader2, AlertTriangle, Send, Building, Globe } from 'lucide-react';
import apiClient from '@/lib/api/client';
import { toast } from 'react-hot-toast';
import { useCurrency } from '@/lib/hooks/useCurrency';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentBalance: number;
}

type TransferType = 'INTERNAL' | 'DOMESTIC' | 'INTERNATIONAL';

interface Bank {
  name: string;
  code: string;
  country: string;
}

export default function TransferModal({ isOpen, onClose, onSuccess, currentBalance }: TransferModalProps) {
  const { formatAmount, currency } = useCurrency();
  const [transferType, setTransferType] = useState<TransferType>('INTERNAL');
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loadingBanks, setLoadingBanks] = useState(false);
  const [loadingLimits, setLoadingLimits] = useState(false);

  // User context
  const [userCountry, setUserCountry] = useState<string>('NG');

  // Common fields
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  // OTP state
  const [otpId, setOtpId] = useState<string | null>(null);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendIn, setResendIn] = useState(0);

  // Internal transfer fields
  const [recipientId, setRecipientId] = useState('');

  // External transfer fields
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [beneficiaryAccount, setBeneficiaryAccount] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [country, setCountry] = useState('');
  const [swiftCode, setSwiftCode] = useState('');
  const [iban, setIban] = useState('');

  // Bank data
  const [banks, setBanks] = useState<Bank[]>([]);
  const [countries, setCountries] = useState([
    { code: 'NG', name: 'Nigeria' },
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
  ]);

  // Fees and limits
  const [fees, setFees] = useState<any>(null);
  const [limits, setLimits] = useState<any>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load user to determine available transfer options
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const me = await apiClient.get('/auth/me');
        const c = me.data?.country || 'NG';
        if (!active) return;
        setUserCountry(c);
        if (c === 'NG') {
          // Restrict countries to Nigeria only for domestic transfers
          setCountries([{ code: 'NG', name: 'Nigeria' }]);
          setCountry('NG');
        }
      } catch (_) {
        // default NG
        setUserCountry('NG');
        setCountries([{ code: 'NG', name: 'Nigeria' }]);
        setCountry('NG');
      }
    })();
    return () => { active = false; };
  }, []);

  // Lazy load limits/fees only when user enters amount
  useEffect(() => {
    if (isOpen && amount && Number(amount) > 0 && !fees && !limits) {
      fetchLimitsAndFees();
    }
  }, [isOpen, amount, fees, limits]);

  useEffect(() => {
    if (country && (transferType === 'DOMESTIC' || transferType === 'INTERNATIONAL')) {
      fetchBanks(country);
    }
  }, [country, transferType]);

  const fetchLimitsAndFees = async () => {
    setLoadingLimits(true);
    try {
      const response = await apiClient.get('/wallet/limits');
      setFees(response.data.fees);
      setLimits(response.data.limits);
    } catch (error) {
      // Log only in development
      toast.error('Failed to load transfer limits');
    } finally {
      setLoadingLimits(false);
    }
  };

  const fetchBanks = async (countryCode: string) => {
    setLoadingBanks(true);
    setBanks([]);
    setBankName('');
    setBankCode('');
    try {
      const response = await apiClient.get(`/banks?country=${countryCode}`);
      setBanks(response.data.banks || []);
    } catch (error) {
      // Log only in development
      toast.error('Failed to load banks for selected country');
    } finally {
      setLoadingBanks(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!amount || isNaN(Number(amount))) {
      newErrors.amount = 'Please enter a valid amount';
    } else if (Number(amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    } else if (Number(amount) > currentBalance) {
      newErrors.amount = 'Insufficient balance';
    }

    if (transferType === 'INTERNAL') {
      if (!recipientId.trim()) {
        newErrors.recipientId = 'Please enter recipient ID or email';
      }
    } else {
      if (!beneficiaryName.trim()) {
        newErrors.beneficiaryName = 'Please enter beneficiary name';
      }
      if (!beneficiaryAccount.trim()) {
        newErrors.beneficiaryAccount = 'Please enter account number';
      }
      if (!country) {
        newErrors.country = 'Please select a country';
      }
      if (transferType === 'DOMESTIC') {
        if (!bankName) {
          newErrors.bankName = 'Please select a bank';
        }
      }
      if (transferType === 'INTERNATIONAL') {
        if (!bankName) {
          newErrors.bankName = 'Please select a bank';
        }
        if (!swiftCode && !iban) {
          newErrors.swiftCode = 'Please enter SWIFT code or IBAN';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Start OTP flow
    try {
      const start = await apiClient.post('/otp/start', {
        purpose: 'TRANSFER',
        metadata: {
          amount: Number(amount),
          transferType,
          recipientId,
          beneficiaryName,
          beneficiaryAccount,
          bankName,
          country,
        },
      });
      setOtpId(start.data.otpId);
      setShowConfirmation(true);
      setResendIn(30);
      const t = setInterval(() => setResendIn((s) => {
        if (s <= 1) { clearInterval(t); return 0; }
        return s - 1;
      }), 1000);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to start verification');
    }
  };

  const confirmTransfer = async () => {
    if (!otpId) {
      toast.error('Verification not started');
      return;
    }
    const code = otp.join('');
    if (code.length !== 6) {
      toast.error('Enter the 6-digit code');
      return;
    }

    setLoading(true);
    try {
      // Verify OTP first
      await apiClient.post('/otp/verify', { otpId, code });

      if (transferType === 'INTERNAL') {
        const response = await apiClient.post('/transfers/request/local', {
          recipientEmail: recipientId.trim(),
          amount: Number(amount),
          description: description || undefined,
        });
        toast.success('Transfer request submitted. Awaiting admin approval.');
      } else if (transferType === 'INTERNATIONAL') {
        await apiClient.post('/transfers/international', {
          beneficiaryName,
          beneficiaryAccount,
          bankName,
          bankCode: transferType === 'DOMESTIC' ? bankCode : undefined,
          swiftCode: transferType === 'INTERNATIONAL' ? swiftCode : undefined,
          amount: Number(amount),
          currency: currency?.code,
          description: description || undefined,
          country,
        });
        toast.success('International transfer initiated. It may take some time to process.');
      } else {
        // DOMESTIC path could be implemented similarly if backend supports
        toast.error('Domestic transfers are not yet supported.');
        setLoading(false);
        return;
      }

      onSuccess();
      handleClose();
    } catch (error: any) {
      console.error('[TransferModal] Transfer error:', error);
      console.error('[TransferModal] Error response:', error?.response?.data);
      toast.error(error?.response?.data?.message || 'Transfer failed. Please try again.');
      setShowConfirmation(false);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setAmount('');
      setDescription('');
      setRecipientId('');
      setBeneficiaryName('');
      setBeneficiaryAccount('');
      setBankName('');
      setBankCode('');
      setCountry('');
      setSwiftCode('');
      setIban('');
      setErrors({});
      setShowConfirmation(false);
      onClose();
    }
  };

  // Calculate fee based on transfer type and amount
  const calculateFee = () => {
    if (!amount || !fees) return 0;
    const amt = Number(amount);
    let feePercent = 0;
    let minFee = 0;

    switch (transferType) {
      case 'INTERNAL':
        feePercent = fees.internal.percent;
        minFee = fees.internal.min;
        break;
      case 'DOMESTIC':
        feePercent = fees.domestic.percent;
        minFee = fees.domestic.min;
        break;
      case 'INTERNATIONAL':
        feePercent = fees.international.percent;
        minFee = fees.international.min;
        break;
    }

    const calculatedFee = (amt * feePercent) / 100;
    return Math.max(calculatedFee, minFee);
  };

  const fee = calculateFee();
  const totalAmount = (Number(amount) || 0) + fee;
  const remainingBalance = currentBalance - totalAmount;

  if (showConfirmation) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-blue-600" />
              Confirm Transfer
            </DialogTitle>
            <DialogDescription>
              Please review the transfer details before confirming.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium">
                  {transferType === 'INTERNAL' ? 'Internal' : transferType === 'DOMESTIC' ? 'Domestic' : 'International'}
                </span>
              </div>
              {transferType === 'INTERNAL' ? (
                <div className="flex justify-between">
                  <span className="text-gray-600">To:</span>
                  <span className="font-medium">{recipientId}</span>
                </div>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Beneficiary:</span>
                    <span className="font-medium">{beneficiaryName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account:</span>
                    <span className="font-medium">{beneficiaryAccount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bank:</span>
                    <span className="font-medium">{bankName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Country:</span>
                    <span className="font-medium">{countries.find(c => c.code === country)?.name}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium">{formatAmount(Number(amount))}</span>
              </div>
              {fee > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Transfer Fee:</span>
                  <span className="font-medium text-orange-600">{formatAmount(fee)}</span>
                </div>
              )}
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-bold text-blue-600">{formatAmount(totalAmount)}</span>
              </div>
              {description && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Description:</span>
                  <span className="font-medium text-sm">{description}</span>
                </div>
              )}
              <div className="flex justify-between border-t pt-3">
                <span className="text-gray-600">Remaining Balance:</span>
                <span className="font-bold text-green-600">{formatAmount(remainingBalance)}</span>
              </div>
            </div>

            {/* OTP Inputs */}
            <p className="text-sm text-gray-600 text-center">We emailed a 6‑digit verification code to your email address.</p>
            <div className="flex justify-center gap-2 mt-2">
              {otp.map((d, i) => (
                <input
                  key={i}
                  value={d}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, '').slice(0, 1);
                    const next = [...otp];
                    next[i] = v;
                    setOtp(next);
                  }}
                  maxLength={1}
                  className="w-10 h-12 text-center text-lg border rounded"
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
                          amount: Number(amount),
                          transferType,
                          recipientId,
                          beneficiaryName,
                          beneficiaryAccount,
                          bankName,
                          country,
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
                  Resend to email
                </button>
              )}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
              <p className="text-sm text-yellow-800 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                Enter the 6‑digit code sent to your email to confirm this transfer.
              </p>
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <DialogFooter className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowConfirmation(false);
                }}
                disabled={loading}
              >
                Back
              </Button>
              <Button
                onClick={() => {
                  confirmTransfer();
                }}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white font-bold text-lg px-8 py-3"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                ✓ CONFIRM TRANSFER NOW
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5 text-blue-600" />
            Transfer Money
          </DialogTitle>
          <DialogDescription>
            Send money internally, domestically, or internationally.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Balance Info */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Available Balance:</span>
              <span className="font-bold text-blue-600">{formatAmount(currentBalance)}</span>
            </div>
            {amount && Number(amount) > 0 && (
              <>
                {fee > 0 && (
                  <div className="flex items-center justify-between text-sm mt-2 pt-2 border-t border-blue-200">
                    <span className="text-gray-600">Transfer Fee ({transferType === 'DOMESTIC' ? '0.5%' : transferType === 'INTERNATIONAL' ? '2%' : '0%'}):</span>
                    <span className="font-medium text-orange-600">{formatAmount(fee)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm mt-2 pt-2 border-t border-blue-200">
                  <span className="text-gray-600">Total to Deduct:</span>
                  <span className="font-bold text-purple-600">{formatAmount(totalAmount)}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2 pt-2 border-t border-blue-200">
                  <span className="text-gray-600">After Transfer:</span>
                  <span className={`font-bold ${remainingBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatAmount(remainingBalance)}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Limits Info */}
          {loadingLimits && (
            <div className="bg-gray-50 p-3 rounded-lg text-xs flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
              <span className="text-gray-600">Loading transfer limits...</span>
            </div>
          )}
          {!loadingLimits && limits && (
            <div className="bg-gray-50 p-3 rounded-lg text-xs">
              <p className="font-semibold text-gray-700 mb-1">Transfer Limits:</p>
              <div className="flex justify-between text-gray-600">
                <span>Daily: {formatAmount(limits.daily.remaining)} / {formatAmount(limits.daily.limit)}</span>
                <span>Monthly: {formatAmount(limits.monthly.remaining)} / {formatAmount(limits.monthly.limit)}</span>
              </div>
            </div>
          )}

          {/* Transfer Type Tabs */}
          <Tabs value={transferType} onValueChange={(v) => setTransferType(v as TransferType)}>
            <TabsList className={`grid w-full ${userCountry === 'NG' ? 'grid-cols-2' : 'grid-cols-3'}`}>
              <TabsTrigger value="INTERNAL" className="flex items-center gap-2">
                <ArrowRightLeft className="h-4 w-4" />
                Internal
              </TabsTrigger>
              {userCountry === 'NG' && (
                <TabsTrigger value="DOMESTIC" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Domestic
                </TabsTrigger>
              )}
              {userCountry !== 'NG' && (
                <TabsTrigger value="INTERNATIONAL" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  International
                </TabsTrigger>
              )}
            </TabsList>

            {/* Internal Transfer */}
            <TabsContent value="INTERNAL" className="space-y-4">
              <div>
                <Label htmlFor="recipientId">Recipient Email or ID</Label>
                <Input
                  id="recipientId"
                  type="text"
                  placeholder="e.g., user@example.com or user-id-123"
                  value={recipientId}
                  onChange={(e) => setRecipientId(e.target.value)}
                  disabled={loading}
                  className={errors.recipientId ? 'border-red-500' : ''}
                />
                {errors.recipientId && (
                  <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {errors.recipientId}
                  </p>
                )}
              </div>
            </TabsContent>

            {/* Domestic Transfer */}
            <TabsContent value="DOMESTIC" className="space-y-4">
              {userCountry !== 'NG' ? (
                <div className="text-sm text-gray-600">Domestic transfers are only available for your registered country.</div>
              ) : (
                <>
                  <div>
                    <Label htmlFor="dom-beneficiary">Beneficiary Name</Label>
                    <Input
                      id="dom-beneficiary"
                      type="text"
                      placeholder="Enter full name"
                      value={beneficiaryName}
                      onChange={(e) => setBeneficiaryName(e.target.value)}
                      disabled={loading}
                      className={errors.beneficiaryName ? 'border-red-500' : ''}
                    />
                    {errors.beneficiaryName && (
                      <p className="text-sm text-red-500 mt-1">{errors.beneficiaryName}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="dom-account">Account Number</Label>
                    <Input
                      id="dom-account"
                      type="text"
                      placeholder="Enter account number"
                      value={beneficiaryAccount}
                      onChange={(e) => setBeneficiaryAccount(e.target.value)}
                      disabled={loading}
                      className={errors.beneficiaryAccount ? 'border-red-500' : ''}
                    />
                    {errors.beneficiaryAccount && (
                      <p className="text-sm text-red-500 mt-1">{errors.beneficiaryAccount}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="dom-country">Country</Label>
                    <Select value={country} onValueChange={setCountry}>
                      <SelectTrigger className={errors.country ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((c) => (
                          <SelectItem key={c.code} value={c.code}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.country && (
                      <p className="text-sm text-red-500 mt-1">{errors.country}</p>
                    )}
                  </div>

                  {country && loadingBanks && (
                    <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                      <p className="text-sm text-blue-800">Loading banks...</p>
                    </div>
                  )}

                  {country && !loadingBanks && banks.length > 0 && (
                    <div>
                      <Label htmlFor="dom-bank">Bank</Label>
                      <Select value={bankName} onValueChange={(value) => {
                        setBankName(value);
                        const bank = banks.find(b => b.name === value);
                        setBankCode(bank?.code || '');
                      }}>
                        <SelectTrigger className={errors.bankName ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Select bank" />
                        </SelectTrigger>
                        <SelectContent>
                          {banks.map((bank) => (
                            <SelectItem key={bank.code} value={bank.name}>
                              {bank.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.bankName && (
                        <p className="text-sm text-red-500 mt-1">{errors.bankName}</p>
                      )}
                    </div>
                  )}

                  {country && !loadingBanks && banks.length === 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                      <p className="text-sm text-yellow-800">No banks available for this country</p>
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            {/* International Transfer */}
            <TabsContent value="INTERNATIONAL" className="space-y-4">
              <div>
                <Label htmlFor="int-beneficiary">Beneficiary Name</Label>
                <Input
                  id="int-beneficiary"
                  type="text"
                  placeholder="Enter full name"
                  value={beneficiaryName}
                  onChange={(e) => setBeneficiaryName(e.target.value)}
                  disabled={loading}
                  className={errors.beneficiaryName ? 'border-red-500' : ''}
                />
                {errors.beneficiaryName && (
                  <p className="text-sm text-red-500 mt-1">{errors.beneficiaryName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="int-country">Country</Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger className={errors.country ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.country && (
                  <p className="text-sm text-red-500 mt-1">{errors.country}</p>
                )}
              </div>

              <div>
                <Label htmlFor="int-account">Account Number / IBAN</Label>
                <Input
                  id="int-account"
                  type="text"
                  placeholder="Enter account number or IBAN"
                  value={beneficiaryAccount}
                  onChange={(e) => setBeneficiaryAccount(e.target.value)}
                  disabled={loading}
                  className={errors.beneficiaryAccount ? 'border-red-500' : ''}
                />
                {errors.beneficiaryAccount && (
                  <p className="text-sm text-red-500 mt-1">{errors.beneficiaryAccount}</p>
                )}
              </div>

              {country && loadingBanks && (
                <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  <p className="text-sm text-blue-800">Loading banks...</p>
                </div>
              )}

              {country && !loadingBanks && banks.length > 0 && (
                <div>
                  <Label htmlFor="int-bank">Bank Name</Label>
                  <Select value={bankName} onValueChange={setBankName}>
                    <SelectTrigger className={errors.bankName ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select bank" />
                    </SelectTrigger>
                    <SelectContent>
                      {banks.map((bank) => (
                        <SelectItem key={bank.code} value={bank.name}>
                          {bank.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.bankName && (
                    <p className="text-sm text-red-500 mt-1">{errors.bankName}</p>
                  )}
                </div>
              )}

              {country && !loadingBanks && banks.length === 0 && (
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                  <p className="text-sm text-yellow-800">No banks available for this country</p>
                </div>
              )}

              <div>
                <Label htmlFor="swift">SWIFT/BIC Code</Label>
                <Input
                  id="swift"
                  type="text"
                  placeholder="e.g., ABCDUS33"
                  value={swiftCode}
                  onChange={(e) => setSwiftCode(e.target.value)}
                  disabled={loading}
                  className={errors.swiftCode ? 'border-red-500' : ''}
                />
                {errors.swiftCode && (
                  <p className="text-sm text-red-500 mt-1">{errors.swiftCode}</p>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Common Fields */}
          <div>
            <Label htmlFor="amount">Amount ({currency.symbol})</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={loading}
              className={errors.amount ? 'border-red-500' : ''}
            />
            {errors.amount && (
              <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {errors.amount}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              type="text"
              placeholder="e.g., Payment for services"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              maxLength={100}
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
            <p className="text-sm text-yellow-800 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              Double-check all details. Transfers cannot be reversed once completed.
            </p>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !amount || Number(amount) <= 0 || Number(amount) > currentBalance}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Review Transfer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

