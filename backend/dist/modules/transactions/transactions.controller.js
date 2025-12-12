"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TransactionsController", {
    enumerable: true,
    get: function() {
        return TransactionsController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _transactionsservice = require("./transactions.service");
const _jwtauthguard = require("../../common/guards/jwt-auth.guard");
const _rolesguard = require("../../common/guards/roles.guard");
const _rolesdecorator = require("../../common/decorators/roles.decorator");
const _currentuserdecorator = require("../../common/decorators/current-user.decorator");
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
let TransactionsController = class TransactionsController {
    getUserTransactions(user, limit) {
        return this.transactionsService.getUserTransactions(user.id, limit);
    }
    getStats(user) {
        return this.transactionsService.getTransactionStats(user.id);
    }
    getAdminStats() {
        return this.transactionsService.getAdminTransactionStats();
    }
    getAllTransactions(limit) {
        return this.transactionsService.getAllTransactions(limit);
    }
    getTransaction(id, user) {
        return this.transactionsService.getTransactionById(id, user.id);
    }
    constructor(transactionsService){
        this.transactionsService = transactionsService;
    }
};
_ts_decorate([
    (0, _common.Get)(),
    (0, _swagger.ApiOperation)({
        summary: 'Get user transactions'
    }),
    (0, _swagger.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number
    }),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)()),
    _ts_param(1, (0, _common.Query)('limit')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        Number
    ]),
    _ts_metadata("design:returntype", void 0)
], TransactionsController.prototype, "getUserTransactions", null);
_ts_decorate([
    (0, _common.Get)('stats'),
    (0, _swagger.ApiOperation)({
        summary: 'Get transaction statistics'
    }),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], TransactionsController.prototype, "getStats", null);
_ts_decorate([
    (0, _common.Get)('admin/stats'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('SUPER_ADMIN', 'BANK_ADMIN'),
    (0, _swagger.ApiOperation)({
        summary: 'Get global transaction statistics (Admin only)'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], TransactionsController.prototype, "getAdminStats", null);
_ts_decorate([
    (0, _common.Get)('all'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('SUPER_ADMIN', 'BANK_ADMIN'),
    (0, _swagger.ApiOperation)({
        summary: 'Get all transactions (Admin only)'
    }),
    (0, _swagger.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number
    }),
    _ts_param(0, (0, _common.Query)('limit')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number
    ]),
    _ts_metadata("design:returntype", void 0)
], TransactionsController.prototype, "getAllTransactions", null);
_ts_decorate([
    (0, _common.Get)(':id'),
    (0, _swagger.ApiOperation)({
        summary: 'Get transaction by ID'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _currentuserdecorator.CurrentUser)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], TransactionsController.prototype, "getTransaction", null);
TransactionsController = _ts_decorate([
    (0, _swagger.ApiTags)('transactions'),
    (0, _common.Controller)('transactions'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _swagger.ApiBearerAuth)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _transactionsservice.TransactionsService === "undefined" ? Object : _transactionsservice.TransactionsService
    ])
], TransactionsController);

//# sourceMappingURL=transactions.controller.js.map