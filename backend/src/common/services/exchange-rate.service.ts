import { Injectable } from '@nestjs/common';

interface ExchangeRates {
  [key: string]: number;
}

@Injectable()
export class ExchangeRateService {
  // Mock exchange rates (in production, fetch from API like exchangerate-api.com)
  private rates: ExchangeRates = {
    // Base: USD
    'USD_NGN': 1550, // 1 USD = 1550 NGN
    'USD_GBP': 0.79, // 1 USD = 0.79 GBP
    'USD_EUR': 0.92, // 1 USD = 0.92 EUR
    
    // NGN conversions
    'NGN_USD': 0.00065, // 1 NGN = 0.00065 USD
    'NGN_GBP': 0.00051, // 1 NGN = 0.00051 GBP
    'NGN_EUR': 0.00059, // 1 NGN = 0.00059 EUR
    
    // GBP conversions
    'GBP_USD': 1.27, // 1 GBP = 1.27 USD
    'GBP_NGN': 1962, // 1 GBP = 1962 NGN
    'GBP_EUR': 1.16, // 1 GBP = 1.16 EUR
    
    // EUR conversions
    'EUR_USD': 1.09, // 1 EUR = 1.09 USD
    'EUR_NGN': 1690, // 1 EUR = 1690 NGN
    'EUR_GBP': 0.86, // 1 EUR = 0.86 GBP
  };

  /**
   * Convert amount from one currency to another
   * @param amount Amount to convert
   * @param from Source currency code
   * @param to Target currency code
   * @returns Converted amount
   */
  convert(amount: number, from: string, to: string): number {
    // Same currency, no conversion needed
    if (from === to) {
      return amount;
    }

    const rateKey = `${from}_${to}`;
    const rate = this.rates[rateKey];

    if (!rate) {
      throw new Error(`Exchange rate not available for ${from} to ${to}`);
    }

    return Number((amount * rate).toFixed(2));
  }

  /**
   * Get exchange rate between two currencies
   * @param from Source currency code
   * @param to Target currency code
   * @returns Exchange rate
   */
  getRate(from: string, to: string): number {
    if (from === to) {
      return 1;
    }

    const rateKey = `${from}_${to}`;
    const rate = this.rates[rateKey];

    if (!rate) {
      throw new Error(`Exchange rate not available for ${from} to ${to}`);
    }

    return rate;
  }

  /**
   * Get all supported currencies
   * @returns Array of currency codes
   */
  getSupportedCurrencies(): string[] {
    return ['USD', 'NGN', 'GBP', 'EUR'];
  }

  /**
   * Check if currency conversion is available
   * @param from Source currency
   * @param to Target currency
   * @returns Boolean indicating if conversion is available
   */
  isConversionAvailable(from: string, to: string): boolean {
    if (from === to) return true;
    const rateKey = `${from}_${to}`;
    return !!this.rates[rateKey];
  }
}
