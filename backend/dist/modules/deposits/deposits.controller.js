"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DepositsController", {
    enumerable: true,
    get: function() {
        return DepositsController;
    }
});
const _common = require("@nestjs/common");
const _platformexpress = require("@nestjs/platform-express");
const _depositsservice = require("./deposits.service");
const _jwtauthguard = require("../../common/guards/jwt-auth.guard");
const _rolesguard = require("../../common/guards/roles.guard");
const _rolesdecorator = require("../../common/decorators/roles.decorator");
const _createdepositdto = require("./dto/create-deposit.dto");
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
let DepositsController = class DepositsController {
    /**
   * Initiate a new deposit
   */ async initiateDeposit(req, createDepositDto) {
        const userId = req.user.id;
        return this.depositsService.initiateDeposit(userId, createDepositDto);
    }
    /**
   * Confirm a Paystack deposit
   */ async confirmDeposit(req, confirmDepositDto) {
        return this.depositsService.confirmPaystackDeposit(confirmDepositDto.reference);
    }
    /**
   * Get deposit history
   */ async getDepositHistory(req) {
        const userId = req.user.id;
        return this.depositsService.getDepositHistory(userId);
    }
    /**
   * Get specific deposit details
   */ async getDepositById(req, depositId) {
        const userId = req.user.id;
        return this.depositsService.getDepositById(userId, depositId);
    }
    /**
   * Delete deposit (User can delete their own deposit history)
   */ async deleteDeposit(req, depositId) {
        const userId = req.user.id;
        return this.depositsService.deleteDeposit(userId, depositId);
    }
    /**
   * Upload deposit proof for manual deposits
   */ async uploadDepositProof(req, depositId, file) {
        if (!file) {
            throw new _common.BadRequestException('No file uploaded');
        }
        const userId = req.user.id;
        return this.depositsService.uploadDepositProof(userId, depositId, file);
    }
    /**
   * Admin: Get all deposits
   */ async getAllDeposits() {
        return this.depositsService.getAllDeposits();
    }
    /**
   * Admin: Approve deposit
   */ async approveDeposit(depositId, req) {
        const adminId = req.user.id;
        return this.depositsService.approveDeposit(depositId, adminId);
    }
    /**
   * Admin: Reject deposit
   */ async rejectDeposit(depositId, body, req) {
        const adminId = req.user.id;
        return this.depositsService.rejectDeposit(depositId, adminId, body.reason);
    }
    /**
   * Admin: Delete deposit
   */ async adminDeleteDeposit(depositId, req) {
        const adminId = req.user.id;
        return this.depositsService.adminDeleteDeposit(depositId, adminId);
    }
    constructor(depositsService){
        this.depositsService = depositsService;
    }
};
_ts_decorate([
    (0, _common.Post)('initiate'),
    (0, _common.HttpCode)(_common.HttpStatus.CREATED),
    (0, _swagger.ApiOperation)({
        summary: 'Initiate a new deposit'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0,
        typeof _createdepositdto.CreateDepositDto === "undefined" ? Object : _createdepositdto.CreateDepositDto
    ]),
    _ts_metadata("design:returntype", Promise)
], DepositsController.prototype, "initiateDeposit", null);
_ts_decorate([
    (0, _common.Post)('confirm'),
    (0, _common.HttpCode)(_common.HttpStatus.OK),
    (0, _swagger.ApiOperation)({
        summary: 'Confirm a Paystack deposit'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0,
        typeof _createdepositdto.ConfirmDepositDto === "undefined" ? Object : _createdepositdto.ConfirmDepositDto
    ]),
    _ts_metadata("design:returntype", Promise)
], DepositsController.prototype, "confirmDeposit", null);
_ts_decorate([
    (0, _common.Get)('history'),
    (0, _swagger.ApiOperation)({
        summary: 'Get user deposit history'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0
    ]),
    _ts_metadata("design:returntype", Promise)
], DepositsController.prototype, "getDepositHistory", null);
_ts_decorate([
    (0, _common.Get)(':depositId'),
    (0, _swagger.ApiOperation)({
        summary: 'Get deposit details'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Param)('depositId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], DepositsController.prototype, "getDepositById", null);
_ts_decorate([
    (0, _common.Delete)(':depositId'),
    (0, _swagger.ApiOperation)({
        summary: 'Delete deposit from history'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Param)('depositId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], DepositsController.prototype, "deleteDeposit", null);
_ts_decorate([
    (0, _common.Post)(':depositId/upload-proof'),
    (0, _common.UseInterceptors)((0, _platformexpress.FileInterceptor)('file')),
    (0, _swagger.ApiConsumes)('multipart/form-data'),
    (0, _swagger.ApiBody)({
        description: 'File to upload',
        type: 'multipart/form-data',
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary'
                }
            }
        }
    }),
    (0, _swagger.ApiOperation)({
        summary: 'Upload deposit proof'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Param)('depositId')),
    _ts_param(2, (0, _common.UploadedFile)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0,
        String,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], DepositsController.prototype, "uploadDepositProof", null);
_ts_decorate([
    (0, _common.Get)('admin/all'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('BANK_ADMIN', 'SUPER_ADMIN'),
    (0, _swagger.ApiOperation)({
        summary: 'Get all deposits (Admin only)'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], DepositsController.prototype, "getAllDeposits", null);
_ts_decorate([
    (0, _common.Patch)('admin/:depositId/approve'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('BANK_ADMIN', 'SUPER_ADMIN'),
    (0, _swagger.ApiOperation)({
        summary: 'Approve deposit (Admin only)'
    }),
    _ts_param(0, (0, _common.Param)('depositId')),
    _ts_param(1, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        void 0
    ]),
    _ts_metadata("design:returntype", Promise)
], DepositsController.prototype, "approveDeposit", null);
_ts_decorate([
    (0, _common.Patch)('admin/:depositId/reject'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('BANK_ADMIN', 'SUPER_ADMIN'),
    (0, _swagger.ApiOperation)({
        summary: 'Reject deposit (Admin only)'
    }),
    _ts_param(0, (0, _common.Param)('depositId')),
    _ts_param(1, (0, _common.Body)()),
    _ts_param(2, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object,
        void 0
    ]),
    _ts_metadata("design:returntype", Promise)
], DepositsController.prototype, "rejectDeposit", null);
_ts_decorate([
    (0, _common.Delete)('admin/:depositId'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('BANK_ADMIN', 'SUPER_ADMIN'),
    (0, _swagger.ApiOperation)({
        summary: 'Delete deposit (Admin only)'
    }),
    _ts_param(0, (0, _common.Param)('depositId')),
    _ts_param(1, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        void 0
    ]),
    _ts_metadata("design:returntype", Promise)
], DepositsController.prototype, "adminDeleteDeposit", null);
DepositsController = _ts_decorate([
    (0, _swagger.ApiTags)('Deposits'),
    (0, _swagger.ApiBearerAuth)(),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Controller)('deposits'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _depositsservice.DepositsService === "undefined" ? Object : _depositsservice.DepositsService
    ])
], DepositsController);

//# sourceMappingURL=deposits.controller.js.map