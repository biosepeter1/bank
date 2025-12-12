"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LoansController", {
    enumerable: true,
    get: function() {
        return LoansController;
    }
});
const _common = require("@nestjs/common");
const _jwtauthguard = require("../../common/guards/jwt-auth.guard");
const _loansservice = require("./loans.service");
const _createloanapplicationdto = require("./dto/create-loan-application.dto");
const _swagger = require("@nestjs/swagger");
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
let LoansController = class LoansController {
    /**
   * Apply for a loan
   */ async applyForLoan(req, data) {
        return this.loansService.applyForLoan(req.user.id, data);
    }
    /**
   * Get all loan applications (user)
   */ async getLoanApplications(req) {
        return this.loansService.getLoanApplications(req.user.id);
    }
    /**
   * Get a specific loan application
   */ async getLoanApplication(req, loanId) {
        return this.loansService.getLoanApplication(req.user.id, loanId);
    }
    /** User responds to proposed offer */ async respondToOffer(req, loanId, body) {
        return this.loansService.userRespondToOffer(loanId, req.user.id, body.action);
    }
    /** User: delete own application if not ACTIVE */ async deleteOwn(req, loanId) {
        return this.loansService.deleteLoanApplication(req.user.id, loanId);
    }
    /** Admin: list applications */ async adminList(status) {
        return this.loansService.adminListApplications(status);
    }
    /** Admin: propose revised offer */ async propose(req, loanId, body) {
        return this.loansService.proposeOffer(loanId, req.user.id, Number(body.amount || 0), body.note);
    }
    /** Admin: approve */ async approve(req, loanId, body) {
        return this.loansService.approveLoan(loanId, req.user.id, body);
    }
    /** Admin: reject */ async reject(req, loanId, body) {
        return this.loansService.rejectLoan(loanId, req.user.id, body);
    }
    /** Admin: request processing fee */ async requestFee(req, loanId, body) {
        return this.loansService.requestProcessingFee(loanId, req.user.id, body);
    }
    /** User: submit fee payment proof */ async submitFeeProof(req, loanId, body) {
        return this.loansService.submitFeePaymentProof(req.user.id, loanId, body.proofUrl);
    }
    /** Admin: verify payment and approve loan */ async verifyFee(req, loanId) {
        return this.loansService.verifyFeeAndApproveLoan(loanId, req.user.id);
    }
    /** Admin: disburse */ async disburse(req, loanId) {
        return this.loansService.disburseLoan(loanId, req.user.id);
    }
    /** Admin: update loan currency */ async updateCurrency(req, loanId, body) {
        return this.loansService.updateLoanCurrency(loanId, req.user.id, body.currency);
    }
    /** User: repay loan */ async repay(req, loanId, body) {
        return this.loansService.userRepayLoan(req.user.id, loanId, Number(body.amount || 0));
    }
    /** User: view loan repayment history */ async getRepayments(req, loanId) {
        return this.loansService.getRepayments(req.user.id, loanId);
    }
    /**
   * Request a grant
   */ async requestGrant(req, data) {
        return this.loansService.requestGrant(req.user.id, data);
    }
    /**
   * Get all grants
   */ async getGrants(req) {
        return this.loansService.getGrants(req.user.id);
    }
    /**
   * Get a specific grant
   */ async getGrant(req, grantId) {
        return this.loansService.getGrant(req.user.id, grantId);
    }
    constructor(loansService){
        this.loansService = loansService;
    }
};
_ts_decorate([
    (0, _common.Post)('loans/apply'),
    (0, _swagger.ApiOperation)({
        summary: 'Apply for a loan'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0,
        typeof _createloanapplicationdto.CreateLoanApplicationDto === "undefined" ? Object : _createloanapplicationdto.CreateLoanApplicationDto
    ]),
    _ts_metadata("design:returntype", Promise)
], LoansController.prototype, "applyForLoan", null);
_ts_decorate([
    (0, _common.Get)('loans/applications'),
    (0, _swagger.ApiOperation)({
        summary: 'Get all loan applications'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0
    ]),
    _ts_metadata("design:returntype", Promise)
], LoansController.prototype, "getLoanApplications", null);
_ts_decorate([
    (0, _common.Get)('loans/applications/:id'),
    (0, _swagger.ApiOperation)({
        summary: 'Get loan application details'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], LoansController.prototype, "getLoanApplication", null);
_ts_decorate([
    (0, _common.Post)('loans/applications/:id/respond'),
    (0, _swagger.ApiOperation)({
        summary: 'Respond to proposed loan offer'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_param(2, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0,
        String,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], LoansController.prototype, "respondToOffer", null);
_ts_decorate([
    (0, _common.Delete)('loans/applications/:id'),
    (0, _swagger.ApiOperation)({
        summary: 'Delete a non-active loan application'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], LoansController.prototype, "deleteOwn", null);
_ts_decorate([
    (0, _common.Get)('loans/admin/applications'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('BANK_ADMIN', 'SUPER_ADMIN'),
    (0, _swagger.ApiOperation)({
        summary: 'List loan applications (Admin only)'
    }),
    _ts_param(0, (0, _common.Query)('status')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], LoansController.prototype, "adminList", null);
_ts_decorate([
    (0, _common.Post)('loans/admin/applications/:id/propose'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('BANK_ADMIN', 'SUPER_ADMIN'),
    (0, _swagger.ApiOperation)({
        summary: 'Propose a revised offer (Admin only)'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_param(2, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0,
        String,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], LoansController.prototype, "propose", null);
_ts_decorate([
    (0, _common.Post)('loans/admin/applications/:id/approve'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('BANK_ADMIN', 'SUPER_ADMIN'),
    (0, _swagger.ApiOperation)({
        summary: 'Approve loan (Admin only)'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_param(2, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0,
        String,
        typeof _createloanapplicationdto.ApproveLoanDto === "undefined" ? Object : _createloanapplicationdto.ApproveLoanDto
    ]),
    _ts_metadata("design:returntype", Promise)
], LoansController.prototype, "approve", null);
_ts_decorate([
    (0, _common.Post)('loans/admin/applications/:id/reject'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('BANK_ADMIN', 'SUPER_ADMIN'),
    (0, _swagger.ApiOperation)({
        summary: 'Reject loan (Admin only)'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_param(2, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0,
        String,
        typeof _createloanapplicationdto.RejectLoanDto === "undefined" ? Object : _createloanapplicationdto.RejectLoanDto
    ]),
    _ts_metadata("design:returntype", Promise)
], LoansController.prototype, "reject", null);
_ts_decorate([
    (0, _common.Post)('loans/admin/applications/:id/request-fee'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('BANK_ADMIN', 'SUPER_ADMIN'),
    (0, _swagger.ApiOperation)({
        summary: 'Request processing fee from user (Admin only)'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_param(2, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0,
        String,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], LoansController.prototype, "requestFee", null);
_ts_decorate([
    (0, _common.Post)('loans/applications/:id/submit-fee-proof'),
    (0, _swagger.ApiOperation)({
        summary: 'Submit processing fee payment proof'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_param(2, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0,
        String,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], LoansController.prototype, "submitFeeProof", null);
_ts_decorate([
    (0, _common.Post)('loans/admin/applications/:id/verify-fee'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('BANK_ADMIN', 'SUPER_ADMIN'),
    (0, _swagger.ApiOperation)({
        summary: 'Verify fee payment and approve loan (Admin only)'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], LoansController.prototype, "verifyFee", null);
_ts_decorate([
    (0, _common.Post)('loans/admin/applications/:id/disburse'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('BANK_ADMIN', 'SUPER_ADMIN'),
    (0, _swagger.ApiOperation)({
        summary: 'Disburse approved loan (Admin only)'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], LoansController.prototype, "disburse", null);
_ts_decorate([
    (0, _common.Post)('loans/admin/applications/:id/update-currency'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('BANK_ADMIN', 'SUPER_ADMIN'),
    (0, _swagger.ApiOperation)({
        summary: 'Update loan currency (Admin only)'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_param(2, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0,
        String,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], LoansController.prototype, "updateCurrency", null);
_ts_decorate([
    (0, _common.Post)('loans/applications/:id/repay'),
    (0, _swagger.ApiOperation)({
        summary: 'Repay loan from wallet'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_param(2, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0,
        String,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], LoansController.prototype, "repay", null);
_ts_decorate([
    (0, _common.Get)('loans/applications/:id/repayments'),
    (0, _swagger.ApiOperation)({
        summary: 'Get loan repayment history'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], LoansController.prototype, "getRepayments", null);
_ts_decorate([
    (0, _common.Post)('grants/apply'),
    (0, _swagger.ApiOperation)({
        summary: 'Apply for a grant'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0,
        typeof _createloanapplicationdto.CreateGrantDto === "undefined" ? Object : _createloanapplicationdto.CreateGrantDto
    ]),
    _ts_metadata("design:returntype", Promise)
], LoansController.prototype, "requestGrant", null);
_ts_decorate([
    (0, _common.Get)('grants/requests'),
    (0, _swagger.ApiOperation)({
        summary: 'Get all grant requests'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0
    ]),
    _ts_metadata("design:returntype", Promise)
], LoansController.prototype, "getGrants", null);
_ts_decorate([
    (0, _common.Get)('grants/requests/:id'),
    (0, _swagger.ApiOperation)({
        summary: 'Get grant details'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], LoansController.prototype, "getGrant", null);
LoansController = _ts_decorate([
    (0, _swagger.ApiTags)('loans'),
    (0, _swagger.ApiBearerAuth)(),
    (0, _common.Controller)(),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _loansservice.LoansService === "undefined" ? Object : _loansservice.LoansService
    ])
], LoansController);

//# sourceMappingURL=loans.controller.js.map