import React, { useState, useEffect } from 'react';
import { useWalletStore } from '@/stores/walletStore';
import { useNotificationStore } from '@/stores/notificationStore';
import DashboardHeader from './DashboardHeader';
import DashboardOverview from './overview/DashboardOverview';
import Sidebar from './Sidebar';
import TransactionsPage from './pages/TransactionsPage';
import {
  TransfersPage,
  VirtualCardsPage,
  DepositsPage,
  CurrencySwapPage,
  LoansPage,
  SettingsPage,
  SupportPage,
} from './pages/PageStubs';
import { AuditPage } from './pages';

type PageType = 'overview' | 'transactions' | 'transfers' | 'cards' | 'deposits' | 'currency' | 'loans' | 'settings' | 'support' | 'audit';

const DashboardMain: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { getWalletData } = useWalletStore();
  const { getNotifications } = useNotificationStore();

  useEffect(() => {
    // Load initial data
    getWalletData();
    getNotifications();

    // Auto-refresh wallet data every 30 seconds
    const refreshInterval = setInterval(() => {
      getWalletData();
      getNotifications();
    }, 30000); // 30 seconds

    return () => clearInterval(refreshInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'overview':
        return <DashboardOverview />;
      case 'transactions':
        return <TransactionsPage />;
      case 'transfers':
        return <TransfersPage />;
      case 'cards':
        return <VirtualCardsPage />;
      case 'deposits':
        return <DepositsPage />;
      case 'currency':
        return <CurrencySwapPage />;
      case 'loans':
        return <LoansPage />;
      case 'settings':
        return <SettingsPage />;
      case 'support':
        return <SupportPage />;
      case 'audit':
        return <AuditPage />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        userRole="SUPER_ADMIN"
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8">{renderPage()}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardMain;
