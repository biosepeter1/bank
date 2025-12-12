"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WalletController", {
    enumerable: true,
    get: function() {
        return WalletController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _walletservice = require("./wallet.service");
const _walletdto = require("./dto/wallet.dto");
const _jwtauthguard = require("../../common/guards/jwt-auth.guard");
const _rolesguard = require("../../common/guards/roles.guard");
const _emailverifiedguard = require("../../common/guards/email-verified.guard");
const _rolesdecorator = require("../../common/decorators/roles.decorator");
const _emailverifieddecorator = require("../../common/decorators/email-verified.decorator");
const _currentuserdecorator = require("../../common/decorators/current-user.decorator");
const _transferlimitsservice = require("../../common/services/transfer-limits.service");
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
let WalletController = class WalletController {
    getWallet(user) {
        return this.walletService.getWallet(user.id);
    }
    getBalance(user) {
        return this.walletService.getBalance(user.id);
    }
    async getLimits(user) {
        const [limits, fees] = await Promise.all([
            this.transferLimitsService.getRemainingLimits(user.id),
            Promise.resolve(this.transferLimitsService.getFeeInfo())
        ]);
        return {
            limits,
            fees
        };
    }
    deposit(user, depositDto) {
        return this.walletService.deposit(user.id, depositDto);
    }
    withdraw(user, withdrawDto) {
        return this.walletService.withdraw(user.id, withdrawDto);
    }
    transfer(user, transferDto) {
        return this.walletService.transfer(user.id, transferDto);
    }
    // Admin endpoints
    adminAdjustBalance(userId, admin, adjustDto) {
        return this.walletService.adminAdjustBalance(userId, admin.id, adjustDto.amount, adjustDto.type, adjustDto.reason);
    }
    adminClearAccount(userId, admin, clearDto) {
        return this.walletService.adminClearAccount(userId, admin.id, clearDto.reason);
    }
    constructor(walletService, transferLimitsService){
        this.walletService = walletService;
        this.transferLimitsService = transferLimitsService;
    }
};
_ts_decorate([
    (0, _common.Get)(),
    (0, _swagger.ApiOperation)({
        summary: 'Get user wallet'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Wallet retrieved successfully'
    }),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], WalletController.prototype, "getWallet", null);
_ts_decorate([
    (0, _common.Get)('balance'),
    (0, _swagger.ApiOperation)({
        summary: 'Get wallet balance'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Balance retrieved successfully'
    }),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], WalletController.prototype, "getBalance", null);
_ts_decorate([
    (0, _common.Get)('limits'),
    (0, _swagger.ApiOperation)({
        summary: 'Get transfer limits and fees'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Limits retrieved successfully'
    }),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], WalletController.prototype, "getLimits", null);
_ts_decorate([
    (0, _common.Post)('deposit'),
    (0, _swagger.ApiOperation)({
        summary: 'Deposit money into wallet'
    }),
    (0, _swagger.ApiResponse)({
        status: 201,
        description: 'Deposit successful'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Wallet not found'
    }),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        typeof _walletdto.DepositDto === "undefined" ? Object : _walletdto.DepositDto
    ]),
    _ts_metadata("design:returntype", void 0)
], WalletController.prototype, "deposit", null);
_ts_decorate([
    (0, _common.Post)('withdraw'),
    (0, _emailverifieddecorator.RequireEmailVerified)(),
    (0, _swagger.ApiOperation)({
        summary: 'Withdraw money from wallet'
    }),
    (0, _swagger.ApiResponse)({
        status: 201,
        description: 'Withdrawal successful'
    }),
    (0, _swagger.ApiResponse)({
        status: 400,
        description: 'Insufficient balance'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Wallet not found'
    }),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        typeof _walletdto.WithdrawDto === "undefined" ? Object : _walletdto.WithdrawDto
    ]),
    _ts_metadata("design:returntype", void 0)
], WalletController.prototype, "withdraw", null);
_ts_decorate([
    (0, _common.Post)('transfer'),
    (0, _emailverifieddecorator.RequireEmailVerified)(),
    (0, _swagger.ApiOperation)({
        summary: 'Transfer money to another user'
    }),
    (0, _swagger.ApiResponse)({
        status: 201,
        description: 'Transfer successful'
    }),
    (0, _swagger.ApiResponse)({
        status: 400,
        description: 'Insufficient balance'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Wallet not found'
    }),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        typeof _walletdto.TransferDto === "undefined" ? Object : _walletdto.TransferDto
    ]),
    _ts_metadata("design:returntype", void 0)
], WalletController.prototype, "transfer", null);
_ts_decorate([
    (0, _common.Post)('admin/:userId/adjust'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('SUPER_ADMIN', 'BANK_ADMIN'),
    (0, _swagger.ApiOperation)({
        summary: 'Adjust user balance (Admin only)'
    }),
    (0, _swagger.ApiResponse)({
        status: 201,
        description: 'Balance adjusted successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 400,
        description: 'Invalid request'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'User wallet not found'
    }),
    _ts_param(0, (0, _common.Param)('userId')),
    _ts_param(1, (0, _currentuserdecorator.CurrentUser)()),
    _ts_param(2, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], WalletController.prototype, "adminAdjustBalance", null);
_ts_decorate([
    (0, _common.Post)('admin/:userId/clear'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('SUPER_ADMIN', 'BANK_ADMIN'),
    (0, _swagger.ApiOperation)({
        summary: 'Clear user account balance to zero (Admin only)'
    }),
    (0, _swagger.ApiResponse)({
        status: 201,
        description: 'Account cleared successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 400,
        description: 'Invalid request'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'User wallet not found'
    }),
    _ts_param(0, (0, _common.Param)('userId')),
    _ts_param(1, (0, _currentuserdecorator.CurrentUser)()),
    _ts_param(2, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], WalletController.prototype, "adminClearAccount", null);
WalletController = _ts_decorate([
    (0, _swagger.ApiTags)('wallet'),
    (0, _common.Controller)('wallet'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _emailverifiedguard.EmailVerifiedGuard),
    (0, _swagger.ApiBearerAuth)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _walletservice.WalletService === "undefined" ? Object : _walletservice.WalletService,
        typeof _transferlimitsservice.TransferLimitsService === "undefined" ? Object : _transferlimitsservice.TransferLimitsService
    ])
], WalletController);

//# sourceMappingURL=wallet.controller.js.map