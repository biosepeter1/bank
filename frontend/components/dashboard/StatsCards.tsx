'use client';

import { Wallet, TrendingUp, TrendingDown, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useMemo } from 'react';

interface StatsCardsProps {
  balance: number;
  totalIncome: number;
  totalExpenses: number;
  currency: string;
}

export default function StatsCards({
  balance,
  totalIncome,
  totalExpenses,
  currency,
}: StatsCardsProps) {
  const [balanceVisible, setBalanceVisible] = useState(true);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const stats = useMemo(
    () => [
      {
        title: 'Total Balance',
        value: balance,
        icon: Wallet,
        color: 'bg-blue-500',
        trend: null,
      },
      {
        title: 'Total Income',
        value: totalIncome,
        icon: TrendingUp,
        color: 'bg-green-500',
        trend: '+12.5%',
      },
      {
        title: 'Total Expenses',
        value: totalExpenses,
        icon: TrendingDown,
        color: 'bg-red-500',
        trend: '-5.2%',
      },
    ],
    [balance, totalIncome, totalExpenses]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, idx) => (
        <Card
          key={idx}
          className="border-0 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {stat.title}
            </CardTitle>
            <div className={`${stat.color} p-2 rounded-lg`}>
              <stat.icon className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {balanceVisible && stat.title === 'Total Balance'
                    ? formatCurrency(stat.value)
                    : !balanceVisible && stat.title === 'Total Balance'
                    ? '••••••'
                    : formatCurrency(stat.value)}
                </div>
                {stat.trend && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    {stat.trend} this month
                  </p>
                )}
              </div>
              {stat.title === 'Total Balance' && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setBalanceVisible(!balanceVisible)}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {balanceVisible ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
