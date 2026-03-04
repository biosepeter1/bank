import React, { useState } from 'react';
import { Button, Input, Label, Select } from '@/components/ui';
import { useWithdrawalStore } from '@/stores/withdrawalStore';
import { useWalletStore } from '@/stores/walletStore';

interface WithdrawalFormProps {
  onSuccess?: () => void;
}

const WithdrawalForm: React.FC<WithdrawalFormProps> = ({ onSuccess }) => {
  const { initiateWithdrawal, loading, error } = useWithdrawalStore();
  const { wallet } = useWalletStore();
  const [formData, setFormData] = useState({
    amount: '',
    withdrawalMethod: 'BANK_TRANSFER',
    accountNumber: '',
    bankCode: '',
    accountName: '',
    narration: '',
  });
  const [validationError, setValidationError] = useState('');

  const withdrawalMethods = [
    { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
    { value: 'WALLET', label: 'Wallet' },
    { value: 'CRYPTO', label: 'Cryptocurrency' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
      setValidationError('Minimum withdrawal amount is ₦100');
      return false;
    }
    if (wallet && parseFloat(formData.amount) > wallet.balance) {
      setValidationError('Insufficient balance');
      return false;
    }
    if (!formData.accountNumber.trim()) {
      setValidationError('Account number is required');
      return false;
    }
    if (!formData.bankCode.trim()) {
      setValidationError('Bank code is required');
      return false;
    }
    if (!formData.accountName.trim()) {
      setValidationError('Account name is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await initiateWithdrawal({
        amount: parseFloat(formData.amount),
        withdrawalMethod: formData.withdrawalMethod,
        accountNumber: formData.accountNumber,
        bankCode: formData.bankCode,
        accountName: formData.accountName,
        narration: formData.narration,
      });
      onSuccess?.();
    } catch (err) {
      console.error('Withdrawal initiation failed:', err);
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
          className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
        />
        {wallet && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Available: ₦{wallet.balance?.toFixed(2)}
          </p>
        )}
      </div>

      {/* Withdrawal Method */}
      <div>
        <Label htmlFor="withdrawalMethod" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Withdrawal Method
        </Label>
        <Select
          name="withdrawalMethod"
          value={formData.withdrawalMethod}
          onChange={handleInputChange}
          className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
        >
          {withdrawalMethods.map((method) => (
            <option key={method.value} value={method.value}>
              {method.label}
            </option>
          ))}
        </Select>
      </div>

      {/* Account Details */}
      <div>
        <Label htmlFor="accountName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Account Name
        </Label>
        <Input
          id="accountName"
          name="accountName"
          type="text"
          placeholder="Account holder name"
          value={formData.accountName}
          onChange={handleInputChange}
          className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Account Number
          </Label>
          <Input
            id="accountNumber"
            name="accountNumber"
            type="text"
            placeholder="Account number"
            value={formData.accountNumber}
            onChange={handleInputChange}
            className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
          />
        </div>
        <div>
          <Label htmlFor="bankCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Bank Code
          </Label>
          <Input
            id="bankCode"
            name="bankCode"
            type="text"
            placeholder="e.g. 044"
            value={formData.bankCode}
            onChange={handleInputChange}
            className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
          />
        </div>
      </div>

      {/* Errors */}
      {(validationError || error) && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-sm text-red-700 dark:text-red-400">{validationError || error}</p>
        </div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Request Withdrawal'}
      </Button>
    </form>
  );
};

export default WithdrawalForm;
