"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SettingsController", {
    enumerable: true,
    get: function() {
        return SettingsController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _settingsservice = require("./settings.service");
const _jwtauthguard = require("../../common/guards/jwt-auth.guard");
const _rolesguard = require("../../common/guards/roles.guard");
const _rolesdecorator = require("../../common/decorators/roles.decorator");
const _updatesettingsdto = require("./dto/update-settings.dto");
const _emailservice = require("../../common/services/email.service");
const _allowsuspendeddecorator = require("../../common/decorators/allow-suspended.decorator");
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
let SettingsController = class SettingsController {
    getSettings() {
        return this.settingsService.getSettings();
    }
    updateSettings(updateSettingsDto) {
        return this.settingsService.updateSettings(updateSettingsDto);
    }
    async testEmail(to) {
        const settings = await this.settingsService.getSettings();
        const dest = to || settings.general.supportEmail;
        await this.email.sendGenericNotification({
            email: dest,
            title: 'Test Email',
            message: 'If you received this, SMTP is configured correctly.'
        });
        return {
            success: true,
            to: dest
        };
    }
    constructor(settingsService, email){
        this.settingsService = settingsService;
        this.email = email;
    }
};
_ts_decorate([
    (0, _common.Get)(),
    (0, _allowsuspendeddecorator.AllowSuspended)(),
    (0, _swagger.ApiOperation)({
        summary: 'Get all system settings - Public endpoint'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], SettingsController.prototype, "getSettings", null);
_ts_decorate([
    (0, _common.Put)(),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('BANK_ADMIN', 'SUPER_ADMIN'),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Update system settings - Admin only'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _updatesettingsdto.UpdateSettingsDto === "undefined" ? Object : _updatesettingsdto.UpdateSettingsDto
    ]),
    _ts_metadata("design:returntype", void 0)
], SettingsController.prototype, "updateSettings", null);
_ts_decorate([
    (0, _common.Post)('test-email'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('BANK_ADMIN', 'SUPER_ADMIN'),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Send a test email using current SMTP settings'
    }),
    _ts_param(0, (0, _common.Body)('to')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], SettingsController.prototype, "testEmail", null);
SettingsController = _ts_decorate([
    (0, _swagger.ApiTags)('settings'),
    (0, _common.Controller)('settings'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _settingsservice.SettingsService === "undefined" ? Object : _settingsservice.SettingsService,
        typeof _emailservice.EmailService === "undefined" ? Object : _emailservice.EmailService
    ])
], SettingsController);

//# sourceMappingURL=settings.controller.js.map