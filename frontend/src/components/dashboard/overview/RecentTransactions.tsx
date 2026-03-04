import React from 'react';
import { ArrowUpRight, ArrowDownLeft, MoreVertical } from 'lucide-react';

interface Transaction {
  id: string;
  type: string;
  description: string;
  amount: number;
  createdAt: string;
  status?: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  const getTransactionIcon = (type: string) => {
    const isIncome = type.includes('received') || type.includes('deposit') || type.includes('income');
    return isIncome ? (
      <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
        <ArrowDownLeft className="w-4 h-4 text-green-600" />
      </div>
    ) : (
      <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
        <ArrowUpRight className="w-4 h-4 text-red-600" />
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {transactions.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            No transactions yet
          </div>
        ) : (
          transactions.map((tx) => (
            <div key={tx.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                {getTransactionIcon(tx.type)}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{tx.description}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formatDate(tx.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className={`text-sm font-semibold ${
                    tx.type.includes('received') || tx.type.includes('deposit')
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    {tx.type.includes('received') || tx.type.includes('deposit') ? '+' : '-'}₦{tx.amount.toLocaleString('en-NG')}
                  </p>
                </div>
                <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      {transactions.length > 0 && (
        <div className="p-4 text-center border-t border-gray-200 dark:border-gray-700">
          <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All Transactions
          </a>
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;
