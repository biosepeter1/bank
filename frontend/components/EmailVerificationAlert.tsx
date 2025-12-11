'use client';

import { AlertCircle, Mail } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useBranding } from '@/contexts/BrandingContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export function EmailVerificationAlert() {
  const { user } = useAuthStore();
  const { branding } = useBranding();
  const router = useRouter();

  // Don't show if email is already verified
  if (!user || user.isEmailVerified) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 rounded-xl border-2 p-4 shadow-lg"
      style={{
        background: `linear-gradient(135deg, ${branding.colors.primary}10 0%, ${branding.colors.secondary}10 100%)`,
        borderColor: branding.colors.primary,
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-md"
          style={{
            background: `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)`,
          }}
        >
          <AlertCircle className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
            <Mail className="w-4 h-4" style={{ color: branding.colors.primary }} />
            Email Verification Required
          </h3>
          <p className="text-sm text-gray-700 mb-3">
            To protect your account and enable transfers, please verify your email address.
            You won't be able to send money, withdraw funds, or make transfers until your email is verified.
          </p>
          <button
            onClick={() => router.push('/user/profile')}
            className="px-4 py-2 rounded-lg text-white font-semibold shadow-md hover:shadow-lg transition-all hover:scale-105 text-sm"
            style={{
              background: `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)`,
            }}
          >
            Verify Email Now
          </button>
        </div>
      </div>
    </motion.div>
  );
}
