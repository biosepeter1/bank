import React from 'react';
import { Card, Button, Badge } from '@/components/ui';

interface Withdrawal {
  id: string;
  amount: number;
  fee: number;
  withdrawalMethod: string;
  accountName: string;
  status: 'PENDING' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';
  createdAt: string;
  processedAt?: string;
}

interface WithdrawalHistoryProps {
  withdrawals: Withdrawal[];
  loading: boolean;
  onNewWithdrawal?: () => void;
}

const WithdrawalHistory: React.FC<WithdrawalHistoryProps> = ({
  withdrawals,
  loading,
  onNewWithdrawal,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'PENDING':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
      case 'REJECTED':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      case 'CANCELLED':
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">Loading withdrawals...</p>
      </Card>
    );
  }

  if (withdrawals.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400 mb-4">No withdrawals yet</p>
        <Button
          onClick={onNewWithdrawal}
          className="mx-auto bg-red-600 hover:bg-red-700 text-white"
        >
          Request your first withdrawal
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {withdrawals.map((withdrawal) => (
        <Card key={withdrawal.id} className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-lg">
                  ↙️
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {withdrawal.accountName}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {withdrawal.withdrawalMethod}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {formatDate(withdrawal.createdAt)}
              </p>
            </div>

            <div className="text-right">
              <div className="mb-2">
                <p className="font-semibold text-gray-900 dark:text-white">
                  -₦{withdrawal.amount.toLocaleString('en-NG', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Fee: ₦{withdrawal.fee.toFixed(2)}
                </p>
              </div>
              <Badge className={`${getStatusColor(withdrawal.status)} text-xs font-medium`}>
                {withdrawal.status}
              </Badge>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default WithdrawalHistory;
