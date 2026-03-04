import React, { useEffect, useState } from 'react';
import { Card, Button, Tabs, TabsContent, TabsList, TabsTrigger, Badge } from '@/components/ui';
import { useDepositStore } from '@/stores/depositStore';
import DepositForm from '../deposits/DepositForm';
import DepositHistory from '../deposits/DepositHistory';

const DepositsTab: React.FC = () => {
  const [showDepositForm, setShowDepositForm] = useState(false);
  const { deposits, loading, error, getDepositHistory, clearError } = useDepositStore();

  useEffect(() => {
    getDepositHistory();
  }, []);

  const totalDeposited = deposits
    .filter((d) => d.status === 'COMPLETED')
    .reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Deposits</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Add funds to your wallet</p>
        </div>
        <Button
          onClick={() => setShowDepositForm(true)}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          New Deposit
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Deposited</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            ₦{totalDeposited.toLocaleString('en-NG')}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Deposits</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{deposits.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Completed</p>
          <p className="text-3xl font-bold text-green-600">
            {deposits.filter((d) => d.status === 'COMPLETED').length}
          </p>
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

      {/* Deposit History */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Deposits</h3>
        <DepositHistory deposits={deposits} loading={loading} onNewDeposit={() => setShowDepositForm(true)} />
      </div>

      {/* Deposit Form Modal */}
      {showDepositForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
          <Card className="w-full max-w-md my-8">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">New Deposit</h3>
                <button
                  onClick={() => setShowDepositForm(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
              <DepositForm onSuccess={() => setShowDepositForm(false)} />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DepositsTab;
