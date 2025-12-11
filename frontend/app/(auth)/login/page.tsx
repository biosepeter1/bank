'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, Building2, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { authApi } from '@/lib/api/auth';
import { useBranding } from '@/contexts/BrandingContext';
import { useSettings } from '@/contexts/SettingsContext';

const AUTH_SLIDES = [
  '/images/auth-slide-1.png',
  '/images/auth-slide-2.png',
  '/images/auth-slide-3.png',
];

export default function LoginPage() {
  const router = useRouter();
  const { branding } = useBranding();
  const { settings } = useSettings();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [currentSlide, setCurrentSlide] = useState(0);

  const siteName = settings?.general?.siteName || branding?.name || 'Banking Platform';
  const logo = settings?.general?.logo || branding?.logo;

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

  // Auto-advance slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % AUTH_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors below');
      return;
    }
    setIsLoading(true);
    try {
      const response = await authApi.login({ email: formData.email, password: formData.password });
      if (response.accessToken) localStorage.setItem('accessToken', response.accessToken);
      if (response.refreshToken) localStorage.setItem('refreshToken', response.refreshToken);
      if (rememberMe) localStorage.setItem('rememberedEmail', formData.email);
      else localStorage.removeItem('rememberedEmail');
      toast.success('Login successful! Redirecting...');
      const userRole = response.user?.role || 'USER';
      setTimeout(() => {
        if (userRole === 'SUPER_ADMIN' || userRole === 'BANK_ADMIN') router.push('/admin/dashboard');
        else router.push('/user/dashboard');
      }, 1000);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  return (
    <div className="h-screen flex overflow-hidden">
      <Toaster position="top-right" />

      {/* Left Panel - Image Slideshow */}
      <div className="hidden lg:block lg:w-[50%] relative overflow-hidden">
        {/* Slideshow Images */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            <Image
              src={AUTH_SLIDES[currentSlide]}
              alt="Banking"
              fill
              priority={currentSlide === 0}
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${branding.colors.primary}dd 0%, ${branding.colors.secondary}aa 100%)`
          }}
        />

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-between p-8 text-white z-10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            {logo ? (
              <img src={logo} alt={siteName} className="h-10 w-auto object-contain" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
            )}
            <span className="text-xl font-bold">{siteName}</span>
          </Link>

          {/* Center Content */}
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-4xl font-bold mb-4">Welcome Back</h2>
              <p className="text-lg text-white/90 max-w-md mx-auto">
                Sign in to access your account and manage your finances securely.
              </p>
            </motion.div>
          </div>

          {/* Bottom Content - Slide Indicators */}
          <div className="flex items-center justify-center gap-2">
            {AUTH_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
                  }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="min-h-full flex items-center justify-center p-4 md:p-6">
          <div className="w-full max-w-sm">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
              {logo ? (
                <img src={logo} alt={siteName} className="h-8 object-contain" />
              ) : (
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ background: branding.colors.primary }}>
                  <Building2 className="w-4 h-4" />
                </div>
              )}
              <span className="text-lg font-bold text-slate-900">{siteName}</span>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-slate-900 mb-1">Sign In</h1>
                <p className="text-slate-500 text-sm">Access your account</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-5">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 text-slate-400" size={18} />
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="you@example.com" className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm bg-slate-50 text-slate-900 outline-none ${errors.email ? 'border-red-500' : 'border-slate-200 focus:border-brand-primary'}`} />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-sm font-medium text-slate-700">Password</label>
                      <Link href="/forgot-password" className="text-xs font-medium hover:underline" style={{ color: branding.colors.primary }}>Forgot?</Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 text-slate-400" size={18} />
                      <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleInputChange} placeholder="••••••••" className={`w-full pl-9 pr-10 py-2.5 rounded-lg border text-sm bg-slate-50 text-slate-900 outline-none ${errors.password ? 'border-red-500' : 'border-slate-200 focus:border-brand-primary'}`} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-slate-400">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 rounded border-slate-300" />
                    <span className="text-xs text-slate-600">Remember me</span>
                  </label>

                  <button type="submit" disabled={isLoading} className="w-full px-4 py-2.5 text-white font-medium rounded-xl hover:opacity-90 shadow-md disabled:opacity-50 transition-all flex items-center justify-center gap-2 text-sm" style={{ background: branding.colors.primary }}>
                    {isLoading ? <><Loader2 size={16} className="animate-spin" /> Signing in...</> : <>Sign In <ArrowRight size={16} /></>}
                  </button>
                </form>

                <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                  <p className="text-slate-500 text-sm">Don't have an account? <Link href="/register" className="font-semibold hover:underline" style={{ color: branding.colors.primary }}>Open Account</Link></p>
                </div>
              </div>

              <div className="mt-4 text-center">
                <p className="text-slate-400 text-xs flex items-center justify-center gap-1"><Lock size={10} /> Protected by Bank-Grade Security</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
