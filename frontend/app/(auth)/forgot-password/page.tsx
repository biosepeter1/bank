'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, ArrowLeft, Loader2, CheckCircle, Lock, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { authApi } from '@/lib/api/auth';
import { useBranding } from '@/contexts/BrandingContext';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { branding } = useBranding();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateEmail = (email: string) => {
    if (!email) {
      return 'Email is required';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Invalid email format';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateEmail(email);
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await authApi.forgotPassword(email);
      setSuccess(true);
      toast.success('Password reset code sent to your email!');

      // Redirect to reset password page after 2 seconds
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email)}&otpId=${encodeURIComponent(response.otpId)}`);
      }, 2000);
    } catch (error: any) {
      console.error('Forgot password error:', error);
      const errorMessage = error?.response?.data?.message ||
        error?.message ||
        'Failed to send reset code. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) {
      setError('');
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
            Check Your Email
          </h2>
          <p className="text-slate-600 mb-6">
            We've sent a password reset code to <strong>{email}</strong>
          </p>
          <p className="text-sm text-slate-500">
            Redirecting you to reset your password...
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
            <Link href="/login" className="absolute left-6 top-6 text-white/80 hover:text-white transition-colors">
              <ArrowLeft size={24} />
            </Link>

            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-4 relative z-10">
              <Lock className="text-white" size={32} />
            </div>
            <h1 className="text-2xl font-bold relative z-10">Reset Password</h1>
            <p className="text-slate-400 mt-2 relative z-10">
              Enter your email to receive a reset code
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    className={`w-full pl-10 pr-4 h-12 rounded-xl border transition-all bg-slate-50 text-slate-900 focus:ring-2 focus:ring-brand-primary/20 outline-none ${error
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-slate-200 focus:border-brand-primary'
                      }`}
                  />
                </div>
                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-sm mt-1"
                  >
                    {error}
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
                    Sending Code...
                  </>
                ) : (
                  'Send Reset Code'
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
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

