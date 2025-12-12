"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TransfersController", {
    enumerable: true,
    get: function() {
        return TransfersController;
    }
});
const _common = require("@nestjs/common");
const _jwtauthguard = require("../../common/guards/jwt-auth.guard");
const _rolesguard = require("../../common/guards/roles.guard");
const _emailverifiedguard = require("../../common/guards/email-verified.guard");
const _rolesdecorator = require("../../common/decorators/roles.decorator");
const _emailverifieddecorator = require("../../common/decorators/email-verified.decorator");
const _transfersservice = require("./transfers.service");
const _createtransferdto = require("./dto/create-transfer.dto");
const _transfercoderequestdto = require("./dto/transfer-code-request.dto");
const _transfercodestatusdto = require("./dto/transfer-code-status.dto");
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
let TransfersController = class TransfersController {
    /**
   * Initiate a local transfer between platform users
   */ async initiateLocalTransfer(req, createTransferDto) {
        return this.transfersService.initiateLocalTransfer(req.user.id, createTransferDto);
    }
    /**
   * Request a local transfer (Pending; admin approval required)
   */ async requestLocalTransfer(req, createTransferDto) {
        return this.transfersService.requestLocalTransfer(req.user.id, createTransferDto);
    }
    /**
   * Initiate an international transfer
   */ async initiateInternationalTransfer(req, data) {
        return this.transfersService.initiateInternationalTransfer(req.user.id, data);
    }
    /**
   * Get all beneficiaries for the current user
   */ async getBeneficiaries(req) {
        return this.transfersService.getBeneficiaries(req.user.id);
    }
    /**
   * Create a new beneficiary
   */ async createBeneficiary(req, data) {
        return this.transfersService.createBeneficiary(req.user.id, data);
    }
    /**
   * Update a beneficiary
   */ async updateBeneficiary(req, beneficiaryId, data) {
        return this.transfersService.updateBeneficiary(req.user.id, beneficiaryId, data);
    }
    /**
   * Delete a beneficiary
   */ async deleteBeneficiary(req, beneficiaryId) {
        return this.transfersService.deleteBeneficiary(req.user.id, beneficiaryId);
    }
    /**
   * Set a beneficiary as default
   */ async setDefaultBeneficiary(req, beneficiaryId) {
        return this.transfersService.setDefaultBeneficiary(req.user.id, beneficiaryId);
    }
    /**
   * Validate transfer codes
   */ async validateCodes(req, { codes }) {
        const valid = await this.transfersService.validateTransferCodes(req.user.id, codes);
        return {
            valid
        };
    }
    // Stepwise transfer codes flow
    async requestCode(req, body) {
        return this.transfersService.requestTransferCode(req.user.id, body.type);
    }
    async verifyCode(req, body) {
        return this.transfersService.verifyUserTransferCode(req.user.id, body.type, body.code);
    }
    async getCodesStatus(req) {
        return this.transfersService.getUserTransferCodeStatus(req.user.id);
    }
    /**
   * Get transfer history
   */ async getTransferHistory(req, limit = '10', skip = '0') {
        return this.transfersService.getTransferHistory(req.user.id, parseInt(limit), parseInt(skip));
    }
    /**
   * Delete transfer (User can delete their own transfer history)
   */ async deleteTransfer(req, transferId) {
        return this.transfersService.deleteTransfer(req.user.id, transferId);
    }
    /**
   * Admin: Get all transfers
   */ async getAllTransfers() {
        return this.transfersService.getAllTransfers();
    }
    /**
   * Admin: Approve transfer
   */ async approveTransfer(transferId, req) {
        const adminId = req.user.id;
        return this.transfersService.approveTransfer(transferId, adminId);
    }
    /**
   * Admin: Reject transfer
   */ async rejectTransfer(transferId, body, req) {
        const adminId = req.user.id;
        return this.transfersService.rejectTransfer(transferId, adminId, body.reason);
    }
    /**
   * Admin: Delete transfer
   */ async adminDeleteTransfer(transferId, req) {
        const adminId = req.user.id;
        return this.transfersService.adminDeleteTransfer(transferId, adminId);
    }
    // Admin: Approve & issue transfer codes
    async adminApproveCode(userId, type, req) {
        return this.transfersService.adminApproveAndIssueTransferCode(userId, type, req.user.id);
    }
    async adminListCodeRequests() {
        return this.transfersService.getPendingTransferCodeRequests();
    }
    async adminGetUserCodes(userId) {
        return this.transfersService.adminGetUserCodes(userId);
    }
    async adminSetUserForce(userId, body) {
        return this.transfersService.adminSetUserCodesForce(userId, !!body.forced);
    }
    constructor(transfersService){
        this.transfersService = transfersService;
    }
};
_ts_decorate([
    (0, _common.Post)('local'),
    (0, _emailverifieddecorator.RequireEmailVerified)(),
    (0, _swagger.ApiOperation)({
        summary: 'Send money to another user'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0,
        typeof _createtransferdto.CreateTransferDto === "undefined" ? Object : _createtransferdto.CreateTransferDto
    ]),
    _ts_metadata("design:returntype", Promise)
], TransfersController.prototype, "initiateLocalTransfer", null);
_ts_decorate([
    (0, _common.Post)('request/local'),
    (0, _emailverifieddecorator.RequireEmailVerified)(),
    (0, _swagger.ApiOperation)({
        summary: 'Request a local transfer (pending until admin approves)'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0,
        typeof _createtransferdto.CreateTransferDto === "undefined" ? Object : _createtransferdto.CreateTransferDto
    ]),
    _ts_metadata("design:returntype", Promise)
], TransfersController.prototype, "requestLocalTransfer", null);
_ts_decorate([
    (0, _common.Post)('international'),
    (0, _emailverifieddecorator.RequireEmailVerified)(),
    (0, _swagger.ApiOperation)({
        summary: 'Send money internationally'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0,
        typeof _createtransferdto.CreateInternationalTransferDto === "undefined" ? Object : _createtransferdto.CreateInternationalTransferDto
    ]),
    _ts_metadata("design:returntype", Promise)
], TransfersController.prototype, "initiateInternationalTransfer", null);
_ts_decorate([
    (0, _common.Get)('beneficiaries'),
    (0, _swagger.ApiOperation)({
        summary: 'Get all saved beneficiaries'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0
    ]),
    _ts_metadata("design:returntype", Promise)
], TransfersController.prototype, "getBeneficiaries", null);
_ts_decorate([
    (0, _common.Post)('beneficiaries'),
    (0, _swagger.ApiOperation)({
        summary: 'Add a new beneficiary'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0,
        typeof _createtransferdto.CreateBeneficiaryDto === "undefined" ? Object : _createtransferdto.CreateBeneficiaryDto
    ]),
    _ts_metadata("design:returntype", Promise)
], TransfersController.prototype, "createBeneficiary", null);
_ts_decorate([
    (0, _common.Patch)('beneficiaries/:id'),
    (0, _swagger.ApiOperation)({
        summary: 'Update beneficiary details'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_param(2, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0,
        String,
        typeof Partial === "undefined" ? Object : Partial
    ]),
    _ts_metadata("design:returntype", Promise)
], TransfersController.prototype, "updateBeneficiary", null);
_ts_decorate([
    (0, _common.Delete)('beneficiaries/:id'),
    (0, _swagger.ApiOperation)({
        summary: 'Remove a beneficiary'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], TransfersController.prototype, "deleteBeneficiary", null);
_ts_decorate([
    (0, _common.Patch)('beneficiaries/:id/set-default'),
    (0, _swagger.ApiOperation)({
        summary: 'Set beneficiary as default'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], TransfersController.prototype, "setDefaultBeneficiary", null);
_ts_decorate([
    (0, _common.Post)('validate-codes'),
    (0, _swagger.ApiOperation)({
        summary: 'Validate transfer codes (COT, IMF, TAX)'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], TransfersController.prototype, "validateCodes", null);
_ts_decorate([
    (0, _common.Post)('codes/request'),
    (0, _swagger.ApiOperation)({
        summary: 'Request a transfer code (COT/IMF/TAX)'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0,
        typeof _transfercoderequestdto.RequestTransferCodeDto === "undefined" ? Object : _transfercoderequestdto.RequestTransferCodeDto
    ]),
    _ts_metadata("design:returntype", Promise)
], TransfersController.prototype, "requestCode", null);
_ts_decorate([
    (0, _common.Post)('codes/verify'),
    (0, _swagger.ApiOperation)({
        summary: 'Verify a transfer code (COT/IMF/TAX)'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0,
        typeof _transfercoderequestdto.VerifyTransferCodeDto === "undefined" ? Object : _transfercoderequestdto.VerifyTransferCodeDto
    ]),
    _ts_metadata("design:returntype", Promise)
], TransfersController.prototype, "verifyCode", null);
_ts_decorate([
    (0, _common.Get)('codes/status'),
    (0, _swagger.ApiOperation)({
        summary: 'Get codes required flag and per-type status'
    }),
    (0, _swagger.ApiResponse)({
        type: _transfercodestatusdto.TransferCodeStatusResponseDto
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0
    ]),
    _ts_metadata("design:returntype", Promise)
], TransfersController.prototype, "getCodesStatus", null);
_ts_decorate([
    (0, _common.Get)('history'),
    (0, _swagger.ApiOperation)({
        summary: 'Get user transfer history'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Query)('limit')),
    _ts_param(2, (0, _common.Query)('skip')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], TransfersController.prototype, "getTransferHistory", null);
_ts_decorate([
    (0, _common.Delete)(':transferId'),
    (0, _swagger.ApiOperation)({
        summary: 'Delete transfer from history'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Param)('transferId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], TransfersController.prototype, "deleteTransfer", null);
_ts_decorate([
    (0, _common.Get)('admin/all'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('BANK_ADMIN', 'SUPER_ADMIN'),
    (0, _swagger.ApiOperation)({
        summary: 'Get all transfers (Admin only)'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], TransfersController.prototype, "getAllTransfers", null);
_ts_decorate([
    (0, _common.Patch)('admin/:transferId/approve'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('BANK_ADMIN', 'SUPER_ADMIN'),
    (0, _swagger.ApiOperation)({
        summary: 'Approve transfer (Admin only)'
    }),
    _ts_param(0, (0, _common.Param)('transferId')),
    _ts_param(1, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        void 0
    ]),
    _ts_metadata("design:returntype", Promise)
], TransfersController.prototype, "approveTransfer", null);
_ts_decorate([
    (0, _common.Patch)('admin/:transferId/reject'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('BANK_ADMIN', 'SUPER_ADMIN'),
    (0, _swagger.ApiOperation)({
        summary: 'Reject transfer (Admin only)'
    }),
    _ts_param(0, (0, _common.Param)('transferId')),
    _ts_param(1, (0, _common.Body)()),
    _ts_param(2, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object,
        void 0
    ]),
    _ts_metadata("design:returntype", Promise)
], TransfersController.prototype, "rejectTransfer", null);
_ts_decorate([
    (0, _common.Delete)('admin/:transferId'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('BANK_ADMIN', 'SUPER_ADMIN'),
    (0, _swagger.ApiOperation)({
        summary: 'Delete transfer (Admin only)'
    }),
    _ts_param(0, (0, _common.Param)('transferId')),
    _ts_param(1, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        void 0
    ]),
    _ts_metadata("design:returntype", Promise)
], TransfersController.prototype, "adminDeleteTransfer", null);
_ts_decorate([
    (0, _common.Patch)('codes/admin/:userId/:type/approve'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('BANK_ADMIN', 'SUPER_ADMIN'),
    (0, _swagger.ApiOperation)({
        summary: 'Approve and issue a transfer code to user (Admin only)'
    }),
    _ts_param(0, (0, _common.Param)('userId')),
    _ts_param(1, (0, _common.Param)('type')),
    _ts_param(2, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        void 0
    ]),
    _ts_metadata("design:returntype", Promise)
], TransfersController.prototype, "adminApproveCode", null);
_ts_decorate([
    (0, _common.Get)('codes/admin/requests'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('BANK_ADMIN', 'SUPER_ADMIN'),
    (0, _swagger.ApiOperation)({
        summary: 'List pending transfer code requests (Admin only)'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], TransfersController.prototype, "adminListCodeRequests", null);
_ts_decorate([
    (0, _common.Get)('codes/admin/:userId'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('BANK_ADMIN', 'SUPER_ADMIN'),
    (0, _swagger.ApiOperation)({
        summary: 'Get a user\'s transfer codes and force flag (Admin only)'
    }),
    _ts_param(0, (0, _common.Param)('userId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], TransfersController.prototype, "adminGetUserCodes", null);
_ts_decorate([
    (0, _common.Patch)('codes/admin/:userId/force'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('BANK_ADMIN', 'SUPER_ADMIN'),
    (0, _swagger.ApiOperation)({
        summary: 'Set per-user force verification flag (Admin only)'
    }),
    _ts_param(0, (0, _common.Param)('userId')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], TransfersController.prototype, "adminSetUserForce", null);
TransfersController = _ts_decorate([
    (0, _swagger.ApiTags)('transfers'),
    (0, _swagger.ApiBearerAuth)(),
    (0, _common.Controller)('transfers'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _emailverifiedguard.EmailVerifiedGuard),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _transfersservice.TransfersService === "undefined" ? Object : _transfersservice.TransfersService
    ])
], TransfersController);

//# sourceMappingURL=transfers.controller.js.map