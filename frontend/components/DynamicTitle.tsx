'use client';

import { useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { usePathname } from 'next/navigation';

export function DynamicTitle() {
  const { settings, loading } = useSettings();
  const pathname = usePathname();

  useEffect(() => {
    // Don't update until settings are loaded
    if (loading) return;

    // Get page name from pathname
    const getPageName = () => {
      if (!pathname) return 'Home';
      // Public pages
      if (pathname === '/') return 'Home';
      if (pathname === '/about') return 'About Us';
      if (pathname === '/careers') return 'Careers';
      if (pathname === '/contact') return 'Contact Us';
      if (pathname === '/faq') return 'FAQ';
      if (pathname === '/personal-banking') return 'Personal Banking';
      if (pathname === '/business-banking') return 'Business Banking';
      if (pathname === '/loans-investments') return 'Loans & Investments';
      if (pathname === '/login') return 'Login';
      if (pathname === '/register') return 'Register';
      if (pathname === '/forgot-password') return 'Forgot Password';
      if (pathname === '/reset-password') return 'Reset Password';

      // Super Admin pages
      if (pathname === '/super-admin/dashboard') return 'Super Admin Dashboard';
      if (pathname.includes('/super-admin/users')) return 'Manage Users';
      if (pathname.includes('/super-admin/admins')) return 'Manage Admins';
      if (pathname.includes('/super-admin/audit-logs')) return 'Audit Logs';
      if (pathname.includes('/super-admin/settings')) return 'System Settings';

      // Admin pages
      if (pathname === '/admin/dashboard') return 'Admin Dashboard';
      if (pathname.includes('/admin/users')) return 'User Management';
      if (pathname.includes('/admin/transactions')) return 'Transactions';
      if (pathname.includes('/admin/card-requests')) return 'Card Requests';
      if (pathname.includes('/admin/kyc')) return 'KYC Review';
      if (pathname.includes('/admin/settings')) return 'Site Settings';
      if (pathname.includes('/admin/deposits')) return 'Deposits';
      if (pathname.includes('/admin/transfers')) return 'Transfers';
      if (pathname.includes('/admin/loans')) return 'Loans';
      if (pathname.includes('/admin/support')) return 'Support Tickets';

      // User pages
      if (pathname === '/user/dashboard') return 'Dashboard';
      if (pathname.includes('/user/cards')) return 'My Cards';
      if (pathname.includes('/user/transactions')) return 'Transactions';
      if (pathname.includes('/user/transfer')) return 'Transfer';
      if (pathname.includes('/user/deposit')) return 'Deposit';
      if (pathname.includes('/user/withdraw')) return 'Withdraw';
      if (pathname.includes('/user/settings')) return 'Settings';
      if (pathname.includes('/user/kyc')) return 'KYC Verification';
      if (pathname.includes('/user/profile')) return 'Profile';
      if (pathname.includes('/user/loans')) return 'Loans';
      if (pathname.includes('/user/support')) return 'Support';

      return 'Home';
    };

    const pageName = getPageName();
    const siteName = settings.general.siteName || 'Banking Platform';

    // Update document title: "Page Name - Bank Name"
    document.title = `${pageName} - ${siteName}`;
  }, [settings.general.siteName, pathname, loading]);

  return null; // This component doesn't render anything
}
