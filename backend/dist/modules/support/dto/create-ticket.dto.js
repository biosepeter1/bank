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
    get CreateTicketDto () {
        return CreateTicketDto;
    },
    get TicketCategory () {
        return TicketCategory;
    },
    get TicketPriority () {
        return TicketPriority;
    },
    get TicketStatus () {
        return TicketStatus;
    },
    get UpdateTicketDto () {
        return UpdateTicketDto;
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
var TicketCategory = /*#__PURE__*/ function(TicketCategory) {
    TicketCategory["ACCOUNT"] = "Account";
    TicketCategory["TRANSACTIONS"] = "Transactions";
    TicketCategory["CARDS"] = "Cards";
    TicketCategory["LOANS"] = "Loans";
    TicketCategory["TECHNICAL"] = "Technical";
    TicketCategory["OTHER"] = "Other";
    return TicketCategory;
}({});
var TicketPriority = /*#__PURE__*/ function(TicketPriority) {
    TicketPriority["LOW"] = "LOW";
    TicketPriority["MEDIUM"] = "MEDIUM";
    TicketPriority["HIGH"] = "HIGH";
    TicketPriority["URGENT"] = "URGENT";
    return TicketPriority;
}({});
var TicketStatus = /*#__PURE__*/ function(TicketStatus) {
    TicketStatus["OPEN"] = "OPEN";
    TicketStatus["IN_PROGRESS"] = "IN_PROGRESS";
    TicketStatus["RESOLVED"] = "RESOLVED";
    TicketStatus["CLOSED"] = "CLOSED";
    return TicketStatus;
}({});
let CreateTicketDto = class CreateTicketDto {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateTicketDto.prototype, "subject", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateTicketDto.prototype, "message", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateTicketDto.prototype, "category", void 0);
_ts_decorate([
    (0, _classvalidator.IsEnum)(TicketPriority),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], CreateTicketDto.prototype, "priority", void 0);
let UpdateTicketDto = class UpdateTicketDto {
};
_ts_decorate([
    (0, _classvalidator.IsEnum)(TicketStatus),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UpdateTicketDto.prototype, "status", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UpdateTicketDto.prototype, "resolution", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UpdateTicketDto.prototype, "assignedTo", void 0);

//# sourceMappingURL=create-ticket.dto.js.map