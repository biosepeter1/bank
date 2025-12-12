"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CurrencyController", {
    enumerable: true,
    get: function() {
        return CurrencyController;
    }
});
const _common = require("@nestjs/common");
const _currencyservice = require("./currency.service");
const _swagger = require("@nestjs/swagger");
const _jwtauthguard = require("../../common/guards/jwt-auth.guard");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let CurrencyController = class CurrencyController {
    /**
   * Get exchange rate between two currencies
   */ async getExchangeRate(from, to) {
        const rate = await this.currencyService.getExchangeRate(from, to);
        return {
            from,
            to,
            rate
        };
    }
    /**
   * Convert currency amount
   */ async convertCurrency(data) {
        return this.currencyService.convertCurrency(data.amount, data.fromCurrency, data.toCurrency);
    }
    /**
   * Get supported currencies
   */ async getSupportedCurrencies() {
        const currencies = await this.currencyService.getSupportedCurrencies();
        return {
            currencies
        };
    }
    /**
   * Get exchange rate history
   */ async getExchangeRateHistory(from, to, days = 30) {
        const history = await this.currencyService.getExchangeRateHistory(from, to, days);
        return {
            from,
            to,
            days,
            history
        };
    }
    /**
   * Update exchange rate (admin only)
   */ async updateExchangeRate(data) {
        return this.currencyService.updateExchangeRate(data.fromCurrency, data.toCurrency, data.rate);
    }
    constructor(currencyService){
        this.currencyService = currencyService;
    }
};
_ts_decorate([
    (0, _common.Get)('exchange-rate/:from/:to'),
    (0, _swagger.ApiOperation)({
        summary: 'Get exchange rate between currencies'
    }),
    _ts_param(0, (0, _common.Param)('from')),
    _ts_param(1, (0, _common.Param)('to')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], CurrencyController.prototype, "getExchangeRate", null);
_ts_decorate([
    (0, _common.Post)('convert'),
    (0, _swagger.ApiOperation)({
        summary: 'Convert amount from one currency to another'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof ConvertCurrencyDto === "undefined" ? Object : ConvertCurrencyDto
    ]),
    _ts_metadata("design:returntype", Promise)
], CurrencyController.prototype, "convertCurrency", null);
_ts_decorate([
    (0, _common.Get)('supported'),
    (0, _swagger.ApiOperation)({
        summary: 'Get list of supported currencies'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], CurrencyController.prototype, "getSupportedCurrencies", null);
_ts_decorate([
    (0, _common.Get)('history/:from/:to'),
    (0, _swagger.ApiOperation)({
        summary: 'Get exchange rate history'
    }),
    _ts_param(0, (0, _common.Param)('from')),
    _ts_param(1, (0, _common.Param)('to')),
    _ts_param(2, (0, _common.Query)('days')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        Number
    ]),
    _ts_metadata("design:returntype", Promise)
], CurrencyController.prototype, "getExchangeRateHistory", null);
_ts_decorate([
    (0, _common.Post)('update-rate'),
    (0, _swagger.ApiBearerAuth)(),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.HttpCode)(_common.HttpStatus.OK),
    (0, _swagger.ApiOperation)({
        summary: 'Update exchange rate (admin)'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], CurrencyController.prototype, "updateExchangeRate", null);
CurrencyController = _ts_decorate([
    (0, _swagger.ApiTags)('Currency'),
    (0, _common.Controller)('currency'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _currencyservice.CurrencyService === "undefined" ? Object : _currencyservice.CurrencyService
    ])
], CurrencyController);

//# sourceMappingURL=currency.controller.js.map