'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { settingsApi } from '@/lib/api/settings';
import { getBankBrandingByCodeOrName, BankBranding, DEFAULT_BANK_BRANDING } from '@/lib/data/bank-branding';

type BrandingContextType = {
  branding: BankBranding;
  loading: boolean;
  refreshBranding: () => Promise<void>;
};

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export function BrandingProvider({ children }: { children: ReactNode }) {
  const [branding, setBranding] = useState<BankBranding>(DEFAULT_BANK_BRANDING);
  const [loading, setLoading] = useState(true);

  const fetchBranding = async () => {
    try {
      const settings = await settingsApi.getSettings();
      const bankCode = settings.general.bankCode;
      const bankName = settings.general.bankName || 'United Bank of Africa';
      const logoUrl = settings.general.logo; // Get logo from settings

      const newBranding = getBankBrandingByCodeOrName(bankCode, bankName);
      // Add logo from settings to branding
      newBranding.logo = logoUrl;
      setBranding(newBranding);

      // Apply CSS variables to document root
      if (typeof window !== 'undefined') {
        const root = document.documentElement;
        root.style.setProperty('--brand-primary', newBranding.colors.primary);
        root.style.setProperty('--brand-secondary', newBranding.colors.secondary);

        // Convert hex to RGB for Tailwind compatibility
        const hexToRgb = (hex: string) => {
          const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
          return result
            ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`
            : '0 65 106'; // Default blue
        };

        root.style.setProperty('--brand-primary-rgb', hexToRgb(newBranding.colors.primary));
        root.style.setProperty('--brand-secondary-rgb', hexToRgb(newBranding.colors.secondary));

        // Store in localStorage for instant load
        localStorage.setItem('bankBranding', JSON.stringify(newBranding));
      }
    } catch (error) {
      console.error('Failed to load branding:', error);
      // Use default branding on error
      setBranding(DEFAULT_BANK_BRANDING);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Try to load from cache first for instant display
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('bankBranding');
      if (cached) {
        try {
          const cachedBranding = JSON.parse(cached);
          setBranding(cachedBranding);
          // Apply cached colors immediately
          const root = document.documentElement;
          root.style.setProperty('--brand-primary', cachedBranding.colors.primary);
          root.style.setProperty('--brand-secondary', cachedBranding.colors.secondary);
        } catch (e) {
          // Ignore cache parse errors
        }
      }
    }

    // Then fetch fresh data
    fetchBranding();
  }, []);

  const refreshBranding = async () => {
    await fetchBranding();
  };

  return (
    <BrandingContext.Provider value={{ branding, loading, refreshBranding }}>
      {children}
    </BrandingContext.Provider>
  );
}

export function useBranding() {
  const context = useContext(BrandingContext);
  if (context === undefined) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
}
