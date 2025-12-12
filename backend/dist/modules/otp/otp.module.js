"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "OtpModule", {
    enumerable: true,
    get: function() {
        return OtpModule;
    }
});
const _common = require("@nestjs/common");
const _otpservice = require("./otp.service");
const _otpcontroller = require("./otp.controller");
const _prismamodule = require("../../prisma/prisma.module");
const _emailservice = require("../../common/services/email.service");
const _settingsmodule = require("../settings/settings.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let OtpModule = class OtpModule {
};
OtpModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _prismamodule.PrismaModule,
            _settingsmodule.SettingsModule
        ],
        controllers: [
            _otpcontroller.OtpController
        ],
        providers: [
            _otpservice.OtpService,
            _emailservice.EmailService
        ],
        exports: [
            _otpservice.OtpService
        ]
    })
], OtpModule);

//# sourceMappingURL=otp.module.js.map