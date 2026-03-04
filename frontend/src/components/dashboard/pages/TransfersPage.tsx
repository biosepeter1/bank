import React, { useState } from 'react';
import { Send, Plus, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { useTransferStore } from '@/stores/transferStore';
import { useWalletStore } from '@/stores/walletStore';

export const TransfersPage: React.FC = () => {
  const { beneficiaries, transfers, loading, error } = useTransferStore();
  const { wallet } = useWalletStore();
  const [showForm, setShowForm] = useState(false);
  const [transferType, setTransferType] = useState<'local' | 'international'>('local');
  const [formData, setFormData] = useState({
    recipientAccountNumber: '',
    recipientName: '',
    bankCode: '',
    amount: '',
    description: '',
  });
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowOTP(true);
  };

  const handleOTPConfirm = () => {
    // TODO: Submit transfer with OTP verification
    setShowForm(false);
    setFormData({
      recipientAccountNumber: '',
      recipientName: '',
      bankCode: '',
      amount: '',
      description: '',
    });
    setOtp('');
    setShowOTP(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Transfers</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Send money locally or internationally</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            <Send className="w-4 h-4" />
            New Transfer
          </button>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-700 dark:text-red-400 text-sm font-medium">Transfer Error</p>
            <p className="text-red-600 dark:text-red-300 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transfer Form */}
        <div className="lg:col-span-2">
          {showForm ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">New Transfer</h3>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setShowOTP(false);
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>

              {/* Transfer Type Tabs */}
              <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setTransferType('local')}
                  className={`pb-3 px-2 font-medium text-sm ${
                    transferType === 'local'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Local Transfer
                </button>
                <button
                  onClick={() => setTransferType('international')}
                  className={`pb-3 px-2 font-medium text-sm ${
                    transferType === 'international'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  International
                </button>
              </div>

              {!showOTP ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Recipient Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Recipient Name
                    </label>
                    <input
                      type="text"
                      name="recipientName"
                      value={formData.recipientName}
                      onChange={handleInputChange}
                      placeholder="Enter recipient name"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>

                  {/* Account Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Account Number
                    </label>
                    <input
                      type="text"
                      name="recipientAccountNumber"
                      value={formData.recipientAccountNumber}
                      onChange={handleInputChange}
                      placeholder="Enter account number"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>

                  {/* Bank Code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bank Code
                    </label>
                    <input
                      type="text"
                      name="bankCode"
                      value={formData.bankCode}
                      onChange={handleInputChange}
                      placeholder="e.g., 044"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Amount (NGN)
                    </label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                    {wallet && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Available: ₦{wallet.balance?.toLocaleString('en-NG')}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="What is this transfer for?"
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Processing...' : 'Continue to Verification'}
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-blue-900 dark:text-blue-300">Verify your identity</p>
                        <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                          We've sent a verification code to your registered email and phone number.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Enter Verification Code
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="000000"
                      maxLength="6"
                      className="w-full px-4 py-2 text-center text-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none tracking-widest"
                    />
                  </div>

                  <button
                    onClick={handleOTPConfirm}
                    className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition"
                  >
                    Confirm Transfer
                  </button>
                  <button
                    onClick={() => setShowOTP(false)}
                    className="w-full py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition"
                  >
                    Back
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
              <Send className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No active transfer</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                Start a Transfer
              </button>
            </div>
          )}
        </div>

        {/* Beneficiaries Sidebar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Beneficiaries</h3>
            <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-400">
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {beneficiaries && beneficiaries.length > 0 ? (
            <div className="space-y-3">
              {beneficiaries.map((beneficiary) => (
                <div
                  key={beneficiary.id}
                  className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition"
                >
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{beneficiary.accountName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{beneficiary.accountNumber}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{beneficiary.bankCode}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No beneficiaries yet</p>
          )}
        </div>
      </div>

      {/* Transfer History */}
      {transfers && transfers.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Transfers</h3>
          <div className="space-y-3">
            {transfers.slice(0, 5).map((transfer) => (
              <div key={transfer.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{transfer.recipientName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{transfer.recipientAccountNumber}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">-₦{transfer.amount.toLocaleString('en-NG')}</p>
                  <span
                    className={`text-xs font-medium ${
                      transfer.status === 'COMPLETED'
                        ? 'text-green-600'
                        : transfer.status === 'PENDING'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  >
                    {transfer.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
