'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, Eye, EyeOff, Loader2, CheckCircle, Shield, ArrowLeft, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { authApi } from '@/lib/api/auth';
import { useBranding } from '@/contexts/BrandingContext';

// Mark page as dynamic to prevent prerendering
export const dynamic = 'force-dynamic';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { branding } = useBranding();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<{ code?: string; password?: string; confirmPassword?: string }>({});
  const [formData, setFormData] = useState({
    code: '',
    newPassword: '',
    confirmPassword: '',
  });

  const email = searchParams.get('email') || '';
  const otpId = searchParams.get('otpId') || '';

  useEffect(() => {
    if (!email || !otpId) {
      toast.error('Invalid reset link. Please request a new password reset.');
      setTimeout(() => {
        router.push('/forgot-password');
      }, 2000);
    }
  }, [email, otpId, router]);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formData.code) {
      newErrors.code = 'Verification code is required';
    } else if (formData.code.length !== 6) {
      newErrors.code = 'Code must be 6 digits';
    }

    if (!formData.newPassword) {
      newErrors.password = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

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
      await authApi.resetPassword({
        otpId,
        code: formData.code,
        newPassword: formData.newPassword,
      });

      setSuccess(true);
      toast.success('Password reset successful!');

      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error: any) {
      console.error('Reset password error:', error);
      const errorMessage = error?.response?.data?.message ||
        error?.message ||
        'Failed to reset password. Please try again.';
      toast.error(errorMessage);

      if (errorMessage.toLowerCase().includes('expired') || errorMessage.toLowerCase().includes('invalid')) {
        setTimeout(() => {
          router.push('/forgot-password');
        }, 2000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Toaster position="top-right" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4"
          >
            <CheckCircle size={32} />
          </motion.div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Password Reset Successful!
          </h2>
          <p className="text-slate-600 mb-6">
            Your password has been successfully reset. You can now sign in with your new password.
          </p>
          <p className="text-sm text-slate-500">
            Redirecting you to login...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Toaster position="top-right" />
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
        >
          {/* Header */}
          <div className="p-8 text-center bg-slate-900 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-brand-gradient opacity-10" />
            <Link href="/forgot-password" className="absolute left-6 top-6 text-white/80 hover:text-white transition-colors">
              <ArrowLeft size={24} />
            </Link>

            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-4 relative z-10">
              <Shield className="text-white" size={32} />
            </div>
            <h1 className="text-2xl font-bold relative z-10">Reset Password</h1>
            <p className="text-slate-400 mt-2 relative z-10">
              Enter the code sent to <strong>{email}</strong> and your new password
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Code Field */}
              <div className="space-y-2">
                <label htmlFor="code" className="block text-sm font-medium text-slate-700">
                  Verification Code
                </label>
                <input
                  id="code"
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="000000"
                  maxLength={6}
                  className={`w-full px-4 h-14 rounded-xl border transition-all bg-slate-50 text-slate-900 text-center text-2xl tracking-[0.5em] font-mono focus:ring-2 focus:ring-brand-primary/20 outline-none ${errors.code
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-slate-200 focus:border-brand-primary'
                    }`}
                />
                {errors.code && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-sm mt-1"
                  >
                    {errors.code}
                  </motion.p>
                )}
              </div>

              {/* New Password Field */}
              <div className="space-y-2">
                <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
                  <input
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    placeholder="Enter new password"
                    className={`w-full pl-10 pr-10 h-12 rounded-xl border transition-all bg-slate-50 text-slate-900 focus:ring-2 focus:ring-brand-primary/20 outline-none ${errors.password
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-slate-200 focus:border-brand-primary'
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-sm mt-1"
                  >
                    {errors.password}
                  </motion.p>
                )}
                <p className="text-xs text-slate-500">
                  Must be at least 8 characters
                </p>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm new password"
                    className={`w-full pl-10 pr-10 h-12 rounded-xl border transition-all bg-slate-50 text-slate-900 focus:ring-2 focus:ring-brand-primary/20 outline-none ${errors.confirmPassword
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-slate-200 focus:border-brand-primary'
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-sm mt-1"
                  >
                    {errors.confirmPassword}
                  </motion.p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-brand-gradient text-white font-medium text-lg rounded-xl shadow-lg shadow-brand-primary/20 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Resetting Password...
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>

            <div className="mt-8 text-center space-y-2">
              <p className="text-slate-600">
                Didn't receive the code?{' '}
                <Link href="/forgot-password" className="font-bold text-brand-primary hover:underline">
                  Resend
                </Link>
              </p>
              <p className="text-slate-600">
                Remember your password?{' '}
                <Link href="/login" className="font-bold text-brand-primary hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </div>

          {/* Footer Note */}
          <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
            <p className="text-xs text-slate-500 flex items-center justify-center gap-2">
              <Lock size={12} /> Secure Verification
            </p>
          </div>
        </motion.div>

        <p className="text-center text-slate-400 text-xs mt-6">
          © {new Date().getFullYear()} {branding.name}. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}

