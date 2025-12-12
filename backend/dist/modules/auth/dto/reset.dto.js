"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get ForgotPasswordDto () {
        return ForgotPasswordDto;
    },
    get ResetPasswordDto () {
        return ResetPasswordDto;
    }
});
const _classvalidator = require("class-validator");
const _swagger = require("@nestjs/swagger");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ForgotPasswordDto = class ForgotPasswordDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'user@example.com'
    }),
    (0, _classvalidator.IsEmail)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], ForgotPasswordDto.prototype, "email", void 0);
let ResetPasswordDto = class ResetPasswordDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'otp-id-from-email'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], ResetPasswordDto.prototype, "otpId", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: '123456',
        description: '6-digit verification code'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.Length)(6, 6, {
        message: 'Code must be exactly 6 digits'
    }),
    _ts_metadata("design:type", String)
], ResetPasswordDto.prototype, "code", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'NewPassword@123',
        description: 'New password'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.MinLength)(8, {
        message: 'Password must be at least 8 characters'
    }),
    _ts_metadata("design:type", String)
], ResetPasswordDto.prototype, "newPassword", void 0);

//# sourceMappingURL=reset.dto.js.map