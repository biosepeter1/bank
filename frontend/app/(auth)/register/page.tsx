'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  User, Mail, Phone, Lock, Eye, EyeOff, Loader2, ArrowRight, ArrowLeft,
  CheckCircle2, Shield, CreditCard, Globe, Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { useBranding } from '@/contexts/BrandingContext';
import { useSettings } from '@/contexts/SettingsContext';

interface FormData {
  firstName: string; lastName: string; username: string; email: string; phone: string;
  country: string; accountType: string; currency: string; password: string;
  confirmPassword: string; transactionPin: string; termsAccepted: boolean; privacyAccepted: boolean;
}

const STEPS = [
  { id: 1, title: 'Personal', icon: User },
  { id: 2, title: 'Contact', icon: Mail },
  { id: 3, title: 'Account', icon: CreditCard },
  { id: 4, title: 'Security', icon: Shield },
  { id: 5, title: 'Confirm', icon: CheckCircle2 },
];

const AUTH_SLIDES = [
  '/images/auth-slide-1.png',
  '/images/auth-slide-2.png',
  '/images/auth-slide-3.png',
];

export default function RegisterPage() {
  const router = useRouter();
  const { branding } = useBranding();
  const { settings } = useSettings();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [currentSlide, setCurrentSlide] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    firstName: '', lastName: '', username: '', email: '', phone: '', country: 'NG',
    accountType: 'savings', currency: 'NGN', password: '', confirmPassword: '',
    transactionPin: '', termsAccepted: false, privacyAccepted: false,
  });

  const siteName = settings?.general?.siteName || branding?.name || 'Banking Platform';
  const logo = settings?.general?.logo || branding?.logo;

  // Auto-advance slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % AUTH_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<FormData> = {};
    switch (step) {
      case 1:
        if (!formData.firstName?.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName?.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.username?.trim()) newErrors.username = 'Username is required';
        if (formData.username && formData.username.length < 3) newErrors.username = 'Username must be at least 3 characters';
        break;
      case 2:
        if (!formData.email?.trim()) newErrors.email = 'Email is required';
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
        if (!formData.phone?.trim()) newErrors.phone = 'Phone number is required';
        if (formData.phone && formData.phone.length < 10) newErrors.phone = 'Phone number must be at least 10 digits';
        if (!formData.country) newErrors.country = 'Country is required';
        break;
      case 3:
        if (!formData.accountType) newErrors.accountType = 'Account type is required';
        if (!formData.currency) newErrors.currency = 'Currency is required';
        break;
      case 4:
        if (!formData.password?.trim()) newErrors.password = 'Password is required';
        if (formData.password && formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
        if (!/[A-Z]/.test(formData.password || '')) newErrors.password = 'Password must contain uppercase letter';
        if (!/[0-9]/.test(formData.password || '')) newErrors.password = 'Password must contain a number';
        if (!/[@$!%*?&]/.test(formData.password || '')) newErrors.password = 'Password must contain special character';
        if (!formData.confirmPassword?.trim()) newErrors.confirmPassword = 'Please confirm password';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        if (!formData.transactionPin?.trim()) newErrors.transactionPin = 'Transaction PIN is required';
        if (formData.transactionPin && !/^\d{4}$/.test(formData.transactionPin)) newErrors.transactionPin = 'PIN must be 4 digits';
        break;
      case 5:
        if (!formData.termsAccepted) newErrors.termsAccepted = 'Accept Terms';
        if (!formData.privacyAccepted) newErrors.privacyAccepted = 'Accept Privacy Policy';
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < STEPS.length) setCurrentStep(currentStep + 1);
    } else {
      toast.error('Please fix the errors below');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) { setCurrentStep(currentStep - 1); setErrors({}); }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name as keyof FormData]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) { toast.error('Please accept all terms'); return; }
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName, lastName: formData.lastName, username: formData.username,
          email: formData.email, phone: formData.phone, password: formData.password,
          country: formData.country, accountType: formData.accountType, currency: formData.currency,
          transactionPin: formData.transactionPin,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');
      if (data.token) localStorage.setItem('authToken', data.token);
      if (data.user) localStorage.setItem('userId', data.user.id);
      toast.success('Account created successfully!');
      setTimeout(() => router.push('/user/dashboard'), 1500);
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return <Step1 formData={formData} errors={errors} handleInputChange={handleInputChange} />;
      case 2: return <Step2 formData={formData} errors={errors} handleInputChange={handleInputChange} />;
      case 3: return <Step3 formData={formData} errors={errors} handleInputChange={handleInputChange} branding={branding} />;
      case 4: return <Step4 formData={formData} errors={errors} handleInputChange={handleInputChange} showPassword={showPassword} setShowPassword={setShowPassword} showConfirmPassword={showConfirmPassword} setShowConfirmPassword={setShowConfirmPassword} />;
      case 5: return <Step5 formData={formData} errors={errors} handleInputChange={handleInputChange} branding={branding} />;
      default: return null;
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      <Toaster position="top-right" />

      {/* Left Panel - Image Slideshow */}
      <div className="hidden lg:block lg:w-[50%] relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div key={currentSlide} initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.7 }} className="absolute inset-0">
            <Image src={AUTH_SLIDES[currentSlide]} alt="Banking" fill priority={currentSlide === 0} className="object-cover" />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${branding.colors.primary}dd 0%, ${branding.colors.secondary}aa 100%)` }} />

        <div className="absolute inset-0 flex flex-col justify-between p-8 text-white z-10">
          <Link href="/" className="flex items-center gap-3">
            {logo ? <img src={logo} alt={siteName} className="h-10 w-auto object-contain" /> : <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center"><Building2 className="w-5 h-5" /></div>}
            <span className="text-xl font-bold">{siteName}</span>
          </Link>

          <div className="text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h2 className="text-4xl font-bold mb-4">Join {siteName}</h2>
              <p className="text-lg text-white/90 max-w-md mx-auto">Experience secure, fast, and seamless financial services.</p>
            </motion.div>
          </div>

          <div className="flex items-center justify-center gap-2">
            {AUTH_SLIDES.map((_, idx) => (
              <button key={idx} onClick={() => setCurrentSlide(idx)} className={`h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="min-h-full flex items-center justify-center p-4 md:p-6">
          <div className="w-full max-w-md">
            <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
              {logo ? <img src={logo} alt={siteName} className="h-8 object-contain" /> : <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ background: branding.colors.primary }}><Building2 className="w-4 h-4" /></div>}
              <span className="text-lg font-bold text-slate-900">{siteName}</span>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="text-center mb-5">
                <h1 className="text-2xl font-bold text-slate-900 mb-1">Create Account</h1>
                <p className="text-slate-500 text-sm">Step {currentStep}/{STEPS.length}: {STEPS[currentStep - 1].title}</p>
              </div>

              <div className="flex items-center justify-between mb-5">
                {STEPS.map((step, idx) => {
                  const Icon = step.icon;
                  const isActive = idx + 1 === currentStep;
                  const isCompleted = idx + 1 < currentStep;
                  return (
                    <React.Fragment key={step.id}>
                      <div className="flex flex-col items-center">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${isActive ? 'text-white shadow-md' : isCompleted ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-400'}`} style={isActive ? { background: branding.colors.primary } : {}}>
                          {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                        </div>
                        <span className={`text-[10px] mt-1 font-medium hidden sm:block ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>{step.title}</span>
                      </div>
                      {idx < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-1 rounded-full ${idx + 1 < currentStep ? 'bg-green-500' : 'bg-slate-200'}`} />}
                    </React.Fragment>
                  );
                })}
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-5">
                <AnimatePresence mode="wait">
                  <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                    {renderStepContent()}
                  </motion.div>
                </AnimatePresence>

                <div className="flex gap-3 mt-6 pt-5 border-t border-slate-100">
                  <button onClick={handlePrevious} disabled={currentStep === 1} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-all flex items-center justify-center gap-2 text-sm">
                    <ArrowLeft size={16} /> Back
                  </button>
                  {currentStep === STEPS.length ? (
                    <button onClick={handleSubmit} disabled={isLoading} className="flex-1 px-4 py-2.5 text-white font-medium rounded-xl hover:opacity-90 shadow-md disabled:opacity-50 transition-all flex items-center justify-center gap-2 text-sm" style={{ background: branding.colors.primary }}>
                      {isLoading ? <><Loader2 size={16} className="animate-spin" /> Creating...</> : <>Create Account <CheckCircle2 size={16} /></>}
                    </button>
                  ) : (
                    <button onClick={handleNext} className="flex-1 px-4 py-2.5 text-white font-medium rounded-xl hover:opacity-90 shadow-md transition-all flex items-center justify-center gap-2 text-sm" style={{ background: branding.colors.primary }}>
                      Continue <ArrowRight size={16} />
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-4 text-center">
                <p className="text-slate-500 text-sm">Already have an account? <Link href="/login" className="font-semibold hover:underline" style={{ color: branding.colors.primary }}>Sign In</Link></p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Step Components
function Step1({ formData, errors, handleInputChange }: any) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="John" className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm bg-slate-50 text-slate-900 outline-none ${errors.firstName ? 'border-red-500' : 'border-slate-200 focus:border-brand-primary'}`} />
          </div>
          {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Doe" className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm bg-slate-50 text-slate-900 outline-none ${errors.lastName ? 'border-red-500' : 'border-slate-200 focus:border-brand-primary'}`} />
          </div>
          {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
        <div className="relative">
          <span className="absolute left-3 top-2.5 text-slate-400 text-sm">@</span>
          <input type="text" name="username" value={formData.username} onChange={handleInputChange} placeholder="johndoe" className={`w-full pl-7 pr-3 py-2.5 rounded-lg border text-sm bg-slate-50 text-slate-900 outline-none ${errors.username ? 'border-red-500' : 'border-slate-200 focus:border-brand-primary'}`} />
        </div>
        {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
      </div>
    </div>
  );
}

function Step2({ formData, errors, handleInputChange }: any) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="you@example.com" className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm bg-slate-50 text-slate-900 outline-none ${errors.email ? 'border-red-500' : 'border-slate-200 focus:border-brand-primary'}`} />
        </div>
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
        <div className="relative">
          <Phone className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+234..." className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm bg-slate-50 text-slate-900 outline-none ${errors.phone ? 'border-red-500' : 'border-slate-200 focus:border-brand-primary'}`} />
        </div>
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
        <select name="country" value={formData.country} onChange={handleInputChange} className="w-full px-3 py-2.5 rounded-lg border text-sm bg-slate-50 text-slate-900 outline-none border-slate-200 focus:border-brand-primary">
          <option value="NG">🇳🇬 Nigeria</option>
          <option value="US">🇺🇸 United States</option>
          <option value="GB">🇬🇧 United Kingdom</option>
          <option value="CA">🇨🇦 Canada</option>
        </select>
      </div>
    </div>
  );
}

function Step3({ formData, errors, handleInputChange, branding }: any) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Account Type</label>
        <div className="grid grid-cols-2 gap-3">
          {[{ id: 'savings', label: 'Savings', icon: '💰' }, { id: 'checking', label: 'Checking', icon: '💳' }].map((t) => (
            <button key={t.id} type="button" onClick={() => handleInputChange({ target: { name: 'accountType', value: t.id } } as any)} className={`p-3 rounded-lg border-2 text-left ${formData.accountType === t.id ? 'border-brand-primary bg-brand-primary/5' : 'border-slate-200 bg-white'}`}>
              <div className="text-xl mb-1">{t.icon}</div>
              <div className="font-medium text-slate-900 text-sm">{t.label}</div>
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
        <select name="currency" value={formData.currency} onChange={handleInputChange} className="w-full px-3 py-2.5 rounded-lg border text-sm bg-slate-50 text-slate-900 outline-none border-slate-200 focus:border-brand-primary">
          <option value="NGN">🇳🇬 Naira (₦)</option>
          <option value="USD">🇺🇸 Dollar ($)</option>
          <option value="GBP">🇬🇧 Pound (£)</option>
          <option value="EUR">🇪🇺 Euro (€)</option>
        </select>
      </div>
    </div>
  );
}

function Step4({ formData, errors, handleInputChange, showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword }: any) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleInputChange} placeholder="••••••••" className={`w-full pl-9 pr-10 py-2.5 rounded-lg border text-sm bg-slate-50 text-slate-900 outline-none ${errors.password ? 'border-red-500' : 'border-slate-200 focus:border-brand-primary'}`} />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-slate-400">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
        </div>
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} placeholder="••••••••" className={`w-full pl-9 pr-10 py-2.5 rounded-lg border text-sm bg-slate-50 text-slate-900 outline-none ${errors.confirmPassword ? 'border-red-500' : 'border-slate-200 focus:border-brand-primary'}`} />
          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-2.5 text-slate-400">{showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
        </div>
        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Transaction PIN <span className="text-slate-400 font-normal">(4 digits)</span></label>
        <input type="text" name="transactionPin" value={formData.transactionPin} onChange={(e) => handleInputChange({ target: { name: 'transactionPin', value: e.target.value.replace(/\D/g, '').slice(0, 4) } } as any)} placeholder="••••" maxLength={4} className={`w-full px-3 py-2.5 rounded-lg border text-center text-xl tracking-[0.4em] font-mono bg-slate-50 text-slate-900 outline-none ${errors.transactionPin ? 'border-red-500' : 'border-slate-200 focus:border-brand-primary'}`} />
        {errors.transactionPin && <p className="text-red-500 text-xs mt-1">{errors.transactionPin}</p>}
      </div>
    </div>
  );
}

function Step5({ formData, errors, handleInputChange, branding }: any) {
  return (
    <div className="space-y-4">
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
        <h3 className="font-medium text-slate-900 mb-3 flex items-center gap-2 text-sm"><CheckCircle2 size={16} style={{ color: branding.colors.primary }} /> Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-slate-500">Name</span><span className="font-medium text-slate-900">{formData.firstName} {formData.lastName}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Email</span><span className="font-medium text-slate-900">{formData.email}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Account</span><span className="font-medium text-slate-900 capitalize">{formData.accountType}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Currency</span><span className="font-medium text-slate-900">{formData.currency}</span></div>
        </div>
      </div>
      <label className="flex items-start gap-2 cursor-pointer p-2 rounded-lg hover:bg-slate-50">
        <input type="checkbox" name="termsAccepted" checked={formData.termsAccepted} onChange={handleInputChange} className="w-4 h-4 mt-0.5 rounded border-slate-300" />
        <span className="text-xs text-slate-600">I agree to the <a href="/terms" className="font-medium hover:underline" style={{ color: branding.colors.primary }}>Terms and Conditions</a></span>
      </label>
      {errors.termsAccepted && <p className="text-red-500 text-xs ml-6">{errors.termsAccepted}</p>}
      <label className="flex items-start gap-2 cursor-pointer p-2 rounded-lg hover:bg-slate-50">
        <input type="checkbox" name="privacyAccepted" checked={formData.privacyAccepted} onChange={handleInputChange} className="w-4 h-4 mt-0.5 rounded border-slate-300" />
        <span className="text-xs text-slate-600">I agree to the <a href="/privacy" className="font-medium hover:underline" style={{ color: branding.colors.primary }}>Privacy Policy</a></span>
      </label>
      {errors.privacyAccepted && <p className="text-red-500 text-xs ml-6">{errors.privacyAccepted}</p>}
    </div>
  );
}

