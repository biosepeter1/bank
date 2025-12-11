import React from 'react';
import { ChevronLeft, Wallet, CreditCard, Send, Zap, TrendingUp, Building2, Settings, HelpCircle, LogOut, Shield } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  currentPage: string;
  onPageChange: (page: any) => void;
  userRole?: string; // SUPER_ADMIN, BANK_ADMIN, or USER
}

const menuItems = [
  { id: 'overview', label: 'Dashboard', icon: Wallet, roles: ['USER', 'BANK_ADMIN', 'SUPER_ADMIN'] },
  { id: 'transactions', label: 'Transactions', icon: CreditCard, roles: ['USER', 'BANK_ADMIN', 'SUPER_ADMIN'] },
  { id: 'transfers', label: 'Transfers', icon: Send, roles: ['USER', 'BANK_ADMIN', 'SUPER_ADMIN'] },
  { id: 'deposits', label: 'Deposits', icon: Zap, roles: ['USER', 'BANK_ADMIN', 'SUPER_ADMIN'] },
  { id: 'cards', label: 'Cards', icon: CreditCard, roles: ['USER', 'BANK_ADMIN', 'SUPER_ADMIN'] },
  { id: 'currency', label: 'Currency Swap', icon: TrendingUp, roles: ['USER', 'BANK_ADMIN', 'SUPER_ADMIN'] },
  { id: 'loans', label: 'Loans & Grants', icon: Building2, roles: ['USER', 'BANK_ADMIN', 'SUPER_ADMIN'] },
  { id: 'audit', label: 'Audit Logs', icon: Shield, roles: ['SUPER_ADMIN'] }, // Only super admin
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, currentPage, onPageChange, userRole = 'USER' }) => {
  // Filter menu items based on user role
  const visibleMenuItems = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <>
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-blue-600 to-blue-700 dark:from-gray-800 dark:to-gray-900 text-white transition-all duration-300 flex flex-col h-screen border-r border-blue-700 dark:border-gray-700`}
      >
        {/* Logo */}
        <div className="p-4 flex items-center justify-between">
          <div className={`flex items-center gap-3 ${!isOpen && 'hidden'}`}>
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <Wallet className="w-6 h-6 text-blue-600" />
            </div>
            <span className="font-bold text-lg">FinHub</span>
          </div>
          <button
            onClick={onToggle}
            className="p-1 hover:bg-blue-500 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <ChevronLeft className={`w-5 h-5 transition-transform ${!isOpen && 'rotate-180'}`} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-white text-blue-600 font-semibold'
                    : 'text-blue-100 hover:bg-blue-500 dark:hover:bg-gray-700'
                }`}
                title={!isOpen ? item.label : ''}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isOpen && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Footer Menu */}
        <div className="border-t border-blue-500 p-4 space-y-2">
          <button
            onClick={() => onPageChange('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              currentPage === 'settings'
                ? 'bg-white text-blue-600 font-semibold'
                : 'text-blue-100 hover:bg-blue-500 dark:hover:bg-gray-700'
            }`}
            title={!isOpen ? 'Settings' : ''}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            {isOpen && <span>Settings</span>}
          </button>
          <button
            onClick={() => onPageChange('support')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              currentPage === 'support'
                ? 'bg-white text-blue-600 font-semibold'
                : 'text-blue-100 hover:bg-blue-500 dark:hover:bg-gray-700'
            }`}
            title={!isOpen ? 'Support' : ''}
          >
            <HelpCircle className="w-5 h-5 flex-shrink-0" />
            {isOpen && <span>Support</span>}
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-red-500 transition-all" title={!isOpen ? 'Logout' : ''}>
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
          onClick={onToggle}
        />
      )}
    </>
  );
};

export default Sidebar;
