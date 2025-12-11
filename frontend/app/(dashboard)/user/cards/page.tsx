'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CreditCard, Plus, Lock, Unlock, Eye, EyeOff, Loader2, AlertCircle, Info, RotateCcw, Wifi, X, Copy, Check, Shield, TrendingUp, Globe, Sliders, Bolt, ArrowRight, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { cardsApi } from '@/lib/api/cards';
import { profileApi } from '@/lib/api/profile';
import { toast } from 'react-hot-toast';
import { useSettings } from '@/contexts/SettingsContext';
import { useBranding } from '@/contexts/BrandingContext';

type CardData = {
  id: string;
  cardNumber: string;
  cardType: string;
  cardBrand: 'VISA' | 'MASTERCARD' | 'AMERICAN_EXPRESS' | 'DISCOVER';
  status: string;
  expiryDate: string;
  cardholderName: string;
  cvv: string;
  createdAt: string;
  balance?: number;
};

type CardRequestData = {
  id: string;
  cardType: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reason?: string;
  rejectionReason?: string;
  createdAt: string;
  reviewedAt?: string;
  card?: CardData;
};

export default function CardsPage() {
  const router = useRouter();
  const { settings } = useSettings();
  const { branding } = useBranding();
  const [cards, setCards] = useState<CardData[]>([]);
  const [cardRequests, setCardRequests] = useState<CardRequestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCardNumber, setShowCardNumber] = useState<{ [key: string]: boolean }>({});
  const [flippedCards, setFlippedCards] = useState<{ [key: string]: boolean }>({});
  const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});
  const [kycStatus, setKycStatus] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Request Card modal state
  const [requestOpen, setRequestOpen] = useState(false);
  const [requestBrand, setRequestBrand] = useState<'VISA' | 'MASTERCARD'>('VISA');
  const [requestTier, setRequestTier] = useState<'STANDARD' | 'GOLD'>('GOLD');
  const [requestReason, setRequestReason] = useState('');

  // Fund Card modal state
  const [fundOpen, setFundOpen] = useState(false);
  const [fundCardId, setFundCardId] = useState<string | null>(null);
  const [fundAmount, setFundAmount] = useState('');
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [walletCurrency, setWalletCurrency] = useState<string>('NGN');
  const [fundSubmitting, setFundSubmitting] = useState(false);

  // Withdraw modal state
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawCardId, setWithdrawCardId] = useState<string | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawSubmitting, setWithdrawSubmitting] = useState(false);

  useEffect(() => {
    fetchCards();
    fetchKycStatus();
  }, []);

  const fetchKycStatus = async () => {
    try {
      const profile = await profileApi.getProfile();
      setKycStatus(profile.kyc?.status || 'APPROVED'); // Default to APPROVED for demo
      if (profile.wallet) {
        setWalletBalance(Number(profile.wallet.balance) || 0);
        setWalletCurrency(profile.wallet.currency || 'NGN');
      }
    } catch (error: any) {
      console.error('Failed to fetch KYC status:', error);
      setKycStatus('APPROVED'); // Default to APPROVED for demo
    }
  };

  const fetchCards = async () => {
    try {
      setLoading(true);
      
      const [cardsData, requestsData] = await Promise.all([
        cardsApi.getUserCards(),
        cardsApi.getUserCardRequests(),
      ]);
      
      // Transform API data to match CardData type
      const transformedCards = cardsData.map((card: any) => ({
        id: card.id,
        cardNumber: card.cardNumber,
        cardType: card.cardType,
        cardBrand: card.cardBrand,
        status: card.status,
        expiryDate: `${card.expiryMonth.toString().padStart(2, '0')}/${card.expiryYear.toString().slice(-2)}`,
        cardholderName: card.cardHolderName,
        cvv: card.cvv || '***',
        createdAt: card.createdAt,
        balance: (card.availableBalance ?? card.balance ?? undefined) as number | undefined,
      }));
      
      setCards(transformedCards);
      setCardRequests(requestsData || []);
      console.log('✅ Cards fetched from API:', transformedCards.length);
    } catch (error: any) {
      console.error('Failed to fetch cards:', error);
      toast.error('Failed to load cards');
      setCards([]);
      setCardRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCard = async () => {
    setRequestOpen(true);
  };

  const submitRequestCard = async () => {
    try {
      setCreating(true);
      const reason = `PREF_BRAND=${requestBrand};TIER=${requestTier}${requestReason ? `;NOTE=${requestReason}` : ''}`;
      const result = await cardsApi.createVirtualCard('VIRTUAL', reason);
      toast.success(result.message || 'Virtual card request submitted');
      setRequestOpen(false);
      setRequestReason('');
      fetchCards();
    } catch (error: any) {
      console.error('Failed to create card:', error);
      toast.error(error?.response?.data?.message || 'Failed to create virtual card');
    } finally {
      setCreating(false);
    }
  };

  const [fullPan, setFullPan] = useState<{ [key: string]: string }>({});

  const toggleCardNumberVisibility = async (cardId: string) => {
    setShowCardNumber((prev) => ({ ...prev, [cardId]: !prev[cardId] }));
    // If turning on and not yet fetched, retrieve full PAN
    if (!showCardNumber[cardId] && !fullPan[cardId]) {
      try {
        const res = await cardsApi.getCardPan(cardId);
        setFullPan((p) => ({ ...p, [cardId]: res.pan }));
      } catch (e: any) {
        toast.error(e?.response?.data?.message || 'Unable to reveal card number');
      }
    }
  };

  const toggleCardFlip = (cardId: string) => {
    setFlippedCards((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  const formatAmount = (amt: number) => {
    try {
      return amt.toLocaleString(undefined, { style: 'currency', currency: walletCurrency || 'NGN', maximumFractionDigits: 2 });
    } catch {
      return `${amt.toLocaleString()} ${walletCurrency || ''}`.trim();
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success(`${field} copied to clipboard`);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const handleCardAction = async (cardId: string, action: 'block' | 'unblock') => {
    if (!confirm(`Are you sure you want to ${action} this card?`)) {
      return;
    }

    try {
      setActionLoading(prev => ({ ...prev, [cardId]: true }));
      
      if (action === 'block') {
        await cardsApi.blockCard(cardId);
        toast.success('Card blocked successfully');
      } else {
        await cardsApi.unblockCard(cardId);
        toast.success('Card unblocked successfully');
      }
      
      fetchCards(); // Refresh the cards list
    } catch (error: any) {
      console.error(`Failed to ${action} card:`, error);
      toast.error(error?.response?.data?.message || `Failed to ${action} card`);
    } finally {
      setActionLoading(prev => ({ ...prev, [cardId]: false }));
    }
  };

  const getCardColor = (brand: string) => {
    switch (brand) {
      case 'VISA':
        return 'from-blue-700 via-blue-800 to-indigo-900';
      case 'MASTERCARD':
        return 'from-rose-600 via-red-700 to-orange-800';
      case 'AMERICAN_EXPRESS':
        return 'from-cyan-700 via-teal-800 to-emerald-900';
      case 'DISCOVER':
        return 'from-orange-600 via-amber-700 to-amber-800';
      default:
        return 'from-slate-700 via-slate-800 to-gray-900';
    }
  };

  // Option A preset themes (UBA / FirstBank)
  const getThemeGradient = (brand: string) => {
    const site = (settings.general.siteName || '').toLowerCase();
    if (site.includes('uba')) {
      // UBA: deep red → orange
      return 'from-red-900 via-red-800 to-orange-600';
    }
    if (site.includes('first') || site.includes('firstbank')) {
      // FirstBank: Visa navy → blue, Mastercard navy → slate
      if (brand === 'MASTERCARD') return 'from-blue-900 via-slate-800 to-slate-700';
      return 'from-blue-900 via-blue-800 to-blue-700';
    }
    return getCardColor(brand);
  };

  // Optional background image from site logo or fallback asset
  const CardBackgroundImage = () => {
    // Don't use external URLs that might have SSL issues
    // Only use local assets or data URLs
    const logoUrl = settings.general.logo || '';
    const isLocalAsset = logoUrl.startsWith('/') || logoUrl.startsWith('data:');
    
    // If logo is external or problematic, use pattern instead
    if (!isLocalAsset || !logoUrl) {
      return <CardPattern />;
    }
    
    return (
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <img 
          src={logoUrl} 
          alt="bg" 
          className="w-full h-full object-cover mix-blend-soft-light"
          onError={(e) => {
            // Hide image on error and don't retry
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
    );
  };

  // Background pattern for cards instead of prominent logo
  const CardPattern = () => (
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full blur-2xl" />
      {/* Geometric pattern */}
      <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-40 h-20 border-2 border-white/20 rounded-full rotate-12" />
        <div className="absolute top-2 left-2 w-36 h-16 border border-white/10 rounded-full rotate-6" />
      </div>
      {/* Dots pattern */}
      <div className="absolute bottom-8 right-8 grid grid-cols-4 gap-2">
        {Array.from({length: 8}).map((_, i) => (
          <div key={i} className="w-1 h-1 bg-white/20 rounded-full" />
        ))}
      </div>
    </div>
  );

  // Card scheme logo (Visa/Mastercard) simplified vector
  const SchemeLogo = ({ brand }: { brand: string }) => {
    if (brand === 'MASTERCARD') {
      return (
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-5">
            <span className="absolute left-0 top-0 h-5 w-5 rounded-full bg-red-600 opacity-90"></span>
            <span className="absolute right-0 top-0 h-5 w-5 rounded-full bg-orange-500 opacity-90 mix-blend-screen"></span>
          </div>
          <span className="text-[10px] uppercase tracking-widest opacity-90">mastercard</span>
        </div>
      );
    }
    // Default VISA style wordmark
    return (
      <span className="text-[14px] font-black italic tracking-wider text-white drop-shadow-sm">VISA</span>
    );
  };

  const getCardBrandName = (brand: string) => {
    switch (brand) {
      case 'VISA':
        return 'Visa';
      case 'MASTERCARD':
        return 'Mastercard';
      case 'AMERICAN_EXPRESS':
        return 'American Express';
      case 'DISCOVER':
        return 'Discover';
      default:
        return brand;
    }
  };

  const parseBrandFromReason = (reason?: string) => {
    if (!reason) return null;
    const m = /(?:PREF_BRAND|BRAND)\s*[:=]\s*(VISA|MASTERCARD)/i.exec(reason);
    return m ? m[1].toUpperCase() : null;
  };

  const brandDetails: Record<'VISA'|'MASTERCARD', { blurb: string; points: string[] }> = {
    VISA: {
      blurb: 'Visa cards are globally accepted and ideal for everyday online purchases.',
      points: [
        'High global acceptance rate',
        'Great for subscriptions and e‑commerce',
        'Strong fraud protection and 3‑D Secure',
      ],
    },
    MASTERCARD: {
      blurb: 'Mastercard offers broad acceptance and excellent reliability worldwide.',
      points: [
        'Wide international coverage',
        'Works well for travel and digital services',
        'Robust security with tokenization',
      ],
    },
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-green-600 bg-green-50';
      case 'BLOCKED':
        return 'text-red-600 bg-red-50';
      case 'EXPIRED':
        return 'text-gray-600 bg-gray-50';
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-50';
      case 'APPROVED':
        return 'text-green-600 bg-green-50';
      case 'REJECTED':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-purple-50">      
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        {/* Hero Section - Modern and Attractive with Brand Colors */}
        <div 
          className="relative overflow-hidden rounded-3xl text-white shadow-2xl"
          style={{
            background: `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)`
          }}
        >
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }} />
          </div>
          
          <div className="relative z-10 p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div className="text-white">
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl md:text-4xl font-bold mb-4"
              >
                Virtual Cards Made Easy
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-white/90 mb-8 text-base md:text-lg leading-relaxed"
              >
                Create virtual cards for secure online payments, subscription management, and more. Our virtual cards offer enhanced security and control over your spending.
              </motion.p>

              {/* Features Grid */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 gap-4 mb-8"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm flex-shrink-0">
                    <Shield className="h-5 w-5 text-white/90" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">Secure Payments</h3>
                    <p className="text-xs text-white/80 leading-relaxed">Protect your main account with separate virtual cards</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm flex-shrink-0">
                    <Globe className="h-5 w-5 text-white/90" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">Global Acceptance</h3>
                    <p className="text-xs text-white/80 leading-relaxed">Use anywhere major cards are accepted online</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm flex-shrink-0">
                    <Sliders className="h-5 w-5 text-white/90" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">Spending Controls</h3>
                    <p className="text-xs text-white/80 leading-relaxed">Set limits and monitor transactions in real-time</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm flex-shrink-0">
                    <Bolt className="h-5 w-5 text-white/90" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">Instant Issuance</h3>
                    <p className="text-xs text-white/80 leading-relaxed">Create and use cards within minutes</p>
                  </div>
                </div>
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button 
                  onClick={handleCreateCard}
                  disabled={creating || kycStatus !== 'APPROVED'}
                  className="bg-white hover:bg-white/90 font-semibold px-6 py-6 text-base shadow-xl hover:shadow-2xl transition-all"
                  style={{
                    color: branding.colors.primary
                  }}
                >
                  {creating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      Apply Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </motion.div>
            </div>

            {/* Right Content - Featured Card Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center"
            >
              <div className="relative mx-auto md:mx-0">
                {/* Card Preview with dynamic brand colors */}
                <div 
                  className="w-96 h-56 rounded-2xl p-6 text-white shadow-2xl transform hover:scale-105 transition-transform duration-300 relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)`
                  }}
                >
                  {/* Bank Logo Watermark on Preview Card */}
                  {settings?.general?.logo && settings.general.logo !== '/logo.png' && (
                    <div className="absolute top-4 right-4 opacity-20 pointer-events-none z-0">
                      <img 
                        src={settings.general.logo} 
                        alt="Bank Logo"
                        className="h-12 w-12 object-contain filter brightness-0 invert mix-blend-soft-light"
                        onError={(e) => e.currentTarget.style.display = 'none'}
                      />
                    </div>
                  )}
                  <CardPattern />
                  
                  {/* Card Header */}
                  <div className="flex justify-between items-center mb-5 relative z-10">
                    <div className="flex items-center gap-2">
                      <Wifi className="h-4 w-4 rotate-90 opacity-80" />
                      <span className="text-xs font-medium opacity-90">Virtual Card</span>
                    </div>
                  </div>

                  {/* Chip */}
                  <div className="mb-5 relative z-10">
                    <div className="w-12 h-10 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-lg shadow-lg">
                      <div className="grid grid-cols-3 gap-[2px] p-2 h-full">
                        {[...Array(9)].map((_, i) => (
                          <div key={i} className="bg-yellow-500/40 rounded-[1px]"></div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Number */}
                  <div className="mb-4 relative z-10">
                    <p className="text-lg font-mono tracking-[0.2em] font-semibold">
                      •••• •••• •••• 1234
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="grid grid-cols-3 items-end relative z-10">
                    <div />
                    <div className="text-center">
                      <p className="text-[10px] opacity-70 uppercase tracking-wider mb-1">Valid Thru</p>
                      <p className="text-sm font-semibold tracking-wider">12/25</p>
                    </div>
                    <div className="flex items-center justify-end">
                      <SchemeLogo brand={'VISA'} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="px-6 pb-6">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                Your Cards
                {cards.length > 0 && (
                  <span className="text-sm font-normal text-gray-500">({cards.length})</span>
                )}
              </h2>
              <p className="text-gray-600 mt-1">Manage and monitor all your cards</p>
            </div>
          </div>
        </motion.div>

      {/* KYC Status Alert */}
      {kycStatus && kycStatus !== 'APPROVED' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Alert className="mb-6 border-yellow-200 bg-yellow-50 shadow-lg">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800">KYC Verification Required</AlertTitle>
          <AlertDescription className="text-yellow-700">
            {kycStatus === 'PENDING' && (
              <>
                Your KYC verification is pending approval. You can request a card once your KYC is approved.
              </>
            )}
            {kycStatus === 'UNDER_REVIEW' && (
              <>
                Your KYC is under review. You can request a card once your KYC is approved.
              </>
            )}
            {kycStatus === 'REJECTED' && (
              <>
                Your KYC was rejected. Please resubmit your KYC documents to request a card.{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto text-yellow-700 underline"
                  onClick={() => router.push('/user/kyc')}
                >
                  Go to KYC
                </Button>
              </>
            )}
            {kycStatus === 'RESUBMIT_REQUIRED' && (
              <>
                You need to resubmit your KYC documents. Please complete KYC to request a card.{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto text-yellow-700 underline"
                  onClick={() => router.push('/user/kyc')}
                >
                  Go to KYC
                </Button>
              </>
            )}
          </AlertDescription>
        </Alert>
        </motion.div>
      )}

      {!kycStatus && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Alert className="mb-6 border-blue-200 bg-blue-50 shadow-lg">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">Complete KYC to Request Cards</AlertTitle>
          <AlertDescription className="text-blue-700">
            Please complete your KYC verification to be able to request cards.{' '}
            <Button
              variant="link"
              className="p-0 h-auto text-blue-700 underline"
              onClick={() => router.push('/user/kyc')}
            >
              Complete KYC
            </Button>
          </AlertDescription>
        </Alert>
        </motion.div>
      )}

      {/* Pending Card Requests */}
      {cardRequests.filter(r => r.status === 'PENDING').length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-6 border-none shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader>
            <CardTitle>Pending Card Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cardRequests
                .filter(r => r.status === 'PENDING')
                .map((request) => {
                  const brand = parseBrandFromReason(request.reason);
                  return (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{request.cardType} Card</p>
                          {brand && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 border border-gray-200 text-gray-700">{getCardBrandName(brand)}</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          Requested {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                        {request.reason && (
                          <p className="text-xs text-gray-500 mt-1 break-all">{request.reason}</p>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
        </motion.div>
      )}

      {loading ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20"
        >
          {/* Animated Card Stack */}
          <div className="relative w-64 h-40 mb-8">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-2xl shadow-2xl"
                style={{
                  background: `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)`,
                  zIndex: 3 - i,
                }}
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{
                  scale: 1 - (i * 0.05),
                  opacity: 1 - (i * 0.2),
                  y: i * 12,
                  rotate: i * 2,
                }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatType: "reverse",
                  repeatDelay: 0.3,
                }}
              >
                {/* Card shimmer effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  }}
                  animate={{
                    x: ['-100%', '200%'],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.2,
                  }}
                />
                {/* Card details placeholder */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-8 h-8 bg-white/20 rounded backdrop-blur-sm" />
                    <div className="w-12 h-6 bg-white/20 rounded backdrop-blur-sm" />
                  </div>
                  <div className="space-y-2 mt-8">
                    <div className="w-48 h-4 bg-white/20 rounded backdrop-blur-sm" />
                    <div className="w-32 h-3 bg-white/20 rounded backdrop-blur-sm" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pulsing dots */}
          <div className="flex gap-2 mb-4">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 rounded-full"
                style={{
                  background: branding.colors.primary,
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
              />
            ))}
          </div>

          <motion.p 
            className="font-medium text-lg"
            style={{ color: branding.colors.primary }}
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          >
            Loading your cards...
          </motion.p>
          <p className="text-gray-500 text-sm mt-2">Please wait a moment</p>
        </motion.div>
      ) : cards.length === 0 && cardRequests.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-none shadow-xl bg-white/90 backdrop-blur-sm">
            <CardContent className="py-16 text-center">
              <div className="p-6 bg-gradient-to-br from-violet-100 to-purple-100 rounded-full w-fit mx-auto mb-6">
                <CreditCard className="h-16 w-16 text-violet-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No Cards Yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Get started by requesting your first virtual card. It's instant and secure!
              </p>
              <Button 
                onClick={handleCreateCard} 
                disabled={creating}
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg"
              >
                {creating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-5 w-5" />
                    Request Your First Card
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, index) => (
            <motion.div 
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Card Visual with Flip */}
              <div className="relative h-56 mb-4 group" style={{ perspective: '1000px' }}>
                <div
                  className="relative w-full h-full transition-transform duration-700 cursor-pointer"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: flippedCards[card.id] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                  onClick={() => toggleCardFlip(card.id)}
                >
                  {/* Front of Card */}
                  <div
                    className="absolute w-full h-full rounded-2xl p-6 text-white shadow-2xl overflow-hidden"
                    style={{ 
                      backfaceVisibility: 'hidden',
                      background: `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)`
                    }}
                  >
                    {/* Bank Logo Watermark */}
                    {settings?.general?.logo && settings.general.logo !== '/logo.png' && (
                      <div className="absolute top-4 right-4 opacity-20 pointer-events-none z-0">
                        <img 
                          src={settings.general.logo} 
                          alt="Bank Logo"
                          className="h-12 w-12 object-contain filter brightness-0 invert mix-blend-soft-light"
                          onError={(e) => e.currentTarget.style.display = 'none'}
                        />
                      </div>
                    )}
                    <CardBackgroundImage />
                    <CardPattern />
                    
                    {/* Card Header */}
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5">
                          <Wifi className="h-4 w-4 rotate-90 opacity-80" />
                          <span className="text-[10px] font-medium opacity-90 tracking-wide">VIRTUAL</span>
                        </div>
                        {typeof card.balance === 'number' && (
                          <div className="text-left flex items-center gap-2">
                            <p className="text-[9px] opacity-80 uppercase tracking-wider leading-none">Balance</p>
                            <p className="px-2 py-0.5 rounded-md bg-white/15 text-white text-xs font-semibold backdrop-blur-sm leading-none">
                              {formatAmount(card.balance)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Chip */}
                    <div className="mb-4 relative z-10">
                      <div className="w-11 h-9 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-md shadow-md">
                        <div className="grid grid-cols-3 gap-[2px] p-1.5 h-full">
                          {[...Array(9)].map((_, i) => (
                            <div key={i} className="bg-yellow-500/40 rounded-[1px]"></div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Card Number */}
                    <div className="mb-3 relative z-10">
                      <p className="text-[1.1rem] font-mono tracking-[0.18em] font-semibold drop-shadow-md leading-tight select-none">
                        {showCardNumber[card.id]
                          ? (fullPan[card.id] || card.cardNumber)
                          : (fullPan[card.id] || card.cardNumber).replace(/[0-9]/g, '•')}
                      </p>
                    </div>

                    {/* Card Footer */}
                    <div className="grid grid-cols-3 items-end relative z-10 gap-2">
                      <div className="min-w-0">
                        <p className="text-[9px] opacity-70 uppercase tracking-wider mb-0.5">Cardholder</p>
                        <p className="text-xs font-semibold uppercase tracking-wide truncate">
                          {card.cardholderName}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-[9px] opacity-70 uppercase tracking-wider mb-0.5">Valid Thru</p>
                        <p className="text-xs font-semibold tracking-wider">{card.expiryDate}</p>
                      </div>
                      <div className="flex items-end justify-end">
                        <div className="pt-1">
                          <SchemeLogo brand={card.cardBrand} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Back of Card */}
                  <div
                    className="absolute w-full h-full rounded-2xl text-white shadow-2xl overflow-hidden"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      background: `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)`
                    }}
                  >
                    {/* Bank Logo Watermark */}
                    {settings?.general?.logo && settings.general.logo !== '/logo.png' && (
                      <div className="absolute top-4 right-4 opacity-15 pointer-events-none z-0">
                        <img 
                          src={settings.general.logo} 
                          alt="Bank Logo"
                          className="h-12 w-12 object-contain filter brightness-0 invert mix-blend-soft-light"
                          onError={(e) => e.currentTarget.style.display = 'none'}
                        />
                      </div>
                    )}
                    <CardBackgroundImage />
                    <CardPattern />
                    
                    {/* Magnetic Strip */}
                    <div className="w-full h-12 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 absolute top-8 left-0 shadow-inner"></div>

                    {/* CVV Section */}
                    <div className="mt-24 px-6">
                      <div className="bg-white/95 backdrop-blur-sm text-gray-800 p-3 rounded-lg shadow-lg">
                        <div className="flex justify-between items-center gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Security Code</p>
                            <p className="text-xl font-mono font-bold tracking-widest">{card.cvv}</p>
                          </div>
                          <div className="bg-gray-100 p-2 rounded-lg flex-shrink-0">
                            <CreditCard className="h-5 w-5 text-gray-600" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Company Watermark - Very Subtle */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02]">
                      <p className="text-5xl font-black text-white tracking-[0.3em] select-none">{settings.general.siteName?.toUpperCase() || 'BANK'}</p>
                    </div>
                    
                    {/* Additional Info */}
                    <div className="mt-6 px-6 text-[10px] opacity-90 space-y-1 leading-relaxed">
                      <p className="font-medium">{settings.general.siteName}</p>
                      {settings.general.supportPhone && (
                        <p className="opacity-80">Customer Service: {settings.general.supportPhone}</p>
                      )}
                    </div>
                    
                    {/* Brand / Scheme */}
                    <div className="absolute bottom-5 right-6 opacity-90">
                      <SchemeLogo brand={card.cardBrand} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(
                      card.status
                    )}`}
                  >
                    {card.status}
                  </span>
                  <span className="text-xs text-gray-500">
                    Created {new Date(card.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Consolidated Actions */}
                <div className="flex w-full flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                  {/* Money actions: Fund / Withdraw */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        className="w-full sm:w-auto rounded-full text-white shadow-md"
                        style={{
                          background: `linear-gradient(to right, ${branding.colors.primary}, ${branding.colors.secondary})`
                        }}
                      >
                        <TrendingUp className="h-4 w-4" />
                        Move money
                        <ChevronDown className="h-4 w-4 ml-1 opacity-90" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem disabled className="opacity-70">
                        <span className="text-xs">Card balance: {typeof card.balance === 'number' ? formatAmount(card.balance) : '—'} • Wallet: {walletBalance.toLocaleString()} {walletCurrency}</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => { setFundCardId(card.id); setFundAmount(''); setFundOpen(true); }}>
                        <TrendingUp className="h-4 w-4 mr-2" /> Fund card
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setWithdrawCardId(card.id); setWithdrawAmount(''); setWithdrawOpen(true); }}>
                        <TrendingUp className="h-4 w-4 mr-2 rotate-180" /> Withdraw to wallet
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* More actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full sm:w-auto rounded-full sm:ml-auto">
                        More
                        <ChevronDown className="h-4 w-4 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => toggleCardNumberVisibility(card.id)}>
                        {showCardNumber[card.id] ? (
                          <EyeOff className="h-4 w-4 mr-2" />
                        ) : (
                          <Eye className="h-4 w-4 mr-2" />
                        )}
                        {showCardNumber[card.id] ? 'Hide number' : 'Show number'}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleCardFlip(card.id)}>
                        <RotateCcw className="h-4 w-4 mr-2" /> {flippedCards[card.id] ? 'Show front' : 'View CVV'}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {card.status === 'ACTIVE' ? (
                        <DropdownMenuItem onClick={() => handleCardAction(card.id, 'block')} disabled={actionLoading[card.id]}>
                          <Lock className="h-4 w-4 mr-2" /> Block card
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => handleCardAction(card.id, 'unblock')} disabled={actionLoading[card.id]}>
                          <Unlock className="h-4 w-4 mr-2" /> Unblock card
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setSelectedCard(card)}>
                        <CreditCard className="h-4 w-4 mr-2" /> Card details
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Request Card Modal */}
      <Dialog open={requestOpen} onOpenChange={setRequestOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request a Virtual Card</DialogTitle>
            <DialogDescription>Select brand and tier, then submit your request.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm">Brand</Label>
              <Select value={requestBrand} onValueChange={(v:any)=>setRequestBrand(v)}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select brand"/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="VISA">Visa</SelectItem>
                  <SelectItem value="MASTERCARD">Mastercard</SelectItem>
                </SelectContent>
              </Select>
              <div className="mt-3 p-3 bg-gray-50 rounded-lg border text-sm text-gray-700">
                <p className="font-medium mb-1">{getCardBrandName(requestBrand)} overview</p>
                <p className="mb-2">{brandDetails[requestBrand].blurb}</p>
                <ul className="list-disc list-inside space-y-1">
                  {brandDetails[requestBrand].points.map((p,i)=>(<li key={i}>{p}</li>))}
                </ul>
              </div>
            </div>
            <div>
              <Label className="text-sm">Tier</Label>
              <Select value={requestTier} onValueChange={(v:any)=>setRequestTier(v)}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select tier"/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="STANDARD">Standard — no annual fee</SelectItem>
                  <SelectItem value="GOLD">Gold — higher limits and perks</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm">Reason (optional)</Label>
              <Input value={requestReason} onChange={(e)=>setRequestReason(e.target.value)} placeholder="Any note for admin"/>
            </div>
            <Button onClick={submitRequestCard} disabled={creating} className="w-full">
              {creating ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Submitting...</>) : 'Submit Request'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Fund Card Modal */}
      <Dialog open={fundOpen} onOpenChange={(open)=>{ setFundOpen(open); if(!open){ setFundCardId(null); setFundAmount(''); setFundSubmitting(false);} }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fund Card</DialogTitle>
            <DialogDescription>Funds will be debited from your wallet.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">Wallet Balance: {walletBalance.toLocaleString()} {walletCurrency}</p>
            <div>
              <Label className="text-sm">Amount</Label>
              <Input type="number" min="1" step="0.01" value={fundAmount} onChange={(e)=>setFundAmount(e.target.value)} placeholder="0.00"/>
            </div>
            <Button
              disabled={fundSubmitting}
              onClick={async ()=>{
                if (!fundCardId) { toast.error('No card selected'); return; }
                const amt = Number(fundAmount);
                if (!amt || amt<=0) { toast.error('Enter valid amount'); return; }
                try {
                  setFundSubmitting(true);
                  const res = await cardsApi.fundCard(fundCardId, amt);
                  toast.success(res.message || 'Card funded');
                  setFundOpen(false); setFundAmount('');
                  await fetchCards();
                } catch(e:any){
                  toast.error(e?.response?.data?.message || 'Funding failed');
                } finally {
                  setFundSubmitting(false);
                }
              }}
              className="w-full"
            >
              {fundSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Processing...</>) : 'Fund Now'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Withdraw Modal */}
      <Dialog open={withdrawOpen} onOpenChange={(open)=>{ setWithdrawOpen(open); if(!open){ setWithdrawCardId(null); setWithdrawAmount(''); setWithdrawSubmitting(false);} }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Withdraw from Card</DialogTitle>
            <DialogDescription>Funds will be returned to your wallet.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">Wallet Balance after: will increase by entered amount</p>
            <div>
              <Label className="text-sm">Amount</Label>
              <Input type="number" min="1" step="0.01" value={withdrawAmount} onChange={(e)=>setWithdrawAmount(e.target.value)} placeholder="0.00"/>
            </div>
            <Button
              disabled={withdrawSubmitting}
              onClick={async ()=>{
                if (!withdrawCardId) { toast.error('No card selected'); return; }
                const amt = Number(withdrawAmount);
                if (!amt || amt<=0) { toast.error('Enter valid amount'); return; }
                // Optionally validate against selected card balance if available
                const card = cards.find(c=>c.id===withdrawCardId);
                if (card && typeof card.balance === 'number' && amt > card.balance) {
                  toast.error('Amount exceeds card balance');
                  return;
                }
                try {
                  setWithdrawSubmitting(true);
                  const res = await cardsApi.withdrawCard(withdrawCardId, amt);
                  toast.success(res.message || 'Withdrawal successful');
                  setWithdrawOpen(false); setWithdrawAmount('');
                  await fetchCards();
                } catch(e:any){
                  toast.error(e?.response?.data?.message || 'Withdrawal failed');
                } finally {
                  setWithdrawSubmitting(false);
                }
              }}
              className="w-full"
            >
              {withdrawSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Processing...</>) : 'Withdraw Now'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Card Details Modal */}
      {selectedCard && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedCard(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Card Details</h2>
                <p className="text-sm text-gray-500 mt-1">{getCardBrandName(selectedCard.cardBrand)} {selectedCard.cardType}</p>
              </div>
              <button
                onClick={() => setSelectedCard(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Card Number */}
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">Card Number</label>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="font-mono text-lg font-semibold text-gray-900">{selectedCard.cardNumber}</span>
                  <button
                    onClick={() => copyToClipboard(selectedCard.cardNumber.replace(/\s/g, ''), 'Card Number')}
                    className="p-2 hover:bg-white rounded-lg transition-colors"
                  >
                    {copiedField === 'Card Number' ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Cardholder Name */}
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">Cardholder Name</label>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="font-semibold text-gray-900 uppercase">{selectedCard.cardholderName}</span>
                  <button
                    onClick={() => copyToClipboard(selectedCard.cardholderName, 'Cardholder Name')}
                    className="p-2 hover:bg-white rounded-lg transition-colors"
                  >
                    {copiedField === 'Cardholder Name' ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expiry & CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">Expiry Date</label>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="font-mono font-semibold text-gray-900">{selectedCard.expiryDate}</span>
                    <button
                      onClick={() => copyToClipboard(selectedCard.expiryDate, 'Expiry Date')}
                      className="p-2 hover:bg-white rounded-lg transition-colors"
                    >
                      {copiedField === 'Expiry Date' ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">CVV</label>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="font-mono font-semibold text-gray-900">{selectedCard.cvv}</span>
                    <button
                      onClick={() => copyToClipboard(selectedCard.cvv, 'CVV')}
                      className="p-2 hover:bg-white rounded-lg transition-colors"
                    >
                      {copiedField === 'CVV' ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Card Info */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Card Type</span>
                  <span className="text-sm font-semibold text-gray-900">{selectedCard.cardType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Card Brand</span>
                  <span className="text-sm font-semibold text-gray-900">{getCardBrandName(selectedCard.cardBrand)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedCard.status)}`}>
                    {selectedCard.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Created</span>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(selectedCard.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <div className="flex gap-3">
                  <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Keep your card details secure</p>
                    <p className="text-xs text-blue-700 mt-1">Never share your CVV or card details with anyone. RDN Bank will never ask for this information.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-100 p-6 rounded-b-2xl">
              <Button
                onClick={() => setSelectedCard(null)}
                className="w-full"
                variant="outline"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}

