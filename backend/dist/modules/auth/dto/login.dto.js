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
    get LoginDto () {
        return LoginDto;
    },
    get LoginResponseDto () {
        return LoginResponseDto;
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
let LoginDto = class LoginDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'john.doe@example.com'
    }),
    (0, _classvalidator.IsEmail)(),
    _ts_metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'Password@123'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.MinLength)(8),
    _ts_metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
let LoginResponseDto = class LoginResponseDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    _ts_metadata("design:type", String)
], LoginResponseDto.prototype, "accessToken", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    _ts_metadata("design:type", String)
], LoginResponseDto.prototype, "refreshToken", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    _ts_metadata("design:type", Object)
], LoginResponseDto.prototype, "user", void 0);

//# sourceMappingURL=login.dto.js.map