"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuditController", {
    enumerable: true,
    get: function() {
        return AuditController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _auditservice = require("./audit.service");
const _jwtauthguard = require("../../common/guards/jwt-auth.guard");
const _rolesguard = require("../../common/guards/roles.guard");
const _rolesdecorator = require("../../common/decorators/roles.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let AuditController = class AuditController {
    getAllLogs(action, entity, actorRole, limit) {
        return this.auditService.getAllLogs({
            action,
            entity,
            actorRole,
            limit: limit ? parseInt(limit) : 100
        });
    }
    getStats() {
        return this.auditService.getStats();
    }
    deleteLog(logId) {
        return this.auditService.deleteAuditLog(logId);
    }
    deleteLogs(logIds) {
        return this.auditService.deleteAuditLogs(logIds);
    }
    constructor(auditService){
        this.auditService = auditService;
    }
};
_ts_decorate([
    (0, _common.Get)('logs'),
    (0, _rolesdecorator.Roles)('SUPER_ADMIN'),
    (0, _swagger.ApiOperation)({
        summary: 'Get all audit logs (Super Admin only)'
    }),
    _ts_param(0, (0, _common.Query)('action')),
    _ts_param(1, (0, _common.Query)('entity')),
    _ts_param(2, (0, _common.Query)('actorRole')),
    _ts_param(3, (0, _common.Query)('limit')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        String,
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], AuditController.prototype, "getAllLogs", null);
_ts_decorate([
    (0, _common.Get)('stats'),
    (0, _rolesdecorator.Roles)('SUPER_ADMIN'),
    (0, _swagger.ApiOperation)({
        summary: 'Get audit log statistics (Super Admin only)'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], AuditController.prototype, "getStats", null);
_ts_decorate([
    (0, _common.Delete)('logs/:id'),
    (0, _rolesdecorator.Roles)('SUPER_ADMIN'),
    (0, _swagger.ApiOperation)({
        summary: 'Delete audit log by ID (Super Admin only)'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], AuditController.prototype, "deleteLog", null);
_ts_decorate([
    (0, _common.Delete)('logs'),
    (0, _rolesdecorator.Roles)('SUPER_ADMIN'),
    (0, _swagger.ApiOperation)({
        summary: 'Delete multiple audit logs (Super Admin only)'
    }),
    _ts_param(0, (0, _common.Body)('ids')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Array
    ]),
    _ts_metadata("design:returntype", void 0)
], AuditController.prototype, "deleteLogs", null);
AuditController = _ts_decorate([
    (0, _swagger.ApiTags)('audit'),
    (0, _common.Controller)('audit'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _swagger.ApiBearerAuth)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _auditservice.AuditService === "undefined" ? Object : _auditservice.AuditService
    ])
], AuditController);

//# sourceMappingURL=audit.controller.js.map