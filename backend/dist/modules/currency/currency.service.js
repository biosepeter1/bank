"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CurrencyService", {
    enumerable: true,
    get: function() {
        return CurrencyService;
    }
});
const _common = require("@nestjs/common");
const _prismaservice = require("../../prisma/prisma.service");
const _library = require("@prisma/client/runtime/library");
const _axios = /*#__PURE__*/ _interop_require_default(require("axios"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CurrencyService = class CurrencyService {
    /**
   * Get current exchange rate between two currencies
   */ async getExchangeRate(fromCurrency, toCurrency) {
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
                toCurrency
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        if (dbRate && Date.now().valueOf() - new Date(dbRate.createdAt).valueOf() < this.CACHE_DURATION) {
            const rate = dbRate.exchangeRate.toNumber();
            this.exchangeRateCache.set(cacheKey, {
                rate,
                timestamp: Date.now()
            });
            return rate;
        }
        // Fetch from external API
        try {
            const rate = await this.fetchExchangeRateFromAPI(fromCurrency, toCurrency);
            // Cache the rate (not storing in DB as it requires userId and amounts)
            this.exchangeRateCache.set(cacheKey, {
                rate,
                timestamp: Date.now()
            });
            return rate;
        } catch (error) {
            this.logger.error(`Failed to fetch exchange rate for ${fromCurrency}/${toCurrency}`, error);
            // Fallback to last known rate
            if (dbRate) {
                return dbRate.exchangeRate.toNumber();
            }
            throw new _common.BadRequestException('Unable to fetch exchange rate');
        }
    }
    /**
   * Fetch exchange rate from external API
   */ async fetchExchangeRateFromAPI(fromCurrency, toCurrency) {
        const apiKey = process.env.EXCHANGE_RATE_API_KEY;
        if (!apiKey) {
            throw new _common.BadRequestException('Exchange rate API not configured');
        }
        try {
            // Using exchangerate-api.com as example
            const response = await _axios.default.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`, {
                params: {
                    apikey: apiKey
                }
            });
            const rate = response.data.rates[toCurrency];
            if (!rate) {
                throw new _common.BadRequestException(`Exchange rate not found for ${toCurrency}`);
            }
            return rate;
        } catch (error) {
            this.logger.error('Exchange rate API call failed', error);
            throw error;
        }
    }
    /**
   * Convert amount from one currency to another
   */ async convertCurrency(amount, fromCurrency, toCurrency) {
        const rate = await this.getExchangeRate(fromCurrency, toCurrency);
        const convertedAmount = new _library.Decimal(amount).mul(new _library.Decimal(rate)).toNumber();
        return {
            originalAmount: amount,
            convertedAmount,
            fromCurrency,
            toCurrency,
            rate
        };
    }
    /**
   * Get supported currencies
   */ async getSupportedCurrencies() {
        const currencies = await this.prisma.currencyExchange.findMany({
            select: {
                fromCurrency: true
            },
            distinct: [
                'fromCurrency'
            ]
        });
        return currencies.map((c)=>c.fromCurrency);
    }
    /**
   * Get exchange rate history
   */ async getExchangeRateHistory(fromCurrency, toCurrency, days = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        return this.prisma.currencyExchange.findMany({
            where: {
                fromCurrency,
                toCurrency,
                createdAt: {
                    gte: startDate
                }
            },
            orderBy: {
                createdAt: 'asc'
            }
        });
    }
    /**
   * Update exchange rate manually (for admin)
   */ async updateExchangeRate(fromCurrency, toCurrency, rate) {
        // Note: This method is deprecated as CurrencyExchange requires userId and amounts
        // Consider removing or updating to accept full exchange transaction details
        throw new _common.BadRequestException('This method requires userId and transaction amounts');
    }
    constructor(prisma){
        this.prisma = prisma;
        this.logger = new _common.Logger(CurrencyService.name);
        this.exchangeRateCache = new Map();
        this.CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
    }
};
CurrencyService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], CurrencyService);

//# sourceMappingURL=currency.service.js.map