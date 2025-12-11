'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { TrendingDown, Loader2, AlertTriangle } from 'lucide-react';
import { walletApi } from '@/lib/api/wallet';
import { toast } from 'react-hot-toast';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentBalance: number;
}

export default function WithdrawModal({ isOpen, onClose, onSuccess, currentBalance }: WithdrawModalProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ amount?: string; description?: string }>({});

  const validateForm = () => {
    const newErrors: { amount?: string; description?: string } = {};
    
    if (!amount || isNaN(Number(amount))) {
      newErrors.amount = 'Please enter a valid amount';
    } else if (Number(amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    } else if (Number(amount) > currentBalance) {
      newErrors.amount = 'Insufficient balance';
    } else if (Number(amount) > 500000) {
      newErrors.amount = 'Maximum withdrawal is ₦500,000';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await walletApi.withdraw(Number(amount), description || undefined);
      toast.success('Withdrawal successful!');
      onSuccess();
      handleClose();
    } catch (error: any) {
      console.error('Withdrawal error:', error);
      toast.error(error?.response?.data?.message || 'Withdrawal failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setAmount('');
      setDescription('');
      setErrors({});
      onClose();
    }
  };

  const remainingBalance = currentBalance - (Number(amount) || 0);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-red-600" />
            Withdraw Money
          </DialogTitle>
          <DialogDescription>
            Withdraw funds from your wallet. Please ensure you have sufficient balance.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Balance Info */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Available Balance:</span>
              <span className="font-bold text-blue-600">₦{currentBalance.toLocaleString()}</span>
            </div>
            {amount && Number(amount) > 0 && (
              <div className="flex items-center justify-between text-sm mt-2 pt-2 border-t border-blue-200">
                <span className="text-gray-600">After Withdrawal:</span>
                <span className={`font-bold ${remainingBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₦{remainingBalance.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="amount">Amount (₦)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={loading}
              className={errors.amount ? 'border-red-500' : ''}
            />
            {errors.amount && (
              <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {errors.amount}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              type="text"
              placeholder="e.g., ATM withdrawal, Cash for expenses"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              maxLength={100}
            />
            <p className="text-xs text-gray-500 mt-1">
              {description.length}/100 characters
            </p>
          </div>

          {currentBalance < 100 && (
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
              <p className="text-sm text-yellow-800 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Low balance warning: Consider depositing funds to maintain account activity.
              </p>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !amount || Number(amount) <= 0 || Number(amount) > currentBalance}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Withdraw ₦{amount ? Number(amount).toLocaleString() : '0'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
