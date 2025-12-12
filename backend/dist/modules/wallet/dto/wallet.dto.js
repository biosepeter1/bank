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
    get DepositDto () {
        return DepositDto;
    },
    get TransferDto () {
        return TransferDto;
    },
    get WithdrawDto () {
        return WithdrawDto;
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
let DepositDto = class DepositDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 1000,
        description: 'Amount to deposit'
    }),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.IsPositive)(),
    _ts_metadata("design:type", Number)
], DepositDto.prototype, "amount", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'Salary deposit',
        required: false
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], DepositDto.prototype, "description", void 0);
let WithdrawDto = class WithdrawDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 500,
        description: 'Amount to withdraw'
    }),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.IsPositive)(),
    _ts_metadata("design:type", Number)
], WithdrawDto.prototype, "amount", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'Cash withdrawal',
        required: false
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], WithdrawDto.prototype, "description", void 0);
let TransferDto = class TransferDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        enum: _client.TransferType,
        example: 'INTERNAL',
        description: 'Type of transfer'
    }),
    (0, _classvalidator.IsEnum)(_client.TransferType),
    _ts_metadata("design:type", typeof _client.TransferType === "undefined" ? Object : _client.TransferType)
], TransferDto.prototype, "transferType", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'user-id-here',
        description: 'Recipient user ID (for INTERNAL)',
        required: false
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.ValidateIf)((o)=>o.transferType === 'INTERNAL'),
    _ts_metadata("design:type", String)
], TransferDto.prototype, "recipientId", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'John Doe',
        description: 'Beneficiary name (for DOMESTIC/INTERNATIONAL)',
        required: false
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.ValidateIf)((o)=>o.transferType !== 'INTERNAL'),
    _ts_metadata("design:type", String)
], TransferDto.prototype, "beneficiaryName", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: '1234567890',
        description: 'Account number (for DOMESTIC/INTERNATIONAL)',
        required: false
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.ValidateIf)((o)=>o.transferType !== 'INTERNAL'),
    _ts_metadata("design:type", String)
], TransferDto.prototype, "beneficiaryAccount", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'Access Bank',
        description: 'Bank name (for DOMESTIC/INTERNATIONAL)',
        required: false
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.ValidateIf)((o)=>o.transferType !== 'INTERNAL'),
    _ts_metadata("design:type", String)
], TransferDto.prototype, "bankName", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: '044',
        description: 'Bank code (for DOMESTIC)',
        required: false
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.ValidateIf)((o)=>o.transferType === 'DOMESTIC'),
    _ts_metadata("design:type", String)
], TransferDto.prototype, "bankCode", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'ABCDEFGH',
        description: 'SWIFT/BIC code (for INTERNATIONAL)',
        required: false
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.ValidateIf)((o)=>o.transferType === 'INTERNATIONAL'),
    _ts_metadata("design:type", String)
], TransferDto.prototype, "swiftCode", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'GB29NWBK60161331926819',
        description: 'IBAN (for INTERNATIONAL)',
        required: false
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.ValidateIf)((o)=>o.transferType === 'INTERNATIONAL'),
    _ts_metadata("design:type", String)
], TransferDto.prototype, "iban", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'NG',
        description: 'Beneficiary country code (for DOMESTIC/INTERNATIONAL)',
        required: false
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.ValidateIf)((o)=>o.transferType !== 'INTERNAL'),
    _ts_metadata("design:type", String)
], TransferDto.prototype, "country", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 250,
        description: 'Amount to transfer'
    }),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.IsPositive)(),
    _ts_metadata("design:type", Number)
], TransferDto.prototype, "amount", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'Payment for services',
        required: false
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], TransferDto.prototype, "description", void 0);

//# sourceMappingURL=wallet.dto.js.map