'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { BrandingProvider } from '@/contexts/BrandingContext';
import { DynamicTitle } from '@/components/DynamicTitle';
import { DynamicFavicon } from '@/components/DynamicFavicon';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, fetchProfile } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        router.push('/login');
        return;
      }

      try {
        await fetchProfile();
      } catch (error: any) {
        console.error('Failed to load profile:', error?.message);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Redirect SUSPENDED users to KYC page only
  useEffect(() => {
    if (user && user.accountStatus === 'SUSPENDED' && pathname) {
      const allowedPaths = ['/user/kyc', '/user/profile', '/user/settings'];
      const isAllowedPath = allowedPaths.some(path => pathname.startsWith(path));

      if (!isAllowedPath) {
        router.push('/user/kyc');
      }
    }
  }, [user, pathname, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <SettingsProvider>
      <BrandingProvider>
        <DynamicTitle />
        <DynamicFavicon />
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <Sidebar
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          />

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Topbar */}
            <Topbar onMenuClick={() => setIsMobileMenuOpen(true)} />

            {/* Page Content */}
            <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
              {/* Account Status Warning */}
              {user?.accountStatus === 'SUSPENDED' && pathname?.startsWith('/user/kyc') && (
                <Alert className="mb-6 border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertTitle className="text-red-800">Account Suspended</AlertTitle>
                  <AlertDescription className="text-red-700">
                    Your account has been suspended due to KYC rejection. Please resubmit your KYC documents below to regain full access to your account.
                  </AlertDescription>
                </Alert>
              )}

              {user?.accountStatus === 'PENDING' && (
                <Alert className="mb-6 border-yellow-200 bg-yellow-50">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertTitle className="text-yellow-800">Account Pending Verification</AlertTitle>
                  <AlertDescription className="text-yellow-700">
                    Your account is pending KYC verification. Some features may be limited until your KYC is approved.
                  </AlertDescription>
                </Alert>
              )}

              {children}
            </main>
          </div>
        </div>
      </BrandingProvider>
    </SettingsProvider>
  );
}


