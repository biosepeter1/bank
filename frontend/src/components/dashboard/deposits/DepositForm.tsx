import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Label, Select } from '@/components/ui';
import { useDepositStore } from '@/stores/depositStore';

interface DepositFormProps {
  onSuccess?: () => void;
}

const DepositForm: React.FC<DepositFormProps> = ({ onSuccess }) => {
  const { initiateDeposit, loading, error } = useDepositStore();
  const [formData, setFormData] = useState({
    amount: '',
    method: 'PAYSTACK',
  });
  const [validationError, setValidationError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const depositMethods = [
    { value: 'PAYSTACK', label: 'Paystack (Card)' },
    { value: 'USDT', label: 'USDT (Crypto)' },
    { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setValidationError('');
  };

  const validateForm = (): boolean => {
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setValidationError('Amount must be greater than 0');
      return false;
    }
    if (parseFloat(formData.amount) < 100) {
      setValidationError('Minimum deposit amount is ₦100');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsProcessing(true);
    try {
      const result = await initiateDeposit(parseFloat(formData.amount), formData.method);

      // If Paystack, redirect to payment page
      if (formData.method === 'PAYSTACK' && result.paystack?.authorization_url) {
        window.location.href = result.paystack.authorization_url;
      } else {
        // For other methods, show success message
        setFormData({ amount: '', method: 'PAYSTACK' });
        onSuccess?.();
      }
    } catch (err) {
      console.error('Deposit initiation failed:', err);
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Amount */}
      <div>
        <Label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Amount (NGN)
        </Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          placeholder="Enter amount"
          value={formData.amount}
          onChange={handleInputChange}
          step="100"
          min="100"
          className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Minimum: ₦100</p>
      </div>

      {/* Deposit Method */}
      <div>
        <Label htmlFor="method" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Payment Method
        </Label>
        <Select
          name="method"
          value={formData.method}
          onChange={handleInputChange}
          className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          {depositMethods.map((method) => (
            <option key={method.value} value={method.value}>
              {method.label}
            </option>
          ))}
        </Select>
      </div>

      {/* Method Description */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
        <p className="text-xs text-blue-700 dark:text-blue-400">
          {formData.method === 'PAYSTACK' &&
            'You will be redirected to Paystack to complete your payment securely.'}
          {formData.method === 'USDT' &&
            'Transfer USDT to the provided wallet address. Funds will be credited after confirmation.'}
          {formData.method === 'BANK_TRANSFER' &&
            'Use the bank details provided to transfer funds. Please upload proof after transfer.'}
        </p>
      </div>

      {/* Errors */}
      {(validationError || error) && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-sm text-red-700 dark:text-red-400">{validationError || error}</p>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={loading || isProcessing}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading || isProcessing ? 'Processing...' : 'Continue to Payment'}
      </Button>

      {/* Footer Note */}
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        Your deposit is secure and encrypted. We don't store your payment details.
      </p>
    </form>
  );
};

export default DepositForm;
