"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "KycModule", {
    enumerable: true,
    get: function() {
        return KycModule;
    }
});
const _common = require("@nestjs/common");
const _kyccontroller = require("./kyc.controller");
const _kycservice = require("./kyc.service");
const _uploadmodule = require("../../common/upload/upload.module");
const _settingsmodule = require("../settings/settings.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let KycModule = class KycModule {
};
KycModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _uploadmodule.UploadModule,
            _settingsmodule.SettingsModule
        ],
        controllers: [
            _kyccontroller.KycController
        ],
        providers: [
            _kycservice.KycService
        ],
        exports: [
            _kycservice.KycService
        ]
    })
], KycModule);

//# sourceMappingURL=kyc.module.js.map