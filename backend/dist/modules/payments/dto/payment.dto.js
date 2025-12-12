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
    get AddBankAccountDto () {
        return AddBankAccountDto;
    },
    get BankAccountResponseDto () {
        return BankAccountResponseDto;
    },
    get BankListResponseDto () {
        return BankListResponseDto;
    },
    get InitiateDepositDto () {
        return InitiateDepositDto;
    },
    get InitiateWithdrawalDto () {
        return InitiateWithdrawalDto;
    },
    get PaymentStatusResponseDto () {
        return PaymentStatusResponseDto;
    },
    get ResolveAccountDto () {
        return ResolveAccountDto;
    },
    get ResolveAccountResponseDto () {
        return ResolveAccountResponseDto;
    },
    get VerifyPaymentDto () {
        return VerifyPaymentDto;
    },
    get WithdrawalResponseDto () {
        return WithdrawalResponseDto;
    }
});
const _swagger = require("@nestjs/swagger");
const _classvalidator = require("class-validator");
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
let InitiateDepositDto = class InitiateDepositDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Amount to deposit in Naira',
        example: 5000,
        minimum: 100
    }),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.Min)(100, {
        message: 'Minimum deposit amount is ₦100'
    }),
    _ts_metadata("design:type", Number)
], InitiateDepositDto.prototype, "amount", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Payment method',
        enum: _client.PaymentMethod,
        example: _client.PaymentMethod.CARD
    }),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.IsEnum)(_client.PaymentMethod),
    _ts_metadata("design:type", typeof _client.PaymentMethod === "undefined" ? Object : _client.PaymentMethod)
], InitiateDepositDto.prototype, "method", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Description for the deposit',
        example: 'Wallet top-up',
        required: false
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], InitiateDepositDto.prototype, "description", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Callback URL after payment',
        example: 'https://yourapp.com/payment/callback',
        required: false
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], InitiateDepositDto.prototype, "callbackUrl", void 0);
let VerifyPaymentDto = class VerifyPaymentDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Payment reference to verify',
        example: 'RDN_1634567890123_ABC123'
    }),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], VerifyPaymentDto.prototype, "reference", void 0);
let AddBankAccountDto = class AddBankAccountDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Account holder name',
        example: 'John Doe'
    }),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], AddBankAccountDto.prototype, "accountName", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Bank account number',
        example: '0123456789'
    }),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], AddBankAccountDto.prototype, "accountNumber", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Bank name',
        example: 'Access Bank'
    }),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], AddBankAccountDto.prototype, "bankName", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Bank code',
        example: '044'
    }),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], AddBankAccountDto.prototype, "bankCode", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Set as primary account',
        example: false,
        required: false,
        default: false
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Boolean)
], AddBankAccountDto.prototype, "isPrimary", void 0);
let InitiateWithdrawalDto = class InitiateWithdrawalDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Amount to withdraw in Naira',
        example: 2000,
        minimum: 500
    }),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.Min)(500, {
        message: 'Minimum withdrawal amount is ₦500'
    }),
    _ts_metadata("design:type", Number)
], InitiateWithdrawalDto.prototype, "amount", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Bank account ID to withdraw to',
        example: 'uuid-string'
    }),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], InitiateWithdrawalDto.prototype, "bankAccountId", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Reason for withdrawal',
        example: 'Personal use',
        required: false
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], InitiateWithdrawalDto.prototype, "description", void 0);
let BankListResponseDto = class BankListResponseDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Bank name',
        example: 'Access Bank'
    }),
    _ts_metadata("design:type", String)
], BankListResponseDto.prototype, "name", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Bank code',
        example: '044'
    }),
    _ts_metadata("design:type", String)
], BankListResponseDto.prototype, "code", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Bank slug',
        example: 'access-bank'
    }),
    _ts_metadata("design:type", String)
], BankListResponseDto.prototype, "slug", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Supports transfers',
        example: true
    }),
    _ts_metadata("design:type", Boolean)
], BankListResponseDto.prototype, "supports_transfer", void 0);
let PaymentStatusResponseDto = class PaymentStatusResponseDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Payment ID'
    }),
    _ts_metadata("design:type", String)
], PaymentStatusResponseDto.prototype, "id", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Payment reference'
    }),
    _ts_metadata("design:type", String)
], PaymentStatusResponseDto.prototype, "reference", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Payment amount'
    }),
    _ts_metadata("design:type", Number)
], PaymentStatusResponseDto.prototype, "amount", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Payment status'
    }),
    _ts_metadata("design:type", String)
], PaymentStatusResponseDto.prototype, "status", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Payment provider'
    }),
    _ts_metadata("design:type", String)
], PaymentStatusResponseDto.prototype, "provider", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Payment method'
    }),
    _ts_metadata("design:type", String)
], PaymentStatusResponseDto.prototype, "method", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Authorization URL',
        required: false
    }),
    _ts_metadata("design:type", String)
], PaymentStatusResponseDto.prototype, "authorizationUrl", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Created timestamp'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], PaymentStatusResponseDto.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Updated timestamp'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], PaymentStatusResponseDto.prototype, "updatedAt", void 0);
let BankAccountResponseDto = class BankAccountResponseDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Bank account ID'
    }),
    _ts_metadata("design:type", String)
], BankAccountResponseDto.prototype, "id", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Account name'
    }),
    _ts_metadata("design:type", String)
], BankAccountResponseDto.prototype, "accountName", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Account number'
    }),
    _ts_metadata("design:type", String)
], BankAccountResponseDto.prototype, "accountNumber", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Bank name'
    }),
    _ts_metadata("design:type", String)
], BankAccountResponseDto.prototype, "bankName", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Bank code'
    }),
    _ts_metadata("design:type", String)
], BankAccountResponseDto.prototype, "bankCode", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Is verified'
    }),
    _ts_metadata("design:type", Boolean)
], BankAccountResponseDto.prototype, "isVerified", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Is primary account'
    }),
    _ts_metadata("design:type", Boolean)
], BankAccountResponseDto.prototype, "isPrimary", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Created timestamp'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], BankAccountResponseDto.prototype, "createdAt", void 0);
let WithdrawalResponseDto = class WithdrawalResponseDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Withdrawal ID'
    }),
    _ts_metadata("design:type", String)
], WithdrawalResponseDto.prototype, "id", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Withdrawal reference'
    }),
    _ts_metadata("design:type", String)
], WithdrawalResponseDto.prototype, "reference", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Withdrawal amount'
    }),
    _ts_metadata("design:type", Number)
], WithdrawalResponseDto.prototype, "amount", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Processing fee'
    }),
    _ts_metadata("design:type", Number)
], WithdrawalResponseDto.prototype, "fee", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Total amount (amount + fee)'
    }),
    _ts_metadata("design:type", Number)
], WithdrawalResponseDto.prototype, "totalAmount", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Withdrawal status'
    }),
    _ts_metadata("design:type", String)
], WithdrawalResponseDto.prototype, "status", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Bank account details',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], WithdrawalResponseDto.prototype, "bankAccount", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Requested timestamp'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], WithdrawalResponseDto.prototype, "requestedAt", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Processed timestamp',
        required: false,
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], WithdrawalResponseDto.prototype, "processedAt", void 0);
let ResolveAccountDto = class ResolveAccountDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Bank account number',
        example: '0123456789'
    }),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], ResolveAccountDto.prototype, "accountNumber", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Bank code',
        example: '044'
    }),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], ResolveAccountDto.prototype, "bankCode", void 0);
let ResolveAccountResponseDto = class ResolveAccountResponseDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Account number'
    }),
    _ts_metadata("design:type", String)
], ResolveAccountResponseDto.prototype, "accountNumber", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Account name'
    }),
    _ts_metadata("design:type", String)
], ResolveAccountResponseDto.prototype, "accountName", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Bank ID'
    }),
    _ts_metadata("design:type", Number)
], ResolveAccountResponseDto.prototype, "bankId", void 0);

//# sourceMappingURL=payment.dto.js.map