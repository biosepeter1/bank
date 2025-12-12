"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LoansModule", {
    enumerable: true,
    get: function() {
        return LoansModule;
    }
});
const _common = require("@nestjs/common");
const _loanscontroller = require("./loans.controller");
const _loansservice = require("./loans.service");
const _prismamodule = require("../../prisma/prisma.module");
const _emailservice = require("../../common/services/email.service");
const _settingsmodule = require("../settings/settings.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let LoansModule = class LoansModule {
};
LoansModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _prismamodule.PrismaModule,
            _settingsmodule.SettingsModule
        ],
        controllers: [
            _loanscontroller.LoansController
        ],
        providers: [
            _loansservice.LoansService,
            _emailservice.EmailService
        ],
        exports: [
            _loansservice.LoansService
        ]
    })
], LoansModule);

//# sourceMappingURL=loans.module.js.map