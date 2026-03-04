import React, { useEffect, useState } from 'react';
import { Card, Button, Input, Label, Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui';
import { useTransferStore } from '@/stores/transferStore';

const BeneficiaryManager: React.FC = () => {
  const {
    beneficiaries,
    loading,
    error,
    getBeneficiaries,
    addBeneficiary,
    removeBeneficiary,
    clearError,
  } = useTransferStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    accountNumber: '',
    accountName: '',
    bankCode: '',
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    getBeneficiaries();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormError('');
  };

  const validateForm = (): boolean => {
    if (!formData.accountNumber.trim()) {
      setFormError('Account number is required');
      return false;
    }
    if (!formData.accountName.trim()) {
      setFormError('Account name is required');
      return false;
    }
    if (!formData.bankCode.trim()) {
      setFormError('Bank code is required');
      return false;
    }
    return true;
  };

  const handleAddBeneficiary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await addBeneficiary({
        accountNumber: formData.accountNumber,
        accountName: formData.accountName,
        bankCode: formData.bankCode,
      });
      setFormData({ accountNumber: '', accountName: '', bankCode: '' });
      setShowAddForm(false);
    } catch (err) {
      console.error('Failed to add beneficiary:', err);
    }
  };

  const handleRemove = async (beneficiaryId: string) => {
    if (window.confirm('Are you sure you want to remove this beneficiary?')) {
      try {
        await removeBeneficiary(beneficiaryId);
      } catch (err) {
        console.error('Failed to remove beneficiary:', err);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Saved Beneficiaries</h3>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          size="sm"
        >
          Add Beneficiary
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          <Button size="sm" variant="ghost" onClick={clearError} className="mt-2">
            Dismiss
          </Button>
        </div>
      )}

      {/* Beneficiaries List */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">Loading beneficiaries...</p>
        </div>
      ) : beneficiaries.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No beneficiaries added yet</p>
          <Button
            onClick={() => setShowAddForm(true)}
            variant="outline"
            className="mx-auto"
          >
            Add your first beneficiary
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {beneficiaries.map((beneficiary) => (
            <Card key={beneficiary.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{beneficiary.accountName}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Account: {beneficiary.accountNumber}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Bank Code: {beneficiary.bankCode}
                  </p>
                </div>
                <Button
                  onClick={() => handleRemove(beneficiary.id)}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Remove
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Beneficiary Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Add Beneficiary
                </h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddBeneficiary} className="space-y-4">
                <div>
                  <Label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Account Number
                  </Label>
                  <Input
                    id="accountNumber"
                    name="accountNumber"
                    type="text"
                    placeholder="Enter account number"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    className="mt-1 w-full"
                  />
                </div>

                <div>
                  <Label htmlFor="accountName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Account Name
                  </Label>
                  <Input
                    id="accountName"
                    name="accountName"
                    type="text"
                    placeholder="Enter account name"
                    value={formData.accountName}
                    onChange={handleInputChange}
                    className="mt-1 w-full"
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
                    className="mt-1 w-full"
                  />
                </div>

                {formError && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                    <p className="text-sm text-red-700 dark:text-red-400">{formError}</p>
                  </div>
                )}

                <div className="flex gap-3 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {loading ? 'Adding...' : 'Add Beneficiary'}
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BeneficiaryManager;
