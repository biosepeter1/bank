'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Home,
  Car,
  Briefcase,
  Users,
  CreditCard,
  Heart,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  Clock,
  CheckCircle,
  X,
  Percent,
  DollarSign,
  Calendar,
  Info,
  Loader2,
  Copy,
  Upload,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useBranding } from '@/contexts/BrandingContext';
import { loansApi } from '@/lib/api/loans';
import { profileApi } from '@/lib/api/profile';

type LoanType = {
  icon: any;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  iconColor: string;
  details: {
    interestRate: string;
    maxAmount: string;
    tenure: string;
    processingFee: string;
    features: string[];
    eligibility: string[];
  };
};

export default function LoansPage() {
  
  const { branding } = useBranding();
const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [selectedLoan, setSelectedLoan] = useState<LoanType | null>(null);

  // Applications state
  const [appsLoading, setAppsLoading] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);
  const [responding, setResponding] = useState<Record<string, boolean>>({});
  const [deleting, setDeleting] = useState<Record<string, boolean>>({});
  const [repayOpen, setRepayOpen] = useState(false);
  const [repayLoanId, setRepayLoanId] = useState<string | null>(null);
  const [repayAmount, setRepayAmount] = useState('');
  const [repaySubmitting, setRepaySubmitting] = useState(false);
  const [showHistory, setShowHistory] = useState<Record<string, boolean>>({});
  const [historyLoading, setHistoryLoading] = useState<Record<string, boolean>>({});
  const [histories, setHistories] = useState<Record<string, { disbursement: any | null; repayments: any[] }>>({});
  
  // Fee payment dialog state
  const [feeDialogOpen, setFeeDialogOpen] = useState(false);
  const [selectedLoanForFee, setSelectedLoanForFee] = useState<any>(null);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [uploadingProof, setUploadingProof] = useState(false);

  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [walletCurrency, setWalletCurrency] = useState<string>('NGN');

  const [formData, setFormData] = useState({
    loanType: '',
    amount: '',
    duration: '',
    purpose: '',
    employmentStatus: '',
    monthlyIncome: '',
  });

  const loanTypes: LoanType[] = [
    {
      icon: Home,
      title: 'Personal Home Loans',
      description: 'Finance your dream home with competitive rates',
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      details: {
        interestRate: '4.5% - 7.5% p.a.',
        maxAmount: '$1,000,000',
        tenure: '5 - 30 years',
        processingFee: '1% of loan amount',
        features: [
          'Flexible repayment options',
          'No prepayment penalties',
          'Quick approval process',
          'Competitive interest rates',
          'Tax benefits available',
        ],
        eligibility: [
          'Age: 21-65 years',
          'Minimum income: $3,000/month',
          'Good credit score (650+)',
          'Stable employment history',
        ],
      },
    },
    {
      icon: Car,
      title: 'Automobile Loans',
      description: 'Get on the road with flexible auto financing',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      details: {
        interestRate: '5.5% - 9.5% p.a.',
        maxAmount: '$75,000',
        tenure: '1 - 7 years',
        processingFee: '0.5% of loan amount',
        features: [
          'Up to 90% financing',
          'New and used car loans',
          'Flexible EMI options',
          'Fast approval in 24 hours',
          'Insurance included',
        ],
        eligibility: [
          'Age: 21-60 years',
          'Minimum income: $2,000/month',
          'Valid driving license',
          'Credit score 600+',
        ],
      },
    },
    {
      icon: Briefcase,
      title: 'Business Loans',
      description: 'Grow your business with tailored financing solutions',
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      details: {
        interestRate: '6% - 12% p.a.',
        maxAmount: '$500,000',
        tenure: '1 - 10 years',
        processingFee: '2% of loan amount',
        features: [
          'Working capital support',
          'Equipment financing',
          'Business expansion loans',
          'Flexible repayment terms',
          'Minimal documentation',
        ],
        eligibility: [
          'Business age: 2+ years',
          'Annual turnover: $50,000+',
          'Good business credit score',
          'Profitable for last 2 years',
        ],
      },
    },
    {
      icon: Users,
      title: 'Joint Mortgage',
      description: 'Share responsibility with a co-borrower',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      details: {
        interestRate: '4% - 7% p.a.',
        maxAmount: '$1,500,000',
        tenure: '10 - 30 years',
        processingFee: '1% of loan amount',
        features: [
          'Higher loan eligibility',
          'Shared tax benefits',
          'Lower interest rates',
          'Flexible ownership ratios',
          'Joint liability protection',
        ],
        eligibility: [
          'Age: 21-65 years (both applicants)',
          'Combined income: $5,000+/month',
          'Good credit scores for both',
          'Legal relationship required',
        ],
      },
    },
    {
      icon: CreditCard,
      title: 'Secured Overdraft',
      description: 'Access funds when needed with asset backing',
      color: 'from-orange-500 to-amber-500',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      details: {
        interestRate: '8% - 12% p.a.',
        maxAmount: '$100,000',
        tenure: 'Revolving facility',
        processingFee: '0.5% of limit',
        features: [
          'Pay interest only on used amount',
          'Instant access to funds',
          'Secured against assets',
          'Flexible withdrawal and repayment',
          'Lower interest than personal loans',
        ],
        eligibility: [
          'Age: 21-65 years',
          'Collateral required',
          'Minimum income: $2,500/month',
          'Good credit history',
        ],
      },
    },
    {
      icon: Heart,
      title: 'Health Finance',
      description: 'Cover medical expenses with flexible payment options',
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50',
      iconColor: 'text-pink-600',
      details: {
        interestRate: '5% - 10% p.a.',
        maxAmount: '$50,000',
        tenure: '6 months - 5 years',
        processingFee: '1% of loan amount',
        features: [
          'Quick approval for emergencies',
          'Direct payment to hospitals',
          'No collateral required',
          'Flexible repayment options',
          'Cover surgery, treatment costs',
        ],
        eligibility: [
          'Age: 21-70 years',
          'Minimum income: $1,500/month',
          'Medical documentation required',
          'Credit score 550+',
        ],
      },
    },
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Apply Online',
      description: 'Complete our simple online application form with your details and loan requirements',
    },
    {
      step: 2,
      title: 'Quick Review',
      description: 'Our team reviews your application and may contact you for additional information',
    },
    {
      step: 3,
      title: 'Approval & Disbursement',
      description: 'Once approved, the loan amount will be transferred to your account',
    },
  ];

  const faqs = [
    {
      question: 'What documents do I need to apply?',
      answer: "You'll need identification, proof of income, and address verification. Additional documents may be requested based on loan type.",
    },
    {
      question: 'How long does approval take?',
      answer: 'Standard applications are typically processed within 1-3 business days, depending on verification requirements.',
    },
    {
      question: 'What are the interest rates?',
      answer: 'Interest rates vary by loan type and amount. Personal loans range from 5-12%, business loans from 6-10%, and home loans from 4-7%.',
    },
    {
      question: 'Can I repay my loan early?',
      answer: 'Yes, early repayment is allowed. Some loan types may have prepayment fees, which will be disclosed in your loan agreement.',
    },
  ];

  const fetchApplications = async () => {
    try {
      setAppsLoading(true);
      const data = await loansApi.getApplications();
      setApplications(Array.isArray(data) ? data : []);
    } catch (e:any) {
      console.error('Failed to load applications:', e);
    } finally {
      setAppsLoading(false);
    }
  };

  const parseProposedAmountFromNote = (note?: string | null): number | null => {
    if (!note) return null;
    const m = /PROPOSED_AMOUNT\s*=\s*([0-9.]+)/i.exec(note);
    if (!m) return null;
    const val = Number(m[1]);
    return isNaN(val) ? null : val;
  };
  const parseOfferNote = (note?: string | null): string | null => {
    if (!note) return null;
    const m = /(?:^|;)\s*NOTE\s*=\s*([^;]*)/i.exec(note);
    if (!m) return null;
    return m[1].trim() || null;
  };
  const noteHas = (note: string | null | undefined, key: string) => !!note && new RegExp(`${key}\\s*=\\s*true`, 'i').test(note);

  const handleRespond = async (id: string, action: 'ACCEPT'|'DECLINE') => {
    try {
      setResponding((p)=>({ ...p, [id]: true }));
      await loansApi.respondToOffer(id, action);
      toast.success(action === 'ACCEPT' ? 'Offer accepted' : 'Offer declined');
      await fetchApplications();
    } catch(e:any) {
      toast.error(e?.response?.data?.message || 'Failed to submit response');
    } finally {
      setResponding((p)=>({ ...p, [id]: false }));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this loan application?')) return;
    try {
      setDeleting((p)=>({ ...p, [id]: true }));
      const res = await loansApi.deleteApplication(id);
      toast.success(res?.message || 'Application deleted');
      await fetchApplications();
    } catch(e:any) {
      toast.error(e?.response?.data?.message || 'Delete failed');
    } finally {
      setDeleting((p)=>({ ...p, [id]: false }));
    }
  };

  // initial load
  useEffect(() => { fetchApplications(); (async ()=>{ try { const p = await profileApi.getProfile(); setWalletBalance(Number(p?.wallet?.balance||0)); setWalletCurrency(p?.wallet?.currency || 'NGN'); } catch {} })(); }, []);

  const toggleHistory = async (id: string) => {
    const visible = !!showHistory[id];
    setShowHistory((p)=>({ ...p, [id]: !visible }));
    if (!visible && !histories[id]) {
      try {
        setHistoryLoading((p)=>({ ...p, [id]: true }));
        const data = await loansApi.getRepayments(id);
        setHistories((p)=>({ ...p, [id]: data }));
      } catch(e:any) {
        toast.error(e?.response?.data?.message || 'Failed to load history');
      } finally {
        setHistoryLoading((p)=>({ ...p, [id]: false }));
      }
    }
  };

  const openFeeDialog = (loan: any) => {
    setSelectedLoanForFee(loan);
    setProofFile(null);
    setFeeDialogOpen(true);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const handleSubmitFeeProof = async () => {
    if (!proofFile || !selectedLoanForFee) {
      toast.error('Please select a payment proof image');
      return;
    }

    try {
      setUploadingProof(true);
      
      // 1. Upload file
      const formData = new FormData();
      formData.append('file', proofFile);
      const token = localStorage.getItem('accessToken');
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      
      const uploadRes = await fetch(`${backendUrl}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!uploadRes.ok) {
        throw new Error('Failed to upload file');
      }
      
      const { url } = await uploadRes.json();
      
      // 2. Submit proof to backend
      await loansApi.submitFeeProof(selectedLoanForFee.id, url);
      
      toast.success('Payment proof submitted successfully!');
      setFeeDialogOpen(false);
      setProofFile(null);
      setSelectedLoanForFee(null);
      await fetchApplications(); // Refresh list
    } catch (error: any) {
      console.error('Failed to submit payment proof:', error);
      toast.error(error?.response?.data?.message || 'Failed to submit payment proof');
    } finally {
      setUploadingProof(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.loanType || !formData.amount || !formData.duration || !formData.purpose) {
      toast.error('Please fill in all required fields');
      return;
    }
    // Client-side constraints to match backend DTO
    const amt = parseFloat(formData.amount);
    const dur = parseInt(formData.duration);
    if (isNaN(amt) || amt < 1000) {
      toast.error('Minimum loan amount is 1000');
      return;
    }
    if (isNaN(dur) || dur < 1 || dur > 60) {
      toast.error('Duration must be between 1 and 60 months');
      return;
    }

    try {
      setSubmitting(true);
      await loansApi.applyForLoan({
        amount: parseFloat(formData.amount),
        duration: parseInt(formData.duration),
        purpose: formData.purpose,
        currency: undefined,
      });

      toast.success('Loan application submitted successfully!');
      setShowApplicationForm(false);
      setFormData({
        loanType: '',
        amount: '',
        duration: '',
        purpose: '',
        employmentStatus: '',
        monthlyIncome: '',
      });
    } catch (error) {
      console.error('Failed to submit loan application:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 p-6">
      {/* Modern Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div 
                className="w-1.5 h-10 rounded-full"
                style={{ background: branding.colors.primary }}
              />
              <h1 className="text-4xl font-bold" style={{ color: branding.colors.primary }}>
                Loan Services
              </h1>
            </div>
            <p className="text-gray-600 text-lg ml-5">Apply for loans and financial assistance tailored to your needs</p>
          </div>
          <Button
            onClick={() => setShowApplicationForm(!showApplicationForm)}
            className="text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 h-auto text-base font-semibold"
            style={{
              background: `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)`
            }}
          >
            <FileText className="w-5 h-5 mr-2" />
            {showApplicationForm ? 'View Loan Types' : 'Apply Now'}
          </Button>
        </div>
      </motion.div>

      {/* Your Applications */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <div 
            className="w-1 h-7 rounded-full"
            style={{ background: branding.colors.primary }}
          />
          <h2 className="text-2xl font-bold text-gray-900">Your Applications</h2>
        </div>
        <Card 
          className="border-none shadow-xl bg-white/95 backdrop-blur-sm"
        >
          <CardContent className="pt-4">
            {appsLoading ? (
              <div className="py-8 text-center text-gray-600">Loading...</div>
            ) : applications.length === 0 ? (
              <div className="py-8 text-center text-gray-500">No loan applications yet.</div>
            ) : (
              <div className="space-y-3">
                {applications.map((a:any) => {
                  const proposed = parseProposedAmountFromNote(a.approvalNote);
                  const offerNote = parseOfferNote(a.approvalNote);
                  const userAccepted = noteHas(a.approvalNote, 'USER_ACCEPTED');
                  const userDeclined = noteHas(a.approvalNote, 'USER_DECLINED');
                  const showOfferActions = a.status === 'PENDING' && proposed && !userAccepted && !userDeclined;
                  const showOfferBanner = showOfferActions; // only show while pending and not responded
                  const amt = Number(a.amount || 0);
                  const repaid = Number(a.totalRepaid || 0);
                  const remaining = Math.max(amt - repaid, 0);
                  const monthly = a.monthlyPayment ? Number(a.monthlyPayment) : null;
                  const nextDue = a.nextPaymentDue ? new Date(a.nextPaymentDue) : null;
                  const progress = amt > 0 ? Math.min(100, (repaid / amt) * 100) : 0;
                  return (
                    <div 
                      key={a.id} 
                      className="p-5 rounded-xl flex flex-col gap-3 border-2 transition-all hover:shadow-md"
                      style={{ borderColor: `${branding.colors.primary}20` }}
                    >
                      {/* Progress */}
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden" title="Progress">
                        <div 
                          className="h-2.5 rounded-full transition-all duration-500"
                          style={{ 
                            width: progress + '%',
                            background: `linear-gradient(90deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)`
                          }} 
                        />
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{Number(a.amount).toLocaleString()} {a.currency}</span>
                          <span className="text-xs text-gray-500">• {a.duration} mo</span>
                        </div>
                        <div className="text-sm text-gray-600 line-clamp-2" title={a.purpose}>{a.purpose}</div>
                        <div className="text-xs text-gray-500">Created {new Date(a.createdAt).toLocaleString()}</div>
                        {(a.status === 'APPROVED' || a.status === 'ACTIVE') && (
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="px-2 py-0.5 rounded-md bg-gray-50 text-gray-700 border">Remaining: {remaining.toLocaleString()} {a.currency}</span>
                            {monthly !== null && (
                              <span className="px-2 py-0.5 rounded-md bg-gray-50 text-gray-700 border">Monthly: {monthly.toLocaleString()} {a.currency}</span>
                            )}
                            {nextDue && (
                              <span className="px-2 py-0.5 rounded-md bg-gray-50 text-gray-700 border">Next due: {nextDue.toLocaleDateString()}</span>
                            )}
                          </div>
                        )}
                        {showOfferBanner && (
                          <Alert className="mt-1 border-amber-200 bg-amber-50">
                            <Info className="h-4 w-4 text-amber-700" />
                            <AlertTitle className="text-amber-800">Offer available</AlertTitle>
                            <AlertDescription className="text-amber-700">
                              {offerNote ? offerNote : `You have a loan offer of ${proposed?.toLocaleString()} ${a.currency}.`}
                            </AlertDescription>
                          </Alert>
                        )}
                        {a.status === 'REJECTED' && a.rejectionReason && (
                          <Alert className="mt-1 border-red-200 bg-red-50">
                            <X className="h-4 w-4 text-red-700" />
                            <AlertTitle className="text-red-800">Rejected</AlertTitle>
                            <AlertDescription className="text-red-700">{a.rejectionReason}</AlertDescription>
                          </Alert>
                        )}
                        {a.status === 'FEE_PENDING' && (
                          <Alert className="mt-1 border-yellow-200 bg-yellow-50">
                            <Info className="h-4 w-4 text-yellow-700" />
                            <AlertTitle className="text-yellow-800">Processing Fee Required</AlertTitle>
                            <AlertDescription className="text-yellow-700">
                              Complete the processing fee payment to proceed with your loan application.
                            </AlertDescription>
                          </Alert>
                        )}
                        {a.status === 'FEE_PAID' && (
                          <Alert className="mt-1 border-blue-200 bg-blue-50">
                            <Clock className="h-4 w-4 text-blue-700" />
                            <AlertTitle className="text-blue-800">Payment Proof Submitted</AlertTitle>
                            <AlertDescription className="text-blue-700">
                              Your payment proof is under review by our team.
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Button size="sm" variant="outline" onClick={()=>toggleHistory(a.id)} disabled={!!historyLoading[a.id]} className="border-gray-300">
                          {historyLoading[a.id] ? 'Loading...' : (showHistory[a.id] ? 'Hide History' : 'View History')}
                        </Button>
                        {a.status === 'ACTIVE' ? (
                          <Button 
                            size="sm" 
                            onClick={()=>{ setRepayLoanId(a.id); setRepayAmount(a.monthlyPayment ? String(a.monthlyPayment) : ''); setRepayOpen(true); }}
                            className="text-white"
                            style={{
                              background: `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)`
                            }}
                          >
                            Repay
                          </Button>
                        ) : a.status === 'FEE_PENDING' ? (
                          <Button size="sm" onClick={()=>openFeeDialog(a)} className="bg-yellow-600 hover:bg-yellow-700 text-white">
                            <Upload className="h-4 w-4 mr-1"/>
                            Pay Fee
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" onClick={()=>handleDelete(a.id)} disabled={!!deleting[a.id]} className="text-red-600 border-red-300 hover:bg-red-50">
                            {deleting[a.id] ? <Loader2 className="h-4 w-4 mr-1 animate-spin"/> : <X className="h-4 w-4 mr-1"/>}
                            Delete
                          </Button>
                        )}
                        <span 
                          className="px-3 py-1 rounded-full text-xs font-medium border-2"
                          style={{ 
                            borderColor: `${branding.colors.primary}40`,
                            color: branding.colors.primary,
                            background: `${branding.colors.primary}10`
                          }}
                        >
                          {a.status}
                        </span>
                        {showOfferActions && (
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" disabled={!!responding[a.id]} onClick={()=>handleRespond(a.id, 'DECLINE')} className="text-red-600 border-red-300">
                              {responding[a.id] ? <Clock className="h-4 w-4 mr-1 animate-spin"/> : <X className="h-4 w-4 mr-1"/>}
                              Decline
                            </Button>
                            <Button 
                              size="sm" 
                              disabled={!!responding[a.id]} 
                              onClick={()=>handleRespond(a.id, 'ACCEPT')}
                              className="text-white"
                              style={{
                                background: `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)`
                              }}
                            >
                              {responding[a.id] ? <Clock className="h-4 w-4 mr-1 animate-spin"/> : <CheckCircle className="h-4 w-4 mr-1"/>}
                              Accept
                            </Button>
                          </div>
                        )}
                      </div>
                      </div>

                      {showHistory[a.id] && (
                        <div className="mt-2 border-t pt-2 text-sm">
                          {histories[a.id] ? (
                            <div className="space-y-1">
                              {histories[a.id].disbursement && (
                                <div className="flex items-center justify-between">
                                  <span>Disbursed</span>
                                  <span>{Number(histories[a.id].disbursement.amount).toLocaleString()} {histories[a.id].disbursement.currency} • {new Date(histories[a.id].disbursement.createdAt).toLocaleDateString()}</span>
                                </div>
                              )}
                              {histories[a.id].repayments.length === 0 ? (
                                <div className="text-gray-500">No repayments yet.</div>
                              ) : (
                                histories[a.id].repayments.map((r:any)=> (
                                  <div key={r.id} className="flex items-center justify-between">
                                    <span>Repayment</span>
                                    <span>{Number(r.amount).toLocaleString()} {r.currency} • {new Date(r.createdAt).toLocaleDateString()}</span>
                                  </div>
                                ))
                              )}
                            </div>
                          ) : (
                            <div className="text-gray-500">Loading...</div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.section>

      {/* Repay Modal */}
      <Dialog open={repayOpen} onOpenChange={(o)=>{ setRepayOpen(o); if(!o){ setRepayLoanId(null); setRepayAmount(''); setRepaySubmitting(false);} }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Repay Loan</DialogTitle>
            <DialogDescription>Enter the amount to repay from your wallet.</DialogDescription>
          </DialogHeader>
          {(() => { const sel = applications.find((x:any)=>x.id===repayLoanId) || null; if(!sel) return null; const amt = Number(sel.amount||0); const repaid = Number(sel.totalRepaid||0); const remaining = Math.max(amt-repaid,0); const monthly = sel.monthlyPayment ? Number(sel.monthlyPayment) : null; const nextDue = sel.nextPaymentDue ? new Date(sel.nextPaymentDue) : null; return (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2 py-0.5 rounded-md bg-gray-50 text-gray-700 border">Remaining: {remaining.toLocaleString()} {sel.currency}</span>
              {monthly !== null && (<span className="px-2 py-0.5 rounded-md bg-gray-50 text-gray-700 border">Monthly: {monthly.toLocaleString()} {sel.currency}</span>)}
              {nextDue && (<span className="px-2 py-0.5 rounded-md bg-gray-50 text-gray-700 border">Next due: {nextDue.toLocaleDateString()}</span>)}
              <span className="px-2 py-0.5 rounded-md bg-gray-50 text-gray-700 border">Wallet: {walletBalance.toLocaleString()} {walletCurrency}</span>
            </div>
            <div>
              <Label>Amount</Label>
              <Input type="number" min={1} step={1} value={repayAmount} onChange={(e)=>setRepayAmount(e.target.value)} placeholder="0.00"/>
            </div>
            <Button
              disabled={repaySubmitting}
              onClick={async ()=>{
                if (!repayLoanId) { toast.error('No loan selected'); return; }
                const amt = Number(repayAmount);
                if (!amt || amt<=0) { toast.error('Enter a valid amount'); return; }
                if (amt > walletBalance) { toast.error('Insufficient wallet balance'); return; }
                try {
                  setRepaySubmitting(true);
                  const res = await loansApi.repayLoan(repayLoanId, amt);
                  toast.success(res?.message || 'Repayment successful');
                  setRepayOpen(false);
                  await fetchApplications();
                } catch(e:any){
                  toast.error(e?.response?.data?.message || 'Repayment failed');
                } finally {
                  setRepaySubmitting(false);
                }
              }}
              className="w-full"
            >
              {repaySubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Processing...</>) : 'Repay Now'}
            </Button>
          </div>); })()}
        </DialogContent>
      </Dialog>

      {!showApplicationForm ? (
        <div className="space-y-12">
          {/* Available Loan Types */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div 
                className="w-1 h-7 rounded-full"
                style={{ background: branding.colors.primary }}
              />
              <h2 className="text-2xl font-bold text-gray-900">Available Loan Types</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loanTypes.map((loan, index) => {
                const Icon = loan.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    onClick={() => setSelectedLoan(loan)}
                  >
                    <Card 
                      className="group border-2 hover:shadow-2xl transition-all duration-300 cursor-pointer h-full overflow-hidden bg-white"
                      style={{
                        borderColor: '#e5e7eb',
                        ':hover': { borderColor: branding.colors.primary }
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = branding.colors.primary}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                    >
                      <CardContent className="pt-6 pb-6 relative">
                        {/* Decorative gradient */}
                        <div 
                          className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                          style={{ background: `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)` }}
                        />
                        
                        <div className={`p-4 ${loan.bgColor} rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                          <Icon className={`h-7 w-7 ${loan.iconColor}`} />
                        </div>
                        <h3 
                          className="font-bold text-xl text-gray-900 mb-3 transition-colors relative z-10"
                          style={{ '--hover-color': branding.colors.primary } as any}
                          onMouseEnter={(e) => e.currentTarget.style.color = branding.colors.primary}
                          onMouseLeave={(e) => e.currentTarget.style.color = ''}
                        >
                          {loan.title}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed relative z-10">{loan.description}</p>
                        <div className="mt-4 pt-4 border-t border-gray-100 relative z-10">
                          <span 
                            className="text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all"
                            style={{ color: branding.colors.primary }}
                          >
                            Learn More
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          {/* How It Works */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div 
                className="w-1 h-7 rounded-full"
                style={{ background: branding.colors.primary }}
              />
              <h2 className="text-2xl font-bold text-gray-900">How It Works</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {howItWorks.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Card className="border-none bg-white hover:shadow-xl transition-all duration-300 h-full shadow-md">
                    <CardContent className="pt-6 text-center relative overflow-hidden">
                      {/* Background decoration */}
                      <div 
                        className="absolute top-0 left-0 right-0 h-1"
                        style={{ background: `linear-gradient(90deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)` }}
                      />
                      <div 
                        className="inline-flex w-16 h-16 rounded-full items-center justify-center mb-4 shadow-lg relative z-10"
                        style={{ background: `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)` }}
                      >
                        <span className="text-2xl font-bold text-white">{step.step}</span>
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 mb-3">{step.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* FAQ Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div 
                className="w-1 h-7 rounded-full"
                style={{ background: branding.colors.primary }}
              />
              <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <Card className="border border-gray-200 hover:border-violet-300 hover:shadow-md transition-all duration-300">
                    <CardContent className="p-0">
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                        className="w-full p-6 flex items-center justify-between text-left hover:bg-gradient-to-r hover:from-violet-50/50 hover:to-purple-50/50 transition-all duration-300"
                      >
                        <h3 className="font-semibold text-gray-900 pr-4">{faq.question}</h3>
                        {expandedFaq === index ? (
                          <ChevronUp className="h-5 w-5 text-violet-600 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-violet-600 flex-shrink-0" />
                        )}
                      </button>
                      {expandedFaq === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-6 pb-6 bg-gradient-to-r from-violet-50/30 to-purple-50/30"
                        >
                          <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>
      ) : (
        /* Application Form */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="shadow-2xl border border-violet-100">
            <CardHeader className="border-b border-violet-100 bg-gradient-to-r from-violet-50 via-purple-50 to-violet-50 pb-6">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Loan Application Form</CardTitle>
              <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                Fill out the form below to apply for a loan. We'll review your application and get back to you within 1-3 business days.
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="loanType">Loan Type *</Label>
                    <Select
                      value={formData.loanType}
                      onValueChange={(value) => setFormData({ ...formData, loanType: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select loan type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personal">Personal Home Loan</SelectItem>
                        <SelectItem value="auto">Automobile Loan</SelectItem>
                        <SelectItem value="business">Business Loan</SelectItem>
                        <SelectItem value="mortgage">Joint Mortgage</SelectItem>
                        <SelectItem value="overdraft">Secured Overdraft</SelectItem>
                        <SelectItem value="health">Health Finance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="amount">Loan Amount ($) *</Label>
                    <Input
                      id="amount"
                      type="number"
                      min={1000}
                      step={1}
                      placeholder="Enter amount"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      required
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">Minimum amount: 1000</p>
                  </div>

                  <div>
                    <Label htmlFor="duration">Loan Duration (months) *</Label>
                    <Select
                      value={formData.duration}
                      onValueChange={(value) => setFormData({ ...formData, duration: value })}
                    >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select duration (1-60 months)" />
                        </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6">6 months</SelectItem>
                        <SelectItem value="12">12 months</SelectItem>
                        <SelectItem value="24">24 months</SelectItem>
                        <SelectItem value="36">36 months</SelectItem>
                        <SelectItem value="48">48 months</SelectItem>
                        <SelectItem value="60">60 months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="employmentStatus">Employment Status</Label>
                    <Select
                      value={formData.employmentStatus}
                      onValueChange={(value) => setFormData({ ...formData, employmentStatus: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="employed">Employed</SelectItem>
                        <SelectItem value="self-employed">Self-Employed</SelectItem>
                        <SelectItem value="business">Business Owner</SelectItem>
                        <SelectItem value="unemployed">Unemployed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="monthlyIncome">Monthly Income ($)</Label>
                    <Input
                      id="monthlyIncome"
                      type="number"
                      placeholder="Enter monthly income"
                      value={formData.monthlyIncome}
                      onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="purpose">Purpose of Loan *</Label>
                  <Textarea
                    id="purpose"
                    placeholder="Describe the purpose of this loan..."
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    rows={4}
                    required
                    className="mt-1"
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                  >
                    {submitting ? (
                      <>
                        <Clock className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Submit Application
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowApplicationForm(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Loan Details Modal */}
      <Dialog open={!!selectedLoan} onOpenChange={() => setSelectedLoan(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0 border-none shadow-2xl">
          {selectedLoan && (
            <>
              {/* A11y: hidden dialog title/description for screen readers */}
              <DialogHeader className="sr-only">
                <DialogTitle>{selectedLoan.title}</DialogTitle>
                <DialogDescription>{selectedLoan.description}</DialogDescription>
              </DialogHeader>
              {/* Header with Gradient Background */}
              <div className={`bg-gradient-to-r ${selectedLoan.color} p-8 text-white rounded-t-lg`}>
                <div className="flex items-start gap-4">
                  <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl">
                    {(() => {
                      const Icon = selectedLoan.icon;
                      return <Icon className="h-10 w-10 text-white" />;
                    })()}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold mb-2">{selectedLoan.title}</h2>
                    <p className="text-white/90 text-lg">{selectedLoan.description}</p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-8">
                {/* Key Details */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    Loan Details
                  </h3>
                  <div className="grid grid-cols-2 gap-5">
                    <div className="bg-gradient-to-br from-violet-50 via-purple-50 to-violet-50 rounded-2xl p-5 border-2 border-violet-200 text-center flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                      <div className="inline-flex p-3 bg-white rounded-xl mb-3 shadow-sm">
                        <Percent className="h-6 w-6 text-violet-600" />
                      </div>
                      <p className="text-[11px] font-bold text-gray-500 uppercase mb-2 tracking-wider">Interest Rate</p>
                      <p className="text-xl font-bold text-violet-900">{selectedLoan.details.interestRate}</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 rounded-2xl p-5 border-2 border-blue-200 text-center flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                      <div className="inline-flex p-3 bg-white rounded-xl mb-3 shadow-sm">
                        <DollarSign className="h-6 w-6 text-blue-600" />
                      </div>
                      <p className="text-[11px] font-bold text-gray-500 uppercase mb-2 tracking-wider">Max Amount</p>
                      <p className="text-xl font-bold text-blue-900">{selectedLoan.details.maxAmount}</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 rounded-2xl p-5 border-2 border-green-200 text-center flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                      <div className="inline-flex p-3 bg-white rounded-xl mb-3 shadow-sm">
                        <Calendar className="h-6 w-6 text-green-600" />
                      </div>
                      <p className="text-[11px] font-bold text-gray-500 uppercase mb-2 tracking-wider">Tenure</p>
                      <p className="text-xl font-bold text-green-900">{selectedLoan.details.tenure}</p>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 rounded-2xl p-5 border-2 border-orange-200 text-center flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                      <div className="inline-flex p-3 bg-white rounded-xl mb-3 shadow-sm">
                        <FileText className="h-6 w-6 text-orange-600" />
                      </div>
                      <p className="text-[11px] font-bold text-gray-500 uppercase mb-2 tracking-wider">Processing Fee</p>
                      <p className="text-xl font-bold text-orange-900">{selectedLoan.details.processingFee}</p>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Key Features</h3>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedLoan.details.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3 bg-white rounded-lg p-3 shadow-sm">
                          <div className="mt-1 flex-shrink-0">
                            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-violet-600 to-purple-600"></div>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">{feature}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Eligibility */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Eligibility Criteria</h3>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                    <div className="space-y-3">
                      {selectedLoan.details.eligibility.map((criteria, index) => (
                        <div key={index} className="flex items-start gap-3 bg-white rounded-lg p-3 shadow-sm">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="p-1 bg-green-100 rounded-full">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">{criteria}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-6 border-t border-gray-200">
                  <Button
                    onClick={() => {
                      setSelectedLoan(null);
                      setShowApplicationForm(true);
                    }}
                    className="w-full h-12 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    <FileText className="mr-2 h-5 w-5" />
                    Apply for this Loan
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Fee Payment Dialog */}
      <Dialog open={feeDialogOpen} onOpenChange={setFeeDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Processing Fee Payment</DialogTitle>
            <DialogDescription>
              Complete the payment and upload proof to proceed with your loan application.
            </DialogDescription>
          </DialogHeader>
          
          {selectedLoanForFee && (
            <div className="space-y-6 py-4">
              {/* Loan Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <Label className="text-xs text-gray-500">Loan Amount</Label>
                  <div className="text-lg font-semibold">
                    {Number(selectedLoanForFee.amount).toLocaleString()} {selectedLoanForFee.currency}
                  </div>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <Label className="text-xs text-gray-500">Processing Fee</Label>
                  <div className="text-lg font-semibold text-yellow-900">
                    {Number(selectedLoanForFee.processingFee).toLocaleString()} {selectedLoanForFee.cryptoType}
                  </div>
                </div>
              </div>

              {/* Payment Instructions */}
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Payment Instructions</AlertTitle>
                <AlertDescription className="text-sm">
                  {selectedLoanForFee.feeDescription}
                </AlertDescription>
              </Alert>

              {/* Crypto Wallet Address */}
              <div>
                <Label>Send {selectedLoanForFee.cryptoType} to this address:</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={selectedLoanForFee.cryptoWalletAddress}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => copyToClipboard(selectedLoanForFee.cryptoWalletAddress)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Upload Payment Proof */}
              <div>
                <Label>Upload Payment Proof (Screenshot)</Label>
                <div className="mt-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                    className="cursor-pointer"
                  />
                  {proofFile && (
                    <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      {proofFile.name}
                    </p>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Please upload a screenshot showing the transaction details and confirmation.
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={handleSubmitFeeProof}
                  disabled={!proofFile || uploadingProof}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  {uploadingProof ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Submit Payment Proof
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setFeeDialogOpen(false)}
                  disabled={uploadingProof}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

