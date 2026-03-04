import React, { useState, useEffect } from 'react';
import { useWalletStore } from '@/stores/walletStore';
import { useNotificationStore } from '@/stores/notificationStore';
import DashboardHeader from './DashboardHeader';
import DashboardOverview from './overview/DashboardOverview';
import Sidebar from './Sidebar';
import TransactionsPage from './pages/TransactionsPage';
import TransfersPage from './pages/TransfersPage';
import VirtualCardsPage from './pages/VirtualCardsPage';
import DepositsPage from './pages/DepositsPage';
import CurrencySwapPage from './pages/CurrencySwapPage';
import LoansPage from './pages/LoansPage';
import SettingsPage from './pages/SettingsPage';
import SupportPage from './pages/SupportPage';

type PageType = 'overview' | 'transactions' | 'transfers' | 'cards' | 'deposits' | 'currency' | 'loans' | 'settings' | 'support';

const Dashboard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { getWalletData } = useWalletStore();
  const { getNotifications } = useNotificationStore();

  useEffect(() => {
    // Load initial data
    getWalletData();
    getNotifications();
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

export default Dashboard;
