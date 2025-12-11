import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';
import axios from 'axios';

@Injectable()
export class CurrencyService {
  private readonly logger = new Logger(CurrencyService.name);
  private exchangeRateCache: Map<string, { rate: number; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor(private prisma: PrismaService) {}

  /**
   * Get current exchange rate between two currencies
   */
  async getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
    if (fromCurrency === toCurrency) {
      return 1;
    }

    const cacheKey = `${fromCurrency}_${toCurrency}`;
    const cached = this.exchangeRateCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.rate;
    }

    // Try to get from database first
    const dbRate = await this.prisma.currencyExchange.findFirst({
      where: {
        fromCurrency,
        toCurrency,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (dbRate && Date.now().valueOf() - new Date(dbRate.createdAt).valueOf() < this.CACHE_DURATION) {
      const rate = dbRate.exchangeRate.toNumber();
      this.exchangeRateCache.set(cacheKey, { rate, timestamp: Date.now() });
      return rate;
    }

    // Fetch from external API
    try {
      const rate = await this.fetchExchangeRateFromAPI(fromCurrency, toCurrency);
      
      // Cache the rate (not storing in DB as it requires userId and amounts)
      this.exchangeRateCache.set(cacheKey, { rate, timestamp: Date.now() });
      return rate;
    } catch (error) {
      this.logger.error(`Failed to fetch exchange rate for ${fromCurrency}/${toCurrency}`, error);
      
      // Fallback to last known rate
      if (dbRate) {
        return dbRate.exchangeRate.toNumber();
      }

      throw new BadRequestException('Unable to fetch exchange rate');
    }
  }

  /**
   * Fetch exchange rate from external API
   */
  private async fetchExchangeRateFromAPI(fromCurrency: string, toCurrency: string): Promise<number> {
    const apiKey = process.env.EXCHANGE_RATE_API_KEY;
    if (!apiKey) {
      throw new BadRequestException('Exchange rate API not configured');
    }

    try {
      // Using exchangerate-api.com as example
      const response = await axios.get(
        `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`,
        {
          params: {
            apikey: apiKey,
          },
        }
      );

      const rate = response.data.rates[toCurrency];
      if (!rate) {
        throw new BadRequestException(`Exchange rate not found for ${toCurrency}`);
      }

      return rate;
    } catch (error) {
      this.logger.error('Exchange rate API call failed', error);
      throw error;
    }
  }

  /**
   * Convert amount from one currency to another
   */
  async convertCurrency(
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ): Promise<{
    originalAmount: number;
    convertedAmount: number;
    fromCurrency: string;
    toCurrency: string;
    rate: number;
  }> {
    const rate = await this.getExchangeRate(fromCurrency, toCurrency);
    const convertedAmount = new Decimal(amount).mul(new Decimal(rate)).toNumber();

    return {
      originalAmount: amount,
      convertedAmount,
      fromCurrency,
      toCurrency,
      rate,
    };
  }

  /**
   * Get supported currencies
   */
  async getSupportedCurrencies(): Promise<string[]> {
    const currencies = await this.prisma.currencyExchange.findMany({
      select: {
        fromCurrency: true,
      },
      distinct: ['fromCurrency'],
    });

    return currencies.map((c) => c.fromCurrency);
  }

  /**
   * Get exchange rate history
   */
  async getExchangeRateHistory(
    fromCurrency: string,
    toCurrency: string,
    days = 30
  ): Promise<any[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return this.prisma.currencyExchange.findMany({
      where: {
        fromCurrency,
        toCurrency,
        createdAt: {
          gte: startDate,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  /**
   * Update exchange rate manually (for admin)
   */
  async updateExchangeRate(
    fromCurrency: string,
    toCurrency: string,
    rate: number
  ): Promise<any> {
    // Note: This method is deprecated as CurrencyExchange requires userId and amounts
    // Consider removing or updating to accept full exchange transaction details
    throw new BadRequestException('This method requires userId and transaction amounts');
  }
}
