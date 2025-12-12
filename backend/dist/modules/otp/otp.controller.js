"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "OtpController", {
    enumerable: true,
    get: function() {
        return OtpController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _otpservice = require("./otp.service");
const _jwtauthguard = require("../../common/guards/jwt-auth.guard");
const _currentuserdecorator = require("../../common/decorators/current-user.decorator");
const _classvalidator = require("class-validator");
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
let StartOtpDto = class StartOtpDto {
};
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsIn)([
        'TRANSFER',
        'LOGIN',
        'WITHDRAWAL'
    ]),
    _ts_metadata("design:type", String)
], StartOtpDto.prototype, "purpose", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsObject)(),
    _ts_metadata("design:type", typeof Record === "undefined" ? Object : Record)
], StartOtpDto.prototype, "metadata", void 0);
let VerifyOtpDto = class VerifyOtpDto {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], VerifyOtpDto.prototype, "otpId", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], VerifyOtpDto.prototype, "code", void 0);
let OtpController = class OtpController {
    async start(user, dto) {
        const result = await this.otpService.start(user.id, dto.purpose || 'TRANSFER', dto.metadata);
        return result; // { otpId, expiresIn }
    }
    async verify(user, dto) {
        return this.otpService.verify(user.id, dto.otpId, dto.code);
    }
    constructor(otpService){
        this.otpService = otpService;
    }
};
_ts_decorate([
    (0, _common.Post)('start'),
    (0, _swagger.ApiOperation)({
        summary: 'Start an OTP flow (email-based)'
    }),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        typeof StartOtpDto === "undefined" ? Object : StartOtpDto
    ]),
    _ts_metadata("design:returntype", Promise)
], OtpController.prototype, "start", null);
_ts_decorate([
    (0, _common.Post)('verify'),
    (0, _swagger.ApiOperation)({
        summary: 'Verify an OTP code'
    }),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        typeof VerifyOtpDto === "undefined" ? Object : VerifyOtpDto
    ]),
    _ts_metadata("design:returntype", Promise)
], OtpController.prototype, "verify", null);
OtpController = _ts_decorate([
    (0, _swagger.ApiTags)('otp'),
    (0, _swagger.ApiBearerAuth)(),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Controller)('otp'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _otpservice.OtpService === "undefined" ? Object : _otpservice.OtpService
    ])
], OtpController);

//# sourceMappingURL=otp.controller.js.map