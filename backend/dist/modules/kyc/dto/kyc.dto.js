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
    get GetKycRequirementsDto () {
        return GetKycRequirementsDto;
    },
    get ReviewKycDto () {
        return ReviewKycDto;
    },
    get SubmitKycDto () {
        return SubmitKycDto;
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
let SubmitKycDto = class SubmitKycDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: '1990-01-15',
        description: 'Date of birth in YYYY-MM-DD format'
    }),
    (0, _classvalidator.IsDateString)(),
    _ts_metadata("design:type", String)
], SubmitKycDto.prototype, "dateOfBirth", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: '123 Main Street'
    }),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], SubmitKycDto.prototype, "address", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'Lagos'
    }),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], SubmitKycDto.prototype, "city", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'Lagos',
        required: false
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], SubmitKycDto.prototype, "state", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'NG',
        description: 'ISO 3166-1 alpha-2 country code'
    }),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], SubmitKycDto.prototype, "country", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: '100001',
        required: false
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], SubmitKycDto.prototype, "postalCode", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'NIN',
        description: 'ID type (e.g., NIN, PASSPORT, DRIVERS_LICENSE, etc.)'
    }),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], SubmitKycDto.prototype, "idType", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: '12345678901'
    }),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], SubmitKycDto.prototype, "idNumber", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], SubmitKycDto.prototype, "idDocumentUrl", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], SubmitKycDto.prototype, "proofOfAddressUrl", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], SubmitKycDto.prototype, "selfieUrl", void 0);
let ReviewKycDto = class ReviewKycDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'APPROVED',
        enum: [
            'APPROVED',
            'REJECTED',
            'RESUBMIT_REQUIRED',
            'UNDER_REVIEW'
        ]
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsIn)([
        'APPROVED',
        'REJECTED',
        'RESUBMIT_REQUIRED',
        'UNDER_REVIEW'
    ]),
    _ts_metadata("design:type", String)
], ReviewKycDto.prototype, "status", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ReviewKycDto.prototype, "rejectionReason", void 0);
let GetKycRequirementsDto = class GetKycRequirementsDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'NG',
        description: 'ISO 3166-1 alpha-2 country code',
        required: false
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], GetKycRequirementsDto.prototype, "countryCode", void 0);

//# sourceMappingURL=kyc.dto.js.map