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
    get ApproveLoanDto () {
        return ApproveLoanDto;
    },
    get CreateGrantDto () {
        return CreateGrantDto;
    },
    get CreateLoanApplicationDto () {
        return CreateLoanApplicationDto;
    },
    get RejectLoanDto () {
        return RejectLoanDto;
    }
});
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
let CreateLoanApplicationDto = class CreateLoanApplicationDto {
};
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.Min)(1000),
    _ts_metadata("design:type", Number)
], CreateLoanApplicationDto.prototype, "amount", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateLoanApplicationDto.prototype, "currency", void 0);
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.Min)(1),
    (0, _classvalidator.Max)(60),
    _ts_metadata("design:type", Number)
], CreateLoanApplicationDto.prototype, "duration", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateLoanApplicationDto.prototype, "purpose", void 0);
let ApproveLoanDto = class ApproveLoanDto {
};
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], ApproveLoanDto.prototype, "approvalNote", void 0);
let RejectLoanDto = class RejectLoanDto {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], RejectLoanDto.prototype, "rejectionReason", void 0);
let CreateGrantDto = class CreateGrantDto {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateGrantDto.prototype, "type", void 0);
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.Min)(1000),
    _ts_metadata("design:type", Number)
], CreateGrantDto.prototype, "amount", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateGrantDto.prototype, "currency", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateGrantDto.prototype, "purpose", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateGrantDto.prototype, "description", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Array)
], CreateGrantDto.prototype, "documentUrls", void 0);

//# sourceMappingURL=create-loan-application.dto.js.map