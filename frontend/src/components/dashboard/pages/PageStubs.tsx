import React from 'react';
import { useTransferStore } from '@/stores/transferStore';
import { useDepositStore } from '@/stores/depositStore';
import { useCurrencyStore } from '@/stores/currencyStore';
import { useInvestmentStore } from '@/stores/investmentStore';
import { useLoanStore } from '@/stores/loanStore';
import { useSettingsStore } from '@/stores/settingsStore';

// ============================================
// TRANSFERS PAGE
// ============================================
export const TransfersPage: React.FC = () => {
  const { beneficiaries, transfers } = useTransferStore();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Transfers</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Send money locally or internationally</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Transfer Form Component */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500">Transfer form component here</p>
          </div>
        </div>
        <div>
          {/* Beneficiaries List */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold mb-4">Recent Beneficiaries ({beneficiaries?.length || 0})</h3>
            <p className="text-gray-500">Beneficiary list here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// VIRTUAL CARDS PAGE
// ============================================
export const VirtualCardsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Cards</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your virtual and physical cards</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500">Card components and management here</p>
        </div>
      </div>
    </div>
  );
};

// ============================================
// DEPOSITS PAGE
// ============================================
export const DepositsPage: React.FC = () => {
  const { deposits } = useDepositStore();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Deposits</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Add funds to your wallet</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500">Deposit form and options here</p>
          </div>
        </div>
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold mb-4">Deposit History ({deposits?.length || 0})</h3>
            <p className="text-gray-500">Recent deposits here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// CURRENCY SWAP PAGE
// ============================================
export const CurrencySwapPage: React.FC = () => {
  const { exchangeRates } = useCurrencyStore();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Currency Swap</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Convert between different currencies</p>
      </div>
      <div className="max-w-2xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500">Currency swap converter component here</p>
        </div>
      </div>
    </div>
  );
};

// ============================================
// LOANS & GRANTS PAGE
// ============================================
export const LoansPage: React.FC = () => {
  const { loans } = useLoanStore();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Loans & Grants</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Apply for loans or grants</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500">Loan application form here</p>
          </div>
        </div>
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold mb-4">Your Loans ({loans?.length || 0})</h3>
            <p className="text-gray-500">Active loans list here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SETTINGS PAGE
// ============================================
export const SettingsPage: React.FC = () => {
  const { theme, language } = useSettingsStore();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account and preferences</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold mb-4">Personal Information</h3>
            <p className="text-gray-500">Personal info form here</p>
          </div>
        </div>
        {/* Quick Settings */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 space-y-4">
            <div>
              <p className="text-sm font-medium">Theme</p>
              <p className="text-gray-500 text-sm">{theme}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Language</p>
              <p className="text-gray-500 text-sm">{language}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SUPPORT PAGE
// ============================================
export const SupportPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Support & Help</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Get assistance with your account</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500">Support ticket form and chat here</p>
          </div>
        </div>
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold mb-4">FAQ</h3>
            <p className="text-gray-500">Frequently asked questions here</p>
          </div>
        </div>
      </div>
    </div>
  );
};
