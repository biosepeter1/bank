"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ExchangeRateService", {
    enumerable: true,
    get: function() {
        return ExchangeRateService;
    }
});
const _common = require("@nestjs/common");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ExchangeRateService = class ExchangeRateService {
    /**
   * Convert amount from one currency to another
   * @param amount Amount to convert
   * @param from Source currency code
   * @param to Target currency code
   * @returns Converted amount
   */ convert(amount, from, to) {
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
   */ getRate(from, to) {
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
   */ getSupportedCurrencies() {
        return [
            'USD',
            'NGN',
            'GBP',
            'EUR'
        ];
    }
    /**
   * Check if currency conversion is available
   * @param from Source currency
   * @param to Target currency
   * @returns Boolean indicating if conversion is available
   */ isConversionAvailable(from, to) {
        if (from === to) return true;
        const rateKey = `${from}_${to}`;
        return !!this.rates[rateKey];
    }
    constructor(){
        // Mock exchange rates (in production, fetch from API like exchangerate-api.com)
        this.rates = {
            // Base: USD
            'USD_NGN': 1550,
            'USD_GBP': 0.79,
            'USD_EUR': 0.92,
            // NGN conversions
            'NGN_USD': 0.00065,
            'NGN_GBP': 0.00051,
            'NGN_EUR': 0.00059,
            // GBP conversions
            'GBP_USD': 1.27,
            'GBP_NGN': 1962,
            'GBP_EUR': 1.16,
            // EUR conversions
            'EUR_USD': 1.09,
            'EUR_NGN': 1690,
            'EUR_GBP': 0.86
        };
    }
};
ExchangeRateService = _ts_decorate([
    (0, _common.Injectable)()
], ExchangeRateService);

//# sourceMappingURL=exchange-rate.service.js.map