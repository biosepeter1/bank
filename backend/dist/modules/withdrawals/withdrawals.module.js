"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WithdrawalsModule", {
    enumerable: true,
    get: function() {
        return WithdrawalsModule;
    }
});
const _common = require("@nestjs/common");
const _withdrawalsservice = require("./withdrawals.service");
const _withdrawalscontroller = require("./withdrawals.controller");
const _prismaservice = require("../../prisma/prisma.service");
const _emailservice = require("../../common/services/email.service");
const _settingsmodule = require("../settings/settings.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let WithdrawalsModule = class WithdrawalsModule {
};
WithdrawalsModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _settingsmodule.SettingsModule
        ],
        controllers: [
            _withdrawalscontroller.WithdrawalsController
        ],
        providers: [
            _withdrawalsservice.WithdrawalsService,
            _prismaservice.PrismaService,
            _emailservice.EmailService
        ],
        exports: [
            _withdrawalsservice.WithdrawalsService
        ]
    })
], WithdrawalsModule);

//# sourceMappingURL=withdrawals.module.js.map