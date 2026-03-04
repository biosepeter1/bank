import React from 'react';
import { Card, Button, Badge } from '@/components/ui';

interface Deposit {
  id: string;
  amount: number;
  depositMethod: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  createdAt: string;
  completedAt?: string;
}

interface DepositHistoryProps {
  deposits: Deposit[];
  loading: boolean;
  onNewDeposit?: () => void;
}

const DepositHistory: React.FC<DepositHistoryProps> = ({ deposits, loading, onNewDeposit }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'PENDING':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
      case 'FAILED':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      case 'CANCELLED':
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400';
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'PAYSTACK':
        return '💳';
      case 'USDT':
        return '🪙';
      case 'BANK_TRANSFER':
        return '🏦';
      default:
        return '💰';
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
        <p className="text-gray-500 dark:text-gray-400">Loading deposits...</p>
      </Card>
    );
  }

  if (deposits.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400 mb-4">No deposits yet</p>
        <Button
          onClick={onNewDeposit}
          className="mx-auto bg-green-600 hover:bg-green-700 text-white"
        >
          Make your first deposit
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {deposits.map((deposit) => (
        <Card key={deposit.id} className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-lg">
                  {getMethodIcon(deposit.depositMethod)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {deposit.depositMethod}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(deposit.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="font-semibold text-gray-900 dark:text-white mb-2">
                +₦{deposit.amount.toLocaleString('en-NG', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <Badge className={`${getStatusColor(deposit.status)} text-xs font-medium`}>
                {deposit.status}
              </Badge>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default DepositHistory;
