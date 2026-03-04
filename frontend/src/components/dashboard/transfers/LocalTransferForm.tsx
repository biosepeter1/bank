import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Label } from '@/components/ui';
import { useTransferStore } from '@/stores/transferStore';
import { useWalletStore } from '@/stores/walletStore';

interface LocalTransferFormProps {
  onSuccess?: () => void;
}

const LocalTransferForm: React.FC<LocalTransferFormProps> = ({ onSuccess }) => {
  const { initiateTransfer, loading, error } = useTransferStore();
  const { wallet } = useWalletStore();
  const [formData, setFormData] = useState({
    recipientAccountNumber: '',
    recipientName: '',
    amount: '',
    description: '',
  });
  const [validationError, setValidationError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setValidationError('');
  };

  const validateForm = (): boolean => {
    if (!formData.recipientAccountNumber.trim()) {
      setValidationError('Recipient account number is required');
      return false;
    }
    if (!formData.recipientName.trim()) {
      setValidationError('Recipient name is required');
      return false;
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setValidationError('Amount must be greater than 0');
      return false;
    }
    if (wallet && parseFloat(formData.amount) > wallet.balance) {
      setValidationError('Insufficient balance');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await initiateTransfer({
        recipientAccountNumber: formData.recipientAccountNumber,
        recipientName: formData.recipientName,
        amount: parseFloat(formData.amount),
        description: formData.description,
        transferType: 'LOCAL',
      });
      onSuccess?.();
    } catch (err) {
      console.error('Transfer failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Recipient Account Number */}
      <div>
        <Label htmlFor="recipientAccountNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Account Number
        </Label>
        <Input
          id="recipientAccountNumber"
          name="recipientAccountNumber"
          type="text"
          placeholder="Enter account number"
          value={formData.recipientAccountNumber}
          onChange={handleInputChange}
          className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Recipient Name */}
      <div>
        <Label htmlFor="recipientName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Recipient Name
        </Label>
        <Input
          id="recipientName"
          name="recipientName"
          type="text"
          placeholder="Enter recipient name"
          value={formData.recipientName}
          onChange={handleInputChange}
          className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Amount */}
      <div>
        <Label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Amount (NGN)
        </Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          placeholder="0.00"
          value={formData.amount}
          onChange={handleInputChange}
          step="0.01"
          min="0"
          className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {wallet && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Available balance: ₦{wallet.balance?.toFixed(2)}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description (Optional)
        </Label>
        <textarea
          id="description"
          name="description"
          placeholder="Transfer description"
          value={formData.description}
          onChange={handleInputChange}
          rows={2}
          className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
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
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : 'Send Transfer'}
      </Button>
    </form>
  );
};

export default LocalTransferForm;
