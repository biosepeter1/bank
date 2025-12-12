"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BanksController", {
    enumerable: true,
    get: function() {
        return BanksController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _jwtauthguard = require("../../common/guards/jwt-auth.guard");
const _banks = require("../../common/data/banks");
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
let BanksController = class BanksController {
    getBanks(country) {
        if (country) {
            return {
                country,
                banks: (0, _banks.getBanksByCountry)(country.toUpperCase())
            };
        }
        return {
            countries: Object.keys(_banks.BANKS_BY_COUNTRY),
            banks: _banks.BANKS_BY_COUNTRY
        };
    }
    getSupportedCountries() {
        return {
            countries: [
                {
                    code: 'NG',
                    name: 'Nigeria',
                    flag: '🇳🇬'
                },
                {
                    code: 'US',
                    name: 'United States',
                    flag: '🇺🇸'
                },
                {
                    code: 'GB',
                    name: 'United Kingdom',
                    flag: '🇬🇧'
                }
            ]
        };
    }
};
_ts_decorate([
    (0, _common.Get)(),
    (0, _swagger.ApiOperation)({
        summary: 'Get all banks by country'
    }),
    (0, _swagger.ApiQuery)({
        name: 'country',
        required: false,
        description: 'Country code (e.g., NG, US, GB)'
    }),
    _ts_param(0, (0, _common.Query)('country')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], BanksController.prototype, "getBanks", null);
_ts_decorate([
    (0, _common.Get)('countries'),
    (0, _swagger.ApiOperation)({
        summary: 'Get supported countries'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], BanksController.prototype, "getSupportedCountries", null);
BanksController = _ts_decorate([
    (0, _swagger.ApiTags)('banks'),
    (0, _common.Controller)('banks'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _swagger.ApiBearerAuth)()
], BanksController);

//# sourceMappingURL=banks.controller.js.map