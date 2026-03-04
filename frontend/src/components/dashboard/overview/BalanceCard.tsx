import React from 'react';
import { Eye, EyeOff, Copy, DollarSign } from 'lucide-react';

interface BalanceCardProps {
  balance: number;
  showBalance: boolean;
  onToggle: () => void;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ balance, showBalance, onToggle }) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 rounded-lg p-8 text-white shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-blue-100 text-sm font-medium mb-2">Total Balance</p>
          <div className="flex items-baseline gap-3">
            <h2 className="text-4xl font-bold">
              {showBalance ? `₦${balance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}` : '••••••'}
            </h2>
            <button onClick={onToggle} className="p-1 hover:bg-white/20 rounded-lg transition">
              {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-blue-100 text-xs mt-4">Account Status: <span className="text-green-300 font-semibold">Active</span></p>
        </div>
        <div className="p-3 bg-white/20 rounded-lg">
          <DollarSign className="w-8 h-8" />
        </div>
      </div>

      {/* Card Details */}
      <div className="mt-8 flex items-center justify-between">
        <div>
          <p className="text-xs text-blue-100 uppercase tracking-widest">Account Number</p>
          <p className="text-lg font-semibold mt-1">****4829</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition text-sm font-medium">
          <Copy className="w-4 h-4" />
          Copy
        </button>
      </div>
    </div>
  );
};

export default BalanceCard;
