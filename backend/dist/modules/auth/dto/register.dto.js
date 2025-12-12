"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RegisterDto", {
    enumerable: true,
    get: function() {
        return RegisterDto;
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
let RegisterDto = class RegisterDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'john.doe@example.com'
    }),
    (0, _classvalidator.IsEmail)(),
    _ts_metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: '+2348012345678'
    }),
    (0, _classvalidator.IsPhoneNumber)(),
    _ts_metadata("design:type", String)
], RegisterDto.prototype, "phone", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'John'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.MinLength)(2),
    (0, _classvalidator.MaxLength)(50),
    _ts_metadata("design:type", String)
], RegisterDto.prototype, "firstName", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'Doe'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.MinLength)(2),
    (0, _classvalidator.MaxLength)(50),
    _ts_metadata("design:type", String)
], RegisterDto.prototype, "lastName", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'johndoe',
        required: false
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.MinLength)(3),
    (0, _classvalidator.MaxLength)(30),
    _ts_metadata("design:type", String)
], RegisterDto.prototype, "username", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'savings',
        required: false,
        enum: [
            'savings',
            'checking'
        ]
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], RegisterDto.prototype, "accountType", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: '1234',
        required: false
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.Length)(4, 4),
    _ts_metadata("design:type", String)
], RegisterDto.prototype, "transactionPin", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'Password@123',
        description: 'Password must contain uppercase, lowercase, number and special character'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.MinLength)(8),
    (0, _classvalidator.MaxLength)(100),
    (0, _classvalidator.Matches)(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
        message: 'Password must contain uppercase, lowercase, number and special character'
    }),
    _ts_metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'NG',
        description: 'ISO country code (NG, US, GB, etc.)'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.Length)(2, 2),
    _ts_metadata("design:type", String)
], RegisterDto.prototype, "country", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'NGN',
        description: 'Currency code (NGN, USD, GBP, etc.)'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.Length)(3, 3),
    _ts_metadata("design:type", String)
], RegisterDto.prototype, "currency", void 0);

//# sourceMappingURL=register.dto.js.map