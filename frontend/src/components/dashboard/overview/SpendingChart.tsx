import React from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';

const SpendingChart: React.FC = () => {
  const monthlyData = [
    { month: 'Jan', spent: 45000, budget: 60000 },
    { month: 'Feb', spent: 52000, budget: 60000 },
    { month: 'Mar', spent: 38000, budget: 60000 },
    { month: 'Apr', spent: 61000, budget: 60000 },
    { month: 'May', spent: 55000, budget: 60000 },
    { month: 'Jun', spent: 48000, budget: 60000 },
  ];

  const maxSpent = Math.max(...monthlyData.map((d) => d.spent));
  const totalSpent = monthlyData.reduce((sum, d) => sum + d.spent, 0);
  const avgSpent = Math.round(totalSpent / monthlyData.length);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Monthly Spending</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Last 6 months overview</p>
        </div>
        <div className="flex items-center gap-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Spent</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">₦{totalSpent.toLocaleString('en-NG')}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Average</p>
            <p className="text-2xl font-bold text-blue-600">₦{avgSpent.toLocaleString('en-NG')}</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="space-y-4">
        {monthlyData.map((data, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{data.month}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">₦{data.spent.toLocaleString('en-NG')}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all ${
                  data.spent > data.budget
                    ? 'bg-red-500'
                    : data.spent > data.budget * 0.8
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }`}
                style={{ width: `${(data.spent / data.budget) * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Budget: ₦{data.budget.toLocaleString('en-NG')}</span>
              {data.spent > data.budget && (
                <span className="text-xs text-red-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Over budget
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Highest Spent</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">₦{Math.max(...monthlyData.map((d) => d.spent)).toLocaleString('en-NG')}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Lowest Spent</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">₦{Math.min(...monthlyData.map((d) => d.spent)).toLocaleString('en-NG')}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Budget Status</p>
            <p className="text-lg font-semibold text-green-600 mt-1">4/6 on track</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpendingChart;
