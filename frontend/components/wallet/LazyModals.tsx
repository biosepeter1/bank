'use client';

import dynamic from 'next/dynamic';

// Lazy load wallet modals - they're heavy and only needed when user clicks
export const LazyDepositModal = dynamic(
    () => import('@/components/wallet/DepositModal'),
    { ssr: false, loading: () => null }
);

export const LazyWithdrawModal = dynamic(
    () => import('@/components/wallet/WithdrawModal'),
    { ssr: false, loading: () => null }
);

export const LazyTransferModal = dynamic(
    () => import('@/components/wallet/TransferModal'),
    { ssr: false, loading: () => null }
);
