"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AdminController", {
    enumerable: true,
    get: function() {
        return AdminController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _adminservice = require("./admin.service");
const _jwtauthguard = require("../../common/guards/jwt-auth.guard");
const _rolesguard = require("../../common/guards/roles.guard");
const _rolesdecorator = require("../../common/decorators/roles.decorator");
const _currentuserdecorator = require("../../common/decorators/current-user.decorator");
const _createuserdto = require("./dto/create-user.dto");
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
let AdminController = class AdminController {
    getDashboardStats() {
        return this.adminService.getDashboardStats();
    }
    getTransactionVolume() {
        return this.adminService.getTransactionVolume();
    }
    getTransactionTypes() {
        return this.adminService.getTransactionTypeDistribution();
    }
    getRecentActivities() {
        return this.adminService.getRecentActivities();
    }
    getSystemAlerts() {
        return this.adminService.getSystemAlerts();
    }
    getSidebarCounts() {
        return this.adminService.getSidebarCounts();
    }
    createUser(createUserDto, admin) {
        return this.adminService.createUser(createUserDto, admin.id);
    }
    updateUser(userId, updateUserDto, admin) {
        return this.adminService.updateUser(userId, updateUserDto, admin.id);
    }
    updateBalance(userId, updateBalanceDto, admin) {
        return this.adminService.updateUserBalance(userId, updateBalanceDto, admin.id);
    }
    updateKyc(userId, updateKycDto, admin) {
        return this.adminService.updateKycStatus(userId, updateKycDto, admin.id);
    }
    getTransferCodes(userId) {
        return this.adminService.getTransferCodes(userId);
    }
    updateTransferCode(userId, codeType, updateCodeDto, admin) {
        return this.adminService.updateTransferCode(userId, codeType, updateCodeDto, admin.id);
    }
    constructor(adminService){
        this.adminService = adminService;
    }
};
_ts_decorate([
    (0, _common.Get)('dashboard/stats'),
    (0, _swagger.ApiOperation)({
        summary: 'Get admin dashboard statistics'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], AdminController.prototype, "getDashboardStats", null);
_ts_decorate([
    (0, _common.Get)('dashboard/volume'),
    (0, _swagger.ApiOperation)({
        summary: 'Get transaction volume data for last 7 days'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], AdminController.prototype, "getTransactionVolume", null);
_ts_decorate([
    (0, _common.Get)('dashboard/transaction-types'),
    (0, _swagger.ApiOperation)({
        summary: 'Get transaction type distribution'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], AdminController.prototype, "getTransactionTypes", null);
_ts_decorate([
    (0, _common.Get)('dashboard/recent-activities'),
    (0, _swagger.ApiOperation)({
        summary: 'Get recent system activities'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], AdminController.prototype, "getRecentActivities", null);
_ts_decorate([
    (0, _common.Get)('dashboard/alerts'),
    (0, _swagger.ApiOperation)({
        summary: 'Get system alerts'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], AdminController.prototype, "getSystemAlerts", null);
_ts_decorate([
    (0, _common.Get)('sidebar-counts'),
    (0, _swagger.ApiOperation)({
        summary: 'Get pending counts for sidebar notifications'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], AdminController.prototype, "getSidebarCounts", null);
_ts_decorate([
    (0, _common.Post)('users/create'),
    (0, _swagger.ApiOperation)({
        summary: 'Create a new user account'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _currentuserdecorator.CurrentUser)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _createuserdto.CreateUserDto === "undefined" ? Object : _createuserdto.CreateUserDto,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], AdminController.prototype, "createUser", null);
_ts_decorate([
    (0, _common.Patch)('users/:id'),
    (0, _swagger.ApiOperation)({
        summary: 'Update user details'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_param(2, (0, _currentuserdecorator.CurrentUser)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _createuserdto.UpdateUserDto === "undefined" ? Object : _createuserdto.UpdateUserDto,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], AdminController.prototype, "updateUser", null);
_ts_decorate([
    (0, _common.Patch)('users/:id/balance'),
    (0, _swagger.ApiOperation)({
        summary: 'Update user balance'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_param(2, (0, _currentuserdecorator.CurrentUser)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _createuserdto.UpdateBalanceDto === "undefined" ? Object : _createuserdto.UpdateBalanceDto,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], AdminController.prototype, "updateBalance", null);
_ts_decorate([
    (0, _common.Patch)('users/:id/kyc'),
    (0, _swagger.ApiOperation)({
        summary: 'Update KYC status'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_param(2, (0, _currentuserdecorator.CurrentUser)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _createuserdto.UpdateKycStatusDto === "undefined" ? Object : _createuserdto.UpdateKycStatusDto,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], AdminController.prototype, "updateKyc", null);
_ts_decorate([
    (0, _common.Get)('users/:id/transfer-codes'),
    (0, _swagger.ApiOperation)({
        summary: 'Get user transfer codes'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], AdminController.prototype, "getTransferCodes", null);
_ts_decorate([
    (0, _common.Patch)('users/:id/transfer-codes/:type'),
    (0, _swagger.ApiOperation)({
        summary: 'Update transfer code (COT, IMF, TAX)'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Param)('type')),
    _ts_param(2, (0, _common.Body)()),
    _ts_param(3, (0, _currentuserdecorator.CurrentUser)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        typeof _createuserdto.AdminUpdateTransferCodeDto === "undefined" ? Object : _createuserdto.AdminUpdateTransferCodeDto,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], AdminController.prototype, "updateTransferCode", null);
AdminController = _ts_decorate([
    (0, _swagger.ApiTags)('admin'),
    (0, _common.Controller)('admin'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('BANK_ADMIN', 'SUPER_ADMIN'),
    (0, _swagger.ApiBearerAuth)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _adminservice.AdminService === "undefined" ? Object : _adminservice.AdminService
    ])
], AdminController);

//# sourceMappingURL=admin.controller.js.map