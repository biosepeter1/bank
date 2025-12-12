"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TransfersModule", {
    enumerable: true,
    get: function() {
        return TransfersModule;
    }
});
const _common = require("@nestjs/common");
const _transferscontroller = require("./transfers.controller");
const _transfersservice = require("./transfers.service");
const _prismamodule = require("../../prisma/prisma.module");
const _settingsmodule = require("../settings/settings.module");
const _emailservice = require("../../common/services/email.service");
const _emailverifiedguard = require("../../common/guards/email-verified.guard");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let TransfersModule = class TransfersModule {
};
TransfersModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _prismamodule.PrismaModule,
            _settingsmodule.SettingsModule
        ],
        controllers: [
            _transferscontroller.TransfersController
        ],
        providers: [
            _transfersservice.TransfersService,
            _emailservice.EmailService,
            _emailverifiedguard.EmailVerifiedGuard
        ],
        exports: [
            _transfersservice.TransfersService
        ]
    })
], TransfersModule);

//# sourceMappingURL=transfers.module.js.map