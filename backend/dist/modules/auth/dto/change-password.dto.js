"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ChangePasswordDto", {
    enumerable: true,
    get: function() {
        return ChangePasswordDto;
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
let ChangePasswordDto = class ChangePasswordDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'CurrentPassword@123'
    }),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], ChangePasswordDto.prototype, "currentPassword", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'NewPassword@123'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.MinLength)(8, {
        message: 'Password must be at least 8 characters long'
    }),
    (0, _classvalidator.Matches)(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'Password must contain uppercase, lowercase, and number/special character'
    }),
    _ts_metadata("design:type", String)
], ChangePasswordDto.prototype, "newPassword", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'NewPassword@123'
    }),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], ChangePasswordDto.prototype, "confirmPassword", void 0);

//# sourceMappingURL=change-password.dto.js.map