import React from 'react';
import { Check, Clock, AlertCircle, XCircle, TrendingUp, TrendingDown } from 'lucide-react';

// ============================================
// STATUS BADGE COMPONENT
// ============================================
export interface StatusBadgeProps {
  status: 'success' | 'pending' | 'warning' | 'error';
  label: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, size = 'md' }) => {
  const baseClasses = 'font-medium rounded-full inline-flex items-center gap-1';
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const statusClasses = {
    success: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200',
    pending: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200',
    warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200',
    error: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200',
  };

  const iconClasses = {
    success: <Check size={size === 'sm' ? 14 : size === 'md' ? 16 : 18} />,
    pending: <Clock size={size === 'sm' ? 14 : size === 'md' ? 16 : 18} />,
    warning: <AlertCircle size={size === 'sm' ? 14 : size === 'md' ? 16 : 18} />,
    error: <XCircle size={size === 'sm' ? 14 : size === 'md' ? 16 : 18} />,
  };

  return (
    <span className={`${baseClasses} ${sizeClasses[size]} ${statusClasses[status]}`}>
      {iconClasses[status]}
      {label}
    </span>
  );
};

// ============================================
// STAT CARD COMPONENT
// ============================================
export interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  change,
  icon,
  trend = 'neutral',
  className = '',
}) => {
  const trendColor = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400',
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
          {change !== undefined && (
            <p className={`text-sm mt-2 ${trendColor[trend]}`}>
              {trend === 'up' && <TrendingUp className="inline mr-1" size={14} />}
              {trend === 'down' && <TrendingDown className="inline mr-1" size={14} />}
              {change > 0 ? '+' : ''}{change}%
            </p>
          )}
        </div>
        {icon && <div className="text-gray-400 dark:text-gray-500">{icon}</div>}
      </div>
    </div>
  );
};

// ============================================
// TRANSACTION ITEM COMPONENT
// ============================================
export interface TransactionItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  amount: string;
  date: string;
  status: 'success' | 'pending' | 'warning' | 'error';
  amountColor?: 'default' | 'positive' | 'negative';
  onClick?: () => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  icon,
  title,
  subtitle,
  amount,
  date,
  status,
  amountColor = 'default',
  onClick,
}) => {
  const amountColorClasses = {
    default: 'text-gray-900 dark:text-white',
    positive: 'text-green-600 dark:text-green-400',
    negative: 'text-gray-900 dark:text-white',
  };

  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="text-gray-400 dark:text-gray-500">{icon}</div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{title}</p>
          {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{date}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-sm font-semibold ${amountColorClasses[amountColor]}`}>{amount}</p>
        <div className="mt-1">
          <StatusBadge status={status} label="" size="sm" />
        </div>
      </div>
    </div>
  );
};

// ============================================
// FORM INPUT COMPONENT
// ============================================
export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  helperText?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>((
  { label, error, icon, helperText, className = '', ...props },
  ref
) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">{icon}</div>}
        <input
          ref={ref}
          className={`w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200 dark:border-red-700 dark:focus:ring-red-900'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200 dark:border-gray-600 dark:focus:border-blue-500 dark:focus:ring-blue-900'
          } bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${icon ? 'pl-10' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-red-600 dark:text-red-400 text-xs mt-1">{error}</p>}
      {helperText && !error && <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{helperText}</p>}
    </div>
  );
});

FormInput.displayName = 'FormInput';

// ============================================
// FORM SELECT COMPONENT
// ============================================
export interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
  helperText?: string;
}

export const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>((
  { label, error, options, helperText, className = '', ...props },
  ref
) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={`w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 appearance-none ${
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-200 dark:border-red-700 dark:focus:ring-red-900'
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200 dark:border-gray-600 dark:focus:border-blue-500 dark:focus:ring-blue-900'
        } bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${className}`}
        {...props}
      >
        <option value="">Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-600 dark:text-red-400 text-xs mt-1">{error}</p>}
      {helperText && !error && <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{helperText}</p>}
    </div>
  );
});

FormSelect.displayName = 'FormSelect';

// ============================================
// FORM TEXTAREA COMPONENT
// ============================================
export interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>((
  { label, error, helperText, className = '', ...props },
  ref
) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={`w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 resize-none ${
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-200 dark:border-red-700 dark:focus:ring-red-900'
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200 dark:border-gray-600 dark:focus:border-blue-500 dark:focus:ring-blue-900'
        } bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${className}`}
        {...props}
      />
      {error && <p className="text-red-600 dark:text-red-400 text-xs mt-1">{error}</p>}
      {helperText && !error && <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{helperText}</p>}
    </div>
  );
});

FormTextarea.displayName = 'FormTextarea';
