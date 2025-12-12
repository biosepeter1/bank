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
    get Enable2FADto () {
        return Enable2FADto;
    },
    get TwoFactorResponseDto () {
        return TwoFactorResponseDto;
    },
    get Verify2FADto () {
        return Verify2FADto;
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
let Enable2FADto = class Enable2FADto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: '123456'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.Length)(6, 6),
    _ts_metadata("design:type", String)
], Enable2FADto.prototype, "token", void 0);
let Verify2FADto = class Verify2FADto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: '123456'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.Length)(6, 6),
    _ts_metadata("design:type", String)
], Verify2FADto.prototype, "token", void 0);
let TwoFactorResponseDto = class TwoFactorResponseDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    _ts_metadata("design:type", String)
], TwoFactorResponseDto.prototype, "secret", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    _ts_metadata("design:type", String)
], TwoFactorResponseDto.prototype, "qrCode", void 0);

//# sourceMappingURL=two-factor.dto.js.map