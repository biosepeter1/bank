'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Wallet, CreditCard, FileText, User, LogOut, LayoutDashboard, ShieldCheck, Settings, DollarSign, HelpCircle, Send, Download, Activity, Globe, History, ArrowUpDown, KeyRound, Ticket } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useSettings } from '@/contexts/SettingsContext';
import { useBranding } from '@/contexts/BrandingContext';
import { useAdminCounts } from '@/hooks/useAdminCounts';
import { Badge } from '@/components/ui/badge';

type MenuSection = {
  title: string;
  items: Array<{ icon: any; label: string; href: string }>;
};

const getMenuSections = (role?: string, accountStatus?: string, kycStatus?: string): MenuSection[] => {
  if (role === 'SUPER_ADMIN') {
    return [
      {
        title: 'MAIN MENU',
        items: [
          { icon: LayoutDashboard, label: 'Dashboard', href: '/super-admin/dashboard' },
          { icon: User, label: 'Manage Users', href: '/super-admin/users' },
          { icon: ShieldCheck, label: 'Manage Admins', href: '/super-admin/admins' },
          { icon: FileText, label: 'Audit Logs', href: '/super-admin/audit-logs' },
        ],
      },
      {
        title: 'ACCOUNT',
        items: [
          { icon: Settings, label: 'System Settings', href: '/super-admin/settings' },
        ],
      },
    ];
  } else if (role === 'BANK_ADMIN') {
    return [
      {
        title: 'MAIN MENU',
        items: [
          { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
          { icon: User, label: 'User Management', href: '/admin/users' },
          { icon: FileText, label: 'Transactions', href: '/admin/transactions' },
        ],
      },
      {
        title: 'FINANCIAL',
        items: [
          { icon: Download, label: 'Deposits', href: '/admin/deposits' },
          { icon: ArrowUpDown, label: 'Transfers', href: '/admin/transfers' },
          { icon: DollarSign, label: 'Loans', href: '/admin/loans' },
        ],
      },
      {
        title: 'SERVICES',
        items: [
          { icon: CreditCard, label: 'Card Requests', href: '/admin/card-requests' },
          { icon: ShieldCheck, label: 'KYC Review', href: '/admin/kyc' },
          { icon: KeyRound, label: 'Transfer Code Requests', href: '/admin/transfer-codes' },
          { icon: Ticket, label: 'Support Tickets', href: '/admin/support' },
        ],
      },
      {
        title: 'ACCOUNT',
        items: [
          { icon: Settings, label: 'Site Settings', href: '/admin/settings' },
        ],
      },
    ];
  } else {
    // Default USER role
    // If account is SUSPENDED, only show KYC-related items
    if (accountStatus === 'SUSPENDED') {
      return [
        {
          title: 'ACCOUNT',
          items: [
            { icon: ShieldCheck, label: 'KYC Verification', href: '/user/kyc' },
            { icon: User, label: 'Profile', href: '/user/profile' },
            { icon: Settings, label: 'Settings', href: '/user/settings' },
          ],
        },
      ];
    }

    return [
      {
        title: 'MAIN MENU',
        items: [
          { icon: LayoutDashboard, label: 'Dashboard', href: '/user/dashboard' },
          { icon: Activity, label: 'Transactions', href: '/user/transactions' },
          { icon: CreditCard, label: 'Cards', href: '/user/cards' },
        ],
      },
      {
        title: 'TRANSFERS',
        items: [
          { icon: Send, label: 'Local Transfer', href: '/user/transfer' },
          { icon: Globe, label: 'International Wire', href: '/user/international' },
          { icon: Download, label: 'Deposit', href: '/user/deposit' },
        ],
      },
      {
        title: 'SERVICES',
        items: [
          { icon: DollarSign, label: 'Loan Request', href: '/user/loans' },
        ],
      },
      {
        title: 'ACCOUNT',
        items: [
          // Show KYC menu only if not approved
          ...(kycStatus !== 'APPROVED' ? [{ icon: ShieldCheck, label: 'KYC Verification', href: '/user/kyc' }] : []),
          { icon: Settings, label: 'Settings', href: '/user/settings' },
          { icon: HelpCircle, label: 'Support Ticket', href: '/user/support' },
        ],
      },
    ];
  }
};

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { settings } = useSettings();
  const { branding } = useBranding();

  // Only fetch admin counts for BANK_ADMIN users
  const { counts } = useAdminCounts();
  const isAdmin = user?.role === 'BANK_ADMIN';
  const adminCounts = isAdmin ? counts : {
    pendingLoans: 0,
    pendingCardRequests: 0,
    pendingKyc: 0,
    pendingTransferCodes: 0,
    openSupportTickets: 0,
  };

  let menuSections = getMenuSections(user?.role, user?.accountStatus, user?.kyc?.status);
  // Hide Local Transfer for non-Nigeria users
  if (user && user.country && user.country.toUpperCase() !== 'NG') {
    menuSections = menuSections.map(section => ({
      ...section,
      items: section.items.filter(item => item.href !== '/user/transfer')
    }));
  }

  const handleLogout = () => {
    logout();
    // Use window.location for hard redirect to clear all state
    window.location.href = '/login';
  };

  // Get first letter of site name for logo fallback
  const logoLetter = settings?.general?.siteName?.charAt(0).toUpperCase() || 'B';
  // Get short name (first two words)
  const shortName = settings?.general?.siteName?.split(' ').slice(0, 2).join(' ') || 'Bank';
  // Check if custom logo URL is set
  const hasCustomLogo = settings?.general?.logo && settings.general.logo !== '/logo.png';

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden shadow-2xl border-r border-slate-700/50 relative">
      {/* Decorative gradient overlay with brand colors */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom right, ${branding.colors.primary}08, ${branding.colors.secondary}08)`
        }}
      />
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl"
        style={{ backgroundColor: `${branding.colors.primary}1A` }}
      />
      <div
        className="absolute bottom-0 left-0 w-32 h-32 rounded-full blur-3xl"
        style={{ backgroundColor: `${branding.colors.secondary}1A` }}
      />

      {/* Logo - Enhanced */}
      <div className="p-6 flex-shrink-0 relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3 group">
          {hasCustomLogo ? (
            <img
              src={settings.general.logo}
              alt={`${settings.general.siteName} Logo`}
              className="h-11 w-11 rounded-xl object-cover bg-white shadow-lg ring-2 transition-all"
              style={{
                borderColor: `${branding.colors.primary}4D`,
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = `${branding.colors.primary}80`}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = `${branding.colors.primary}4D`}
              onError={(e) => {
                // Fallback to letter if image fails to load
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div
            className={`h-11 w-11 rounded-xl flex items-center justify-center text-xl font-bold shadow-lg ring-2 transition-all ${hasCustomLogo ? 'hidden' : ''}`}
            style={{
              background: `linear-gradient(135deg, ${branding.colors.primary}, ${branding.colors.secondary})`,
              borderColor: `${branding.colors.primary}4D`,
            }}
          >
            {logoLetter}
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">{shortName}</h1>
            <p className="text-xs text-gray-400 font-medium">Digital Banking</p>
          </div>
        </div>

        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="md:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <Separator className="bg-gradient-to-r from-transparent via-gray-700 to-transparent flex-shrink-0 relative z-10" />

      {/* User Info Card - Enhanced */}
      <div className="px-4 pb-4 flex-shrink-0 relative z-10">
        <div
          className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl p-4 border shadow-xl hover:shadow-2xl transition-all duration-300 group"
          style={{
            borderColor: 'rgba(100, 116, 139, 0.5)',
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = `${branding.colors.primary}4D`}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(100, 116, 139, 0.5)'}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="h-11 w-11 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg ring-2 group-hover:scale-105 transition-all"
              style={{
                background: `linear-gradient(135deg, ${branding.colors.primary}, ${branding.colors.secondary})`,
                borderColor: `${branding.colors.primary}4D`,
              }}
            >
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-white truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-gray-400 truncate font-mono">ID: {user?.id?.slice(0, 12)}</p>
            </div>
          </div>

          {/* KYC Status Badge - Only for regular users */}
          {user?.role === 'USER' && user?.kyc?.status ? (
            <div className={`flex items-center gap-1.5 mb-3 text-xs ${user.kyc.status === 'APPROVED' ? 'text-green-400' :
                user.kyc.status === 'PENDING' ? 'text-yellow-400' :
                  user.kyc.status === 'REJECTED' ? 'text-red-400' :
                    'text-gray-400'
              }`}>
              {user.kyc.status === 'APPROVED' ? (
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : user.kyc.status === 'PENDING' ? (
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-11a1 1 0 112 0v3.586l1.707 1.707a1 1 0 01-1.414 1.414l-2-2A1 1 0 019 11V7z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <span className="font-medium">
                {user.kyc.status === 'APPROVED' ? 'KYC Verified' :
                  user.kyc.status === 'PENDING' ? 'KYC Pending' :
                    user.kyc.status === 'REJECTED' ? 'KYC Rejected' :
                      user.kyc.status}
              </span>
            </div>
          ) : user?.role === 'USER' ? (
            <div className="flex items-center gap-1.5 mb-3 text-xs text-gray-400">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">KYC Not Submitted</span>
            </div>
          ) : null}

          {/* Action Buttons - Enhanced */}
          <div className="flex gap-2">
            <Link
              href="/user/profile"
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold text-gray-200 bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 rounded-lg hover:from-slate-600 hover:to-slate-700 hover:border-blue-500/50 hover:text-white hover:shadow-lg transition-all transform hover:scale-105"
            >
              <User className="h-3.5 w-3.5" />
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold text-white bg-gradient-to-br from-red-600 to-red-700 rounded-lg hover:from-red-500 hover:to-red-600 hover:shadow-lg hover:shadow-red-500/30 transition-all transform hover:scale-105"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <Separator className="bg-gradient-to-r from-transparent via-gray-700 to-transparent flex-shrink-0 relative z-10" />

      {/* Navigation - Scrollable Enhanced */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600/30 scrollbar-track-transparent hover:scrollbar-thumb-blue-600/50 relative z-10">
        {menuSections.map((section, sectionIndex) => (
          <div key={section.title} className={sectionIndex > 0 ? 'mt-6' : ''}>
            {/* Section Header - Enhanced */}
            <div className="px-3 mb-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <div className="h-px flex-1 bg-gradient-to-r from-gray-700 via-gray-600 to-transparent" />
                <span>{section.title}</span>
                <div className="h-px flex-1 bg-gradient-to-l from-gray-700 via-gray-600 to-transparent" />
              </h3>
            </div>

            {/* Section Items - Enhanced */}
            <div className="space-y-1.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                // Get badge count for admin menu items
                let badgeCount = 0;
                if (user?.role === 'BANK_ADMIN') {
                  if (item.href === '/admin/loans') badgeCount = adminCounts.pendingLoans;
                  else if (item.href === '/admin/card-requests') badgeCount = adminCounts.pendingCardRequests;
                  else if (item.href === '/admin/kyc') badgeCount = adminCounts.pendingKyc;
                  else if (item.href === '/admin/transfer-codes') badgeCount = adminCounts.pendingTransferCodes;
                  else if (item.href === '/admin/support') badgeCount = adminCounts.openSupportTickets;
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose} // Close menu on navigation
                    className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium relative overflow-hidden ${isActive
                        ? 'text-white shadow-lg scale-[1.02]'
                        : 'text-gray-300 hover:bg-gradient-to-r hover:from-slate-800 hover:to-slate-700 hover:text-white hover:shadow-md hover:scale-[1.02]'
                      } ${!isActive ? 'border border-transparent' : ''
                      }`}
                    style={isActive ? {
                      background: `linear-gradient(to right, ${branding.colors.primary}, ${branding.colors.secondary})`,
                      boxShadow: `0 10px 25px -5px ${branding.colors.primary}4D`,
                    } : {}}
                  >
                    {/* Shine effect on hover */}
                    {!isActive && (
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 group-hover:animate-shine" />
                      </div>
                    )}

                    <Icon className={`h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'drop-shadow-sm' : ''
                      }`} />
                    <span className="truncate flex-1">{item.label}</span>
                    {badgeCount > 0 && (
                      <Badge
                        className={`ml-auto h-5 min-w-[20px] px-1.5 text-xs font-bold shadow-lg animate-pulse ${isActive
                            ? 'bg-white'
                            : 'bg-gradient-to-r from-red-600 to-red-700 text-white ring-2 ring-red-400/30'
                          }`}
                        style={isActive ? {
                          color: branding.colors.primary,
                        } : {}}
                      >
                        {badgeCount}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-screen w-64 flex-col fixed inset-y-0 z-50">
        <SidebarContent />
      </div>
      {/* Spacer for desktop to prevent content overlap */}
      <div className="hidden md:block w-64 flex-shrink-0" />

      {/* Mobile Sidebar (Drawer) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="md:hidden fixed inset-y-0 left-0 w-72 z-50"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

