import React from 'react';
import { Send, Plus, ArrowDownLeft, Zap, CreditCard, TrendingUp } from 'lucide-react';

const QuickActions: React.FC = () => {
  const actions = [
    { label: 'Send Money', icon: Send, color: 'blue' },
    { label: 'Deposit', icon: ArrowDownLeft, color: 'green' },
    { label: 'Request', icon: Zap, color: 'yellow' },
    { label: 'Add Card', icon: CreditCard, color: 'purple' },
    { label: 'Invest', icon: TrendingUp, color: 'indigo' },
    { label: 'More', icon: Plus, color: 'gray' },
  ];

  const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    green: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
    purple: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    indigo: 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
    gray: 'bg-gray-100 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              className={`flex flex-col items-center gap-3 p-4 rounded-lg hover:shadow-md transition-all ${
                colorClasses[action.color as keyof typeof colorClasses]
              }`}
            >
              <div className={`p-3 bg-white dark:bg-gray-800 rounded-lg`}>
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium text-center">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
