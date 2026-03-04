import React, { useRef, useState } from 'react';
import { DollarSign, Calendar } from 'lucide-react';

// ============================================
// OTP INPUT COMPONENT
// ============================================
export interface OTPInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  error?: string;
}

export const OTPInput: React.FC<OTPInputProps> = ({ length = 6, onComplete, error }) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if complete
    if (newOtp.every((digit) => digit !== '')) {
      onComplete(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Enter OTP
      </label>
      <div className="flex gap-3 justify-center">
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            maxLength={1}
            value={otp[index]}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={`w-12 h-12 text-center text-2xl font-semibold rounded-lg border-2 focus:outline-none transition-colors ${
              error
                ? 'border-red-300 focus:border-red-500 dark:border-red-700'
                : 'border-gray-300 focus:border-blue-500 dark:border-gray-600 dark:focus:border-blue-500'
            } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
          />
        ))}
      </div>
      {error && <p className="text-red-600 dark:text-red-400 text-xs mt-2">{error}</p>}
    </div>
  );
};

// ============================================
// AMOUNT INPUT COMPONENT
// ============================================
export interface AmountInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  currency?: string;
  error?: string;
  helperText?: string;
  onAmountChange?: (amount: number) => void;
}

export const AmountInput = React.forwardRef<HTMLInputElement, AmountInputProps>((
  { label, currency = 'USD', error, helperText, onAmountChange, className = '', ...props },
  ref
) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    if (onAmountChange && value) {
      onAmountChange(parseFloat(value));
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <DollarSign size={18} />
        </span>
        <input
          ref={ref}
          type="text"
          inputMode="decimal"
          placeholder="0.00"
          onChange={handleChange}
          className={`w-full pl-10 pr-12 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200 dark:border-red-700 dark:focus:ring-red-900'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200 dark:border-gray-600 dark:focus:border-blue-500 dark:focus:ring-blue-900'
          } bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${className}`}
          {...props}
        />
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm font-medium">
          {currency}
        </span>
      </div>
      {error && <p className="text-red-600 dark:text-red-400 text-xs mt-1">{error}</p>}
      {helperText && !error && <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{helperText}</p>}
    </div>
  );
});

AmountInput.displayName = 'AmountInput';

// ============================================
// DATE INPUT COMPONENT
// ============================================
export interface DateInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>((
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
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          ref={ref}
          type="date"
          className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200 dark:border-red-700 dark:focus:ring-red-900'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200 dark:border-gray-600 dark:focus:border-blue-500 dark:focus:ring-blue-900'
          } bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-red-600 dark:text-red-400 text-xs mt-1">{error}</p>}
      {helperText && !error && <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{helperText}</p>}
    </div>
  );
});

DateInput.displayName = 'DateInput';

// ============================================
// CHECKBOX GROUP
// ============================================
export interface CheckboxOption {
  value: string;
  label: string;
  description?: string;
}

export interface CheckboxGroupProps {
  label?: string;
  options: CheckboxOption[];
  selected?: string[];
  onChange: (selected: string[]) => void;
  error?: string;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  label,
  options,
  selected = [],
  onChange,
  error,
}) => {
  const handleChange = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          {label}
        </label>
      )}
      <div className="space-y-3">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              checked={selected.includes(option.value)}
              onChange={() => handleChange(option.value)}
              className="w-4 h-4 mt-1 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {option.label}
              </p>
              {option.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {option.description}
                </p>
              )}
            </div>
          </label>
        ))}
      </div>
      {error && <p className="text-red-600 dark:text-red-400 text-xs mt-2">{error}</p>}
    </div>
  );
};

// ============================================
// RADIO GROUP
// ============================================
export interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

export interface RadioGroupProps {
  label?: string;
  options: RadioOption[];
  selected: string;
  onChange: (value: string) => void;
  error?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  options,
  selected,
  onChange,
  error,
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          {label}
        </label>
      )}
      <div className="space-y-3">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
          >
            <input
              type="radio"
              name="radio-group"
              value={option.value}
              checked={selected === option.value}
              onChange={() => onChange(option.value)}
              className="w-4 h-4 mt-1 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {option.label}
              </p>
              {option.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {option.description}
                </p>
              )}
            </div>
          </label>
        ))}
      </div>
      {error && <p className="text-red-600 dark:text-red-400 text-xs mt-2">{error}</p>}
    </div>
  );
};
