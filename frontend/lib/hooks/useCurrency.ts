import { useState, useEffect } from 'react';
import { getCountryByCode } from '@/lib/config/countries';
import apiClient from '@/lib/api/client';

const CURRENCY_SYMBOLS: Record<string, { symbol: string; name: string }> = {
  NGN: { symbol: '₦', name: 'Nigerian Naira' },
  USD: { symbol: '$', name: 'US Dollar' },
  GBP: { symbol: '£', name: 'British Pound' },
  EUR: { symbol: '€', name: 'Euro' },
  KES: { symbol: 'KSh', name: 'Kenyan Shilling' },
  GHS: { symbol: '₵', name: 'Ghanaian Cedi' },
  ZAR: { symbol: 'R', name: 'South African Rand' },
};

export const useCurrency = () => {
  const [currency, setCurrency] = useState({ code: 'NGN', symbol: '₦', name: 'Nigerian Naira' });

  useEffect(() => {
    let active = true;
    const init = async () => {
      try {
        // 1) Prefer wallet currency from backend
        const me = await apiClient.get('/auth/me');
        const code = me.data?.wallet?.currency || me.data?.currency;
        if (code && CURRENCY_SYMBOLS[code] && active) {
          setCurrency({ code, symbol: CURRENCY_SYMBOLS[code].symbol, name: CURRENCY_SYMBOLS[code].name });
          return;
        }
      } catch (_) {
        // ignore and fallback
      }

      // 2) Fallback to local storage country -> currency
      if (typeof window !== 'undefined') {
        const countryCode = localStorage.getItem('userCountry') || 'NG';
        const country = getCountryByCode(countryCode);
        if (country && active) {
          setCurrency(country.currency);
          return;
        }
      }

      // 3) Final fallback: NGN
      if (active) setCurrency({ code: 'NGN', symbol: '₦', name: 'Nigerian Naira' });
    };

    init();
    return () => { active = false; };
  }, []);

  const formatAmount = (amount: number) => {
    return `${currency.symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return { currency, formatAmount };
};
