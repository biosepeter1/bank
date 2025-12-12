"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WalletModule", {
    enumerable: true,
    get: function() {
        return WalletModule;
    }
});
const _common = require("@nestjs/common");
const _walletcontroller = require("./wallet.controller");
const _bankscontroller = require("./banks.controller");
const _walletservice = require("./wallet.service");
const _exchangerateservice = require("../../common/services/exchange-rate.service");
const _transferlimitsservice = require("../../common/services/transfer-limits.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let WalletModule = class WalletModule {
};
WalletModule = _ts_decorate([
    (0, _common.Module)({
        controllers: [
            _walletcontroller.WalletController,
            _bankscontroller.BanksController
        ],
        providers: [
            _walletservice.WalletService,
            _exchangerateservice.ExchangeRateService,
            _transferlimitsservice.TransferLimitsService
        ],
        exports: [
            _walletservice.WalletService
        ]
    })
], WalletModule);

//# sourceMappingURL=wallet.module.js.map