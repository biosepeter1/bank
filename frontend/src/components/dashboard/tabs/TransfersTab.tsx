import React, { useEffect, useState } from 'react';
import { Card, Button, Tabs, TabsContent, TabsList, TabsTrigger, Badge } from '@/components/ui';
import { useTransferStore } from '@/stores/transferStore';
import LocalTransferForm from '../transfers/LocalTransferForm';
import BeneficiaryManager from '../transfers/BeneficiaryManager';
import TransferHistory from '../transfers/TransferHistory';

const TransfersTab: React.FC = () => {
  const [showNewTransfer, setShowNewTransfer] = useState(false);
  const { transfers, loading, error, getTransferHistory, clearError } = useTransferStore();

  useEffect(() => {
    getTransferHistory();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Transfers</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Send money locally or internationally
          </p>
        </div>
        <Button
          onClick={() => setShowNewTransfer(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          New Transfer
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          <Button
            size="sm"
            variant="ghost"
            onClick={clearError}
            className="mt-2"
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="history" className="w-full">
        <TabsList className="bg-gray-100 dark:bg-gray-800 p-1">
          <TabsTrigger value="history" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
            Transfer History
          </TabsTrigger>
          <TabsTrigger value="beneficiaries" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
            Beneficiaries
          </TabsTrigger>
        </TabsList>

        {/* Transfer History */}
        <TabsContent value="history" className="mt-4">
          <TransferHistory
            transfers={transfers}
            loading={loading}
            onNewTransfer={() => setShowNewTransfer(true)}
          />
        </TabsContent>

        {/* Beneficiaries */}
        <TabsContent value="beneficiaries" className="mt-4">
          <BeneficiaryManager />
        </TabsContent>
      </Tabs>

      {/* New Transfer Modal */}
      {showNewTransfer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  New Transfer
                </h3>
                <button
                  onClick={() => setShowNewTransfer(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
              <LocalTransferForm onSuccess={() => setShowNewTransfer(false)} />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TransfersTab;
