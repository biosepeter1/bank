// ============================================
// VALIDATION UTILITIES
// ============================================

export interface ValidationRule {
  required?: boolean | string;
  minLength?: number | [number, string];
  maxLength?: number | [number, string];
  pattern?: RegExp | [RegExp, string];
  custom?: (value: any) => string | null;
  validate?: (value: any) => boolean | string;
}

export type ValidationRules = Record<string, ValidationRule>;

export interface ValidationErrors {
  [key: string]: string;
}

// ============================================
// COMMON PATTERNS
// ============================================
export const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
  URL: /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&/=]*)$/,
  CREDIT_CARD: /^[0-9]{13,19}$/,
  CVV: /^[0-9]{3,4}$/,
  ACCOUNT_NUMBER: /^[0-9]{8,17}$/,
  ROUTING_NUMBER: /^[0-9]{9}$/,
};

// ============================================
// VALIDATION FUNCTIONS
// ============================================
export const validators = {
  required: (value: any, message = 'This field is required'): string | null => {
    return value === null || value === undefined || value === '' ? message : null;
  },

  email: (value: string, message = 'Please enter a valid email'): string | null => {
    if (!value) return null;
    return PATTERNS.EMAIL.test(value) ? null : message;
  },

  phone: (value: string, message = 'Please enter a valid phone number'): string | null => {
    if (!value) return null;
    return PATTERNS.PHONE.test(value) ? null : message;
  },

  url: (value: string, message = 'Please enter a valid URL'): string | null => {
    if (!value) return null;
    return PATTERNS.URL.test(value) ? null : message;
  },

  minLength: (value: string, min: number, message?: string): string | null => {
    if (!value || value.length >= min) return null;
    return message || `Minimum ${min} characters required`;
  },

  maxLength: (value: string, max: number, message?: string): string | null => {
    if (!value || value.length <= max) return null;
    return message || `Maximum ${max} characters allowed`;
  },

  creditCard: (value: string, message = 'Please enter a valid credit card number'): string | null => {
    if (!value) return null;
    const sanitized = value.replace(/\s/g, '');
    if (!PATTERNS.CREDIT_CARD.test(sanitized)) return message;
    return luhnCheck(sanitized) ? null : message;
  },

  cvv: (value: string, message = 'Please enter a valid CVV'): string | null => {
    if (!value) return null;
    return PATTERNS.CVV.test(value) ? null : message;
  },

  password: (
    value: string,
    message = 'Password must be at least 8 characters with uppercase, lowercase, and number'
  ): string | null => {
    if (!value) return null;
    const hasLength = value.length >= 8;
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    return hasLength && hasUpper && hasLower && hasNumber ? null : message;
  },

  amount: (value: any, message = 'Please enter a valid amount'): string | null => {
    if (value === null || value === undefined || value === '') return null;
    const num = parseFloat(value);
    return !isNaN(num) && num > 0 ? null : message;
  },

  accountNumber: (value: string, message = 'Please enter a valid account number'): string | null => {
    if (!value) return null;
    return PATTERNS.ACCOUNT_NUMBER.test(value) ? null : message;
  },
};

// ============================================
// FORM VALIDATION
// ============================================
export const validateForm = (
  data: Record<string, any>,
  rules: ValidationRules
): ValidationErrors => {
  const errors: ValidationErrors = {};

  for (const [field, rule] of Object.entries(rules)) {
    const value = data[field];
    let error: string | null = null;

    // Required validation
    if (rule.required) {
      error = validators.required(
        value,
        typeof rule.required === 'string' ? rule.required : 'This field is required'
      );
      if (error) {
        errors[field] = error;
        continue;
      }
    }

    // Skip other validations if field is empty and not required
    if (!value && !rule.required) continue;

    // Min length validation
    if (rule.minLength) {
      const [min, msg] = Array.isArray(rule.minLength)
        ? rule.minLength
        : [rule.minLength, undefined];
      error = validators.minLength(value, min, msg);
      if (error) {
        errors[field] = error;
        continue;
      }
    }

    // Max length validation
    if (rule.maxLength) {
      const [max, msg] = Array.isArray(rule.maxLength)
        ? rule.maxLength
        : [rule.maxLength, undefined];
      error = validators.maxLength(value, max, msg);
      if (error) {
        errors[field] = error;
        continue;
      }
    }

    // Pattern validation
    if (rule.pattern) {
      const [pattern, msg] = Array.isArray(rule.pattern)
        ? rule.pattern
        : [rule.pattern, 'Invalid format'];
      if (!pattern.test(String(value))) {
        errors[field] = msg;
        continue;
      }
    }

    // Custom validation
    if (rule.custom) {
      error = rule.custom(value);
      if (error) {
        errors[field] = error;
        continue;
      }
    }

    // Validate function
    if (rule.validate) {
      const result = rule.validate(value);
      if (result !== true) {
        errors[field] = typeof result === 'string' ? result : 'Invalid value';
      }
    }
  }

  return errors;
};

// ============================================
// HELPER FUNCTIONS
// ============================================
export const luhnCheck = (cardNumber: string): boolean => {
  let sum = 0;
  let isEven = false;

  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

export const formatPhoneNumber = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return value;
};

export const formatCreditCard = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  const chunks = cleaned.match(/.{1,4}/g) || [];
  return chunks.join(' ');
};

export const hasErrors = (errors: ValidationErrors): boolean => {
  return Object.keys(errors).length > 0;
};

export const getFieldError = (errors: ValidationErrors, field: string): string | null => {
  return errors[field] || null;
};

// ============================================
// REACT HOOK FOR FORM VALIDATION
// ============================================
export interface UseFormOptions {
  initialValues: Record<string, any>;
  rules?: ValidationRules;
  onSubmit?: (values: Record<string, any>) => void | Promise<void>;
}

export const useForm = ({
  initialValues,
  rules = {},
  onSubmit,
}: UseFormOptions) => {
  const [values, setValues] = React.useState(initialValues);
  const [errors, setErrors] = React.useState<ValidationErrors>({});
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleBlur = (e: React.FocusEvent<any>) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formErrors = validateForm(values, rules);
    setErrors(formErrors);

    if (!hasErrors(formErrors) && onSubmit) {
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      }
    }

    setIsSubmitting(false);
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  const setFieldValue = (name: string, value: any) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setFieldValue,
  };
};

// Import React for the hook
import React from 'react';
