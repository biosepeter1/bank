"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WithdrawalsController", {
    enumerable: true,
    get: function() {
        return WithdrawalsController;
    }
});
const _common = require("@nestjs/common");
const _withdrawalsservice = require("./withdrawals.service");
const _jwtauthguard = require("../../common/guards/jwt-auth.guard");
const _createwithdrawaldto = require("./dto/create-withdrawal.dto");
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
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let WithdrawalsController = class WithdrawalsController {
    /**
   * Initiate a withdrawal request
   */ async initiateWithdrawal(req, createWithdrawalDto) {
        const userId = req.user.id;
        return this.withdrawalsService.initiateWithdrawal(userId, createWithdrawalDto);
    }
    /**
   * Get withdrawal history
   */ async getWithdrawalHistory(req) {
        const userId = req.user.id;
        return this.withdrawalsService.getWithdrawalHistory(userId);
    }
    /**
   * Get specific withdrawal details
   */ async getWithdrawalById(req, withdrawalId) {
        const userId = req.user.id;
        return this.withdrawalsService.getWithdrawalById(userId, withdrawalId);
    }
    /**
   * Cancel a withdrawal request
   */ async cancelWithdrawal(req, withdrawalId) {
        const userId = req.user.id;
        return this.withdrawalsService.cancelWithdrawal(userId, withdrawalId);
    }
    /**
   * Approve withdrawal (admin only)
   */ async approveWithdrawal(data) {
        return this.withdrawalsService.approveWithdrawal(data.withdrawalId);
    }
    /**
   * Reject withdrawal (admin only)
   */ async rejectWithdrawal(data) {
        return this.withdrawalsService.rejectWithdrawal(data.withdrawalId, data.reason);
    }
    constructor(withdrawalsService){
        this.withdrawalsService = withdrawalsService;
    }
};
_ts_decorate([
    (0, _common.Post)('initiate'),
    (0, _common.HttpCode)(_common.HttpStatus.CREATED),
    (0, _swagger.ApiOperation)({
        summary: 'Initiate a withdrawal request'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0,
        typeof _createwithdrawaldto.CreateWithdrawalDto === "undefined" ? Object : _createwithdrawaldto.CreateWithdrawalDto
    ]),
    _ts_metadata("design:returntype", Promise)
], WithdrawalsController.prototype, "initiateWithdrawal", null);
_ts_decorate([
    (0, _common.Get)('history'),
    (0, _swagger.ApiOperation)({
        summary: 'Get user withdrawal history'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0
    ]),
    _ts_metadata("design:returntype", Promise)
], WithdrawalsController.prototype, "getWithdrawalHistory", null);
_ts_decorate([
    (0, _common.Get)(':withdrawalId'),
    (0, _swagger.ApiOperation)({
        summary: 'Get withdrawal details'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Param)('withdrawalId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], WithdrawalsController.prototype, "getWithdrawalById", null);
_ts_decorate([
    (0, _common.Post)(':withdrawalId/cancel'),
    (0, _common.HttpCode)(_common.HttpStatus.OK),
    (0, _swagger.ApiOperation)({
        summary: 'Cancel a pending withdrawal'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Param)('withdrawalId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], WithdrawalsController.prototype, "cancelWithdrawal", null);
_ts_decorate([
    (0, _common.Post)('admin/approve'),
    (0, _common.HttpCode)(_common.HttpStatus.OK),
    (0, _swagger.ApiOperation)({
        summary: 'Approve withdrawal (admin)'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _createwithdrawaldto.ApproveWithdrawalDto === "undefined" ? Object : _createwithdrawaldto.ApproveWithdrawalDto
    ]),
    _ts_metadata("design:returntype", Promise)
], WithdrawalsController.prototype, "approveWithdrawal", null);
_ts_decorate([
    (0, _common.Post)('admin/reject'),
    (0, _common.HttpCode)(_common.HttpStatus.OK),
    (0, _swagger.ApiOperation)({
        summary: 'Reject withdrawal (admin)'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _createwithdrawaldto.RejectWithdrawalDto === "undefined" ? Object : _createwithdrawaldto.RejectWithdrawalDto
    ]),
    _ts_metadata("design:returntype", Promise)
], WithdrawalsController.prototype, "rejectWithdrawal", null);
WithdrawalsController = _ts_decorate([
    (0, _swagger.ApiTags)('Withdrawals'),
    (0, _swagger.ApiBearerAuth)(),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Controller)('withdrawals'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _withdrawalsservice.WithdrawalsService === "undefined" ? Object : _withdrawalsservice.WithdrawalsService
    ])
], WithdrawalsController);

//# sourceMappingURL=withdrawals.controller.js.map