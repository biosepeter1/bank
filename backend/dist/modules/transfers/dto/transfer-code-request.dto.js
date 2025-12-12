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
    get RequestTransferCodeDto () {
        return RequestTransferCodeDto;
    },
    get VerifyTransferCodeDto () {
        return VerifyTransferCodeDto;
    }
});
const _swagger = require("@nestjs/swagger");
const _classvalidator = require("class-validator");
const _transfercodedto = require("../../admin/dto/transfer-code.dto");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let RequestTransferCodeDto = class RequestTransferCodeDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        enum: _transfercodedto.TransferCodeTypeEnum
    }),
    (0, _classvalidator.IsEnum)(_transfercodedto.TransferCodeTypeEnum),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", typeof _transfercodedto.TransferCodeTypeEnum === "undefined" ? Object : _transfercodedto.TransferCodeTypeEnum)
], RequestTransferCodeDto.prototype, "type", void 0);
let VerifyTransferCodeDto = class VerifyTransferCodeDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        enum: _transfercodedto.TransferCodeTypeEnum
    }),
    (0, _classvalidator.IsEnum)(_transfercodedto.TransferCodeTypeEnum),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", typeof _transfercodedto.TransferCodeTypeEnum === "undefined" ? Object : _transfercodedto.TransferCodeTypeEnum)
], VerifyTransferCodeDto.prototype, "type", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], VerifyTransferCodeDto.prototype, "code", void 0);

//# sourceMappingURL=transfer-code-request.dto.js.map