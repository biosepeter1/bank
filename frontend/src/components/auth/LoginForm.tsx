import React, { useState } from 'react';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { useForm, PATTERNS } from '@/utils';
import { FormInput } from '@/components/common';
import { useToast } from '@/components/common';
import { authService } from '@/services';
import { useUserStore } from '@/stores';

export interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { setUser } = useUserStore();
  const { success, error } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    rules: {
      email: {
        required: 'Email is required',
        pattern: [PATTERNS.EMAIL, 'Invalid email format'],
      },
      password: {
        required: 'Password is required',
        minLength: [6, 'Minimum 6 characters'],
      },
    },
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const response = await authService.login(values.email, values.password);
        if (response.data?.user) {
          setUser(response.data.user);
          localStorage.setItem('authToken', response.data.token);
          if (values.rememberMe) {
            localStorage.setItem('rememberEmail', values.email);
          }
          success('Login successful!');
          onSuccess?.();
        }
      } catch (err: any) {
        error(err.message || 'Login failed');
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <form onSubmit={form.handleSubmit} className="space-y-4">
      <FormInput
        label="Email Address"
        type="email"
        name="email"
        placeholder="you@example.com"
        value={form.values.email}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
        error={form.touched.email ? form.errors.email : undefined}
        icon={<Mail size={18} />}
      />

      <FormInput
        label="Password"
        type="password"
        name="password"
        placeholder="••••••••"
        value={form.values.password}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
        error={form.touched.password ? form.errors.password : undefined}
        icon={<Lock size={18} />}
      />

      <div className="flex items-center">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="rememberMe"
            checked={form.values.rememberMe}
            onChange={form.handleChange}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Remember me
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading || form.isSubmitting}
        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {isLoading || form.isSubmitting ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Logging in...
          </>
        ) : (
          'Login'
        )}
      </button>

      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        Don't have an account?{' '}
        <a href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
          Sign up
        </a>
      </div>
    </form>
  );
};
