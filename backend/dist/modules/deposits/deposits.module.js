"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DepositsModule", {
    enumerable: true,
    get: function() {
        return DepositsModule;
    }
});
const _common = require("@nestjs/common");
const _depositsservice = require("./deposits.service");
const _depositscontroller = require("./deposits.controller");
const _prismaservice = require("../../prisma/prisma.service");
const _emailservice = require("../../common/services/email.service");
const _settingsmodule = require("../settings/settings.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let DepositsModule = class DepositsModule {
};
DepositsModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _settingsmodule.SettingsModule
        ],
        controllers: [
            _depositscontroller.DepositsController
        ],
        providers: [
            _depositsservice.DepositsService,
            _prismaservice.PrismaService,
            _emailservice.EmailService
        ],
        exports: [
            _depositsservice.DepositsService
        ]
    })
], DepositsModule);

//# sourceMappingURL=deposits.module.js.map