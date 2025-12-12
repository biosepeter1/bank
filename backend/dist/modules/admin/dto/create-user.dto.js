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
    get AdminUpdateTransferCodeDto () {
        return AdminUpdateTransferCodeDto;
    },
    get CreateUserDto () {
        return CreateUserDto;
    },
    get UpdateBalanceDto () {
        return UpdateBalanceDto;
    },
    get UpdateKycStatusDto () {
        return UpdateKycStatusDto;
    },
    get UpdateUserDto () {
        return UpdateUserDto;
    }
});
const _classvalidator = require("class-validator");
const _swagger = require("@nestjs/swagger");
const _client = require("@prisma/client");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CreateUserDto = class CreateUserDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'John'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateUserDto.prototype, "firstName", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'Doe'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateUserDto.prototype, "lastName", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'john.doe@example.com'
    }),
    (0, _classvalidator.IsEmail)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: '+2348012345678'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateUserDto.prototype, "phone", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'johndoe',
        required: false
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], CreateUserDto.prototype, "username", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'SecurePass123!'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.MinLength)(8),
    _ts_metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: '1234',
        required: false
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], CreateUserDto.prototype, "transactionPin", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'savings',
        required: false
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], CreateUserDto.prototype, "accountType", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 1000.00,
        required: false
    }),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Number)
], CreateUserDto.prototype, "initialBalance", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'NG',
        required: false
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], CreateUserDto.prototype, "country", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'NGN',
        required: false
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], CreateUserDto.prototype, "currency", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        enum: _client.AccountStatus,
        example: _client.AccountStatus.ACTIVE,
        required: false
    }),
    (0, _classvalidator.IsEnum)(_client.AccountStatus),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", typeof _client.AccountStatus === "undefined" ? Object : _client.AccountStatus)
], CreateUserDto.prototype, "accountStatus", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        enum: _client.KYCStatus,
        example: _client.KYCStatus.PENDING,
        required: false
    }),
    (0, _classvalidator.IsEnum)(_client.KYCStatus),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", typeof _client.KYCStatus === "undefined" ? Object : _client.KYCStatus)
], CreateUserDto.prototype, "kycStatus", void 0);
let UpdateUserDto = class UpdateUserDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UpdateUserDto.prototype, "firstName", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UpdateUserDto.prototype, "lastName", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    (0, _classvalidator.IsEmail)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UpdateUserDto.prototype, "email", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UpdateUserDto.prototype, "phone", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UpdateUserDto.prototype, "country", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UpdateUserDto.prototype, "currency", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        enum: _client.AccountStatus,
        required: false
    }),
    (0, _classvalidator.IsEnum)(_client.AccountStatus),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", typeof _client.AccountStatus === "undefined" ? Object : _client.AccountStatus)
], UpdateUserDto.prototype, "accountStatus", void 0);
let UpdateBalanceDto = class UpdateBalanceDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 1000.00
    }),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", Number)
], UpdateBalanceDto.prototype, "amount", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'Initial deposit'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], UpdateBalanceDto.prototype, "reason", void 0);
let UpdateKycStatusDto = class UpdateKycStatusDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        enum: _client.KYCStatus,
        example: _client.KYCStatus.APPROVED
    }),
    (0, _classvalidator.IsEnum)(_client.KYCStatus),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", typeof _client.KYCStatus === "undefined" ? Object : _client.KYCStatus)
], UpdateKycStatusDto.prototype, "status", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'Documents verified',
        required: false
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UpdateKycStatusDto.prototype, "reason", void 0);
let AdminUpdateTransferCodeDto = class AdminUpdateTransferCodeDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'ABC123456'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], AdminUpdateTransferCodeDto.prototype, "code", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 50.00,
        required: false
    }),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Number)
], AdminUpdateTransferCodeDto.prototype, "amount", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: true,
        required: false
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Boolean)
], AdminUpdateTransferCodeDto.prototype, "isActive", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: true,
        required: false
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Boolean)
], AdminUpdateTransferCodeDto.prototype, "isVerified", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], AdminUpdateTransferCodeDto.prototype, "description", void 0);

//# sourceMappingURL=create-user.dto.js.map