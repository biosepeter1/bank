import React from 'react';
import { Card, Button, Badge } from '@/components/ui';

interface Transfer {
  id: string;
  recipientAccountNumber: string;
  recipientName: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  description?: string;
  createdAt: string;
  reference: string;
}

interface TransferHistoryProps {
  transfers: Transfer[];
  loading: boolean;
  onNewTransfer?: () => void;
}

const TransferHistory: React.FC<TransferHistoryProps> = ({
  transfers,
  loading,
  onNewTransfer,
}) => {
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
        <p className="text-gray-500 dark:text-gray-400">Loading transfers...</p>
      </Card>
    );
  }

  if (transfers.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400 mb-4">No transfers yet</p>
        <Button
          onClick={onNewTransfer}
          className="mx-auto bg-blue-600 hover:bg-blue-700 text-white"
        >
          Make your first transfer
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {transfers.map((transfer) => (
        <Card key={transfer.id} className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    {transfer.recipientName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {transfer.recipientName}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {transfer.recipientAccountNumber}
                  </p>
                </div>
              </div>
              {transfer.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 ml-13">
                  {transfer.description}
                </p>
              )}
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 ml-13">
                Ref: {transfer.reference}
              </p>
            </div>

            <div className="text-right">
              <p className="font-semibold text-gray-900 dark:text-white mb-2">
                ₦{transfer.amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <Badge className={`${getStatusColor(transfer.status)} text-xs font-medium`}>
                {transfer.status}
              </Badge>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                {formatDate(transfer.createdAt)}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default TransferHistory;
