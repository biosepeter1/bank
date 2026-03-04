import React, { useEffect, useState } from 'react';
import { Card, Button } from '@/components/ui';
import { useWithdrawalStore } from '@/stores/withdrawalStore';
import WithdrawalForm from '../withdrawals/WithdrawalForm';
import WithdrawalHistory from '../withdrawals/WithdrawalHistory';

const WithdrawalsTab: React.FC = () => {
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);
  const { withdrawals, loading, error, getWithdrawalHistory, clearError } = useWithdrawalStore();

  useEffect(() => {
    getWithdrawalHistory();
  }, []);

  const pendingAmount = withdrawals
    .filter((w) => w.status === 'PENDING')
    .reduce((sum, w) => sum + w.amount, 0);

  const completedAmount = withdrawals
    .filter((w) => w.status === 'COMPLETED')
    .reduce((sum, w) => sum + w.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Withdrawals</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Withdraw funds from your wallet</p>
        </div>
        <Button
          onClick={() => setShowWithdrawalForm(true)}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          New Withdrawal
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Withdrawn</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            ₦{completedAmount.toLocaleString('en-NG')}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Pending Amount</p>
          <p className="text-3xl font-bold text-yellow-600">
            ₦{pendingAmount.toLocaleString('en-NG')}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Requests</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{withdrawals.length}</p>
        </Card>
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

      {/* Withdrawal History */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Withdrawals</h3>
        <WithdrawalHistory
          withdrawals={withdrawals}
          loading={loading}
          onNewWithdrawal={() => setShowWithdrawalForm(true)}
        />
      </div>

      {/* Withdrawal Form Modal */}
      {showWithdrawalForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
          <Card className="w-full max-w-md my-8">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">New Withdrawal</h3>
                <button
                  onClick={() => setShowWithdrawalForm(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
              <WithdrawalForm onSuccess={() => setShowWithdrawalForm(false)} />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default WithdrawalsTab;
