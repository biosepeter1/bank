import React, { useState } from 'react';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';
import { useForm, PATTERNS } from '@/utils';
import { FormInput } from '@/components/common';
import { useToast } from '@/components/common';

export interface PasswordRecoveryProps {
  onBack?: () => void;
}

export const PasswordRecovery: React.FC<PasswordRecoveryProps> = ({ onBack }) => {
  const [step, setStep] = useState<'email' | 'code' | 'reset'>('email');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const { success, error } = useToast();

  const emailForm = useForm({
    initialValues: { email: '' },
    rules: {
      email: {
        required: 'Email is required',
        pattern: [PATTERNS.EMAIL, 'Invalid email format'],
      },
    },
    onSubmit: async (values) => {
      try {
        // TODO: Call API to send recovery code
        setRecoveryEmail(values.email);
        setStep('code');
        success('Recovery code sent to your email');
      } catch (err: any) {
        error('Failed to send recovery code');
      }
    },
  });

  const codeForm = useForm({
    initialValues: { code: '' },
    rules: {
      code: {
        required: 'Recovery code is required',
        minLength: [6, 'Code must be 6 characters'],
      },
    },
    onSubmit: async (values) => {
      try {
        // TODO: Call API to verify code
        setStep('reset');
        success('Code verified');
      } catch (err: any) {
        error('Invalid recovery code');
      }
    },
  });

  const resetForm = useForm({
    initialValues: { password: '', confirmPassword: '' },
    rules: {
      password: {
        required: 'New password is required',
        minLength: [8, 'Minimum 8 characters'],
      },
      confirmPassword: {
        required: 'Confirm password is required',
        custom: (value) => {
          if (value !== resetForm.values.password) {
            return 'Passwords do not match';
          }
          return null;
        },
      },
    },
    onSubmit: async (values) => {
      try {
        // TODO: Call API to reset password
        success('Password reset successfully');
        onBack?.();
      } catch (err: any) {
        error('Failed to reset password');
      }
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <button
          onClick={onBack || (() => setStep('email'))}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {step === 'email' && 'Recover Password'}
          {step === 'code' && 'Enter Recovery Code'}
          {step === 'reset' && 'Set New Password'}
        </h2>
      </div>

      {/* Step 1: Email */}
      {step === 'email' && (
        <form onSubmit={emailForm.handleSubmit} className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Enter your email address and we'll send you a code to reset your password.
          </p>
          <FormInput
            label="Email Address"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={emailForm.values.email}
            onChange={emailForm.handleChange}
            onBlur={emailForm.handleBlur}
            error={emailForm.touched.email ? emailForm.errors.email : undefined}
            icon={<Mail size={18} />}
          />
          <button
            type="submit"
            disabled={emailForm.isSubmitting}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {emailForm.isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Sending...
              </>
            ) : (
              'Send Recovery Code'
            )}
          </button>
        </form>
      )}

      {/* Step 2: Code */}
      {step === 'code' && (
        <form onSubmit={codeForm.handleSubmit} className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            We've sent a recovery code to <strong>{recoveryEmail}</strong>. Enter it below.
          </p>
          <FormInput
            label="Recovery Code"
            type="text"
            name="code"
            placeholder="000000"
            value={codeForm.values.code}
            onChange={codeForm.handleChange}
            onBlur={codeForm.handleBlur}
            error={codeForm.touched.code ? codeForm.errors.code : undefined}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStep('email')}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={codeForm.isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {codeForm.isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Code'
              )}
            </button>
          </div>
        </form>
      )}

      {/* Step 3: Reset */}
      {step === 'reset' && (
        <form onSubmit={resetForm.handleSubmit} className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Enter your new password below.
          </p>
          <FormInput
            label="New Password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={resetForm.values.password}
            onChange={resetForm.handleChange}
            onBlur={resetForm.handleBlur}
            error={resetForm.touched.password ? resetForm.errors.password : undefined}
            helperText="Minimum 8 characters with uppercase, lowercase, and number"
          />
          <FormInput
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            placeholder="••••••••"
            value={resetForm.values.confirmPassword}
            onChange={resetForm.handleChange}
            onBlur={resetForm.handleBlur}
            error={resetForm.touched.confirmPassword ? resetForm.errors.confirmPassword : undefined}
          />
          <button
            type="submit"
            disabled={resetForm.isSubmitting}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {resetForm.isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Resetting...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
      )}
    </div>
  );
};
