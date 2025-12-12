"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CardsController", {
    enumerable: true,
    get: function() {
        return CardsController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _cardsservice = require("./cards.service");
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
let CardsController = class CardsController {
    getUserCards(user) {
        return this.cardsService.getUserCards(user.id);
    }
    getUserCardRequests(user) {
        return this.cardsService.getUserCardRequests(user.id);
    }
    getCard(id, user) {
        return this.cardsService.getCardById(id, user.id);
    }
    createCard(user, body) {
        return this.cardsService.createVirtualCard(user.id, body.cardType, body.reason);
    }
    // User block/unblock actions
    blockOwnCard(id, user) {
        return this.cardsService.userBlockCard(id, user.id);
    }
    unblockOwnCard(id, user) {
        return this.cardsService.userUnblockCard(id, user.id);
    }
    getPan(id, user) {
        return this.cardsService.userGetPan(id, user.id);
    }
    // Admin endpoints
    getAllCardRequests(status) {
        return this.cardsService.getAllCardRequests(status);
    }
    approveCardRequest(id, admin) {
        return this.cardsService.approveCardRequest(id, admin.id);
    }
    // User: Fund card from wallet balance
    fundOwnCard(id, user, body) {
        return this.cardsService.userFundCard(id, user.id, Number(body.amount || 0));
    }
    // User: Withdraw from card back to wallet
    withdrawOwnCard(id, user, body) {
        return this.cardsService.userWithdrawFromCard(id, user.id, Number(body.amount || 0));
    }
    rejectCardRequest(id, admin, body) {
        return this.cardsService.rejectCardRequest(id, admin.id, body.reason);
    }
    getAllCards() {
        return this.cardsService.getAllCards();
    }
    blockCard(id, admin) {
        return this.cardsService.blockCard(id, admin.id);
    }
    unblockCard(id, admin) {
        return this.cardsService.unblockCard(id, admin.id);
    }
    deleteCard(id, admin) {
        return this.cardsService.deleteCard(id, admin.id);
    }
    constructor(cardsService){
        this.cardsService = cardsService;
    }
};
_ts_decorate([
    (0, _common.Get)(),
    (0, _swagger.ApiOperation)({
        summary: 'Get user cards'
    }),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], CardsController.prototype, "getUserCards", null);
_ts_decorate([
    (0, _common.Get)('requests'),
    (0, _swagger.ApiOperation)({
        summary: 'Get user card requests'
    }),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], CardsController.prototype, "getUserCardRequests", null);
_ts_decorate([
    (0, _common.Get)(':id'),
    (0, _swagger.ApiOperation)({
        summary: 'Get card by ID'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _currentuserdecorator.CurrentUser)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], CardsController.prototype, "getCard", null);
_ts_decorate([
    (0, _common.Post)('create'),
    (0, _swagger.ApiOperation)({
        summary: 'Request a new card'
    }),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], CardsController.prototype, "createCard", null);
_ts_decorate([
    (0, _common.Post)(':id/block'),
    (0, _swagger.ApiOperation)({
        summary: 'Block own card'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _currentuserdecorator.CurrentUser)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], CardsController.prototype, "blockOwnCard", null);
_ts_decorate([
    (0, _common.Post)(':id/unblock'),
    (0, _swagger.ApiOperation)({
        summary: 'Unblock own card'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _currentuserdecorator.CurrentUser)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], CardsController.prototype, "unblockOwnCard", null);
_ts_decorate([
    (0, _common.Get)(':id/pan'),
    (0, _swagger.ApiOperation)({
        summary: 'Securely reveal full virtual card PAN (demo)'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _currentuserdecorator.CurrentUser)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], CardsController.prototype, "getPan", null);
_ts_decorate([
    (0, _common.Get)('admin/requests'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('BANK_ADMIN', 'SUPER_ADMIN'),
    (0, _swagger.ApiOperation)({
        summary: 'Get all card requests (Admin only)'
    }),
    _ts_param(0, (0, _common.Query)('status')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], CardsController.prototype, "getAllCardRequests", null);
_ts_decorate([
    (0, _common.Post)('admin/requests/:id/approve'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('BANK_ADMIN', 'SUPER_ADMIN'),
    (0, _swagger.ApiOperation)({
        summary: 'Approve card request (Admin only)'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _currentuserdecorator.CurrentUser)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], CardsController.prototype, "approveCardRequest", null);
_ts_decorate([
    (0, _common.Post)(':id/fund'),
    (0, _swagger.ApiOperation)({
        summary: 'Fund card from user wallet'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _currentuserdecorator.CurrentUser)()),
    _ts_param(2, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], CardsController.prototype, "fundOwnCard", null);
_ts_decorate([
    (0, _common.Post)(':id/withdraw'),
    (0, _swagger.ApiOperation)({
        summary: 'Withdraw funds from card back to wallet'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _currentuserdecorator.CurrentUser)()),
    _ts_param(2, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], CardsController.prototype, "withdrawOwnCard", null);
_ts_decorate([
    (0, _common.Post)('admin/requests/:id/reject'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('BANK_ADMIN', 'SUPER_ADMIN'),
    (0, _swagger.ApiOperation)({
        summary: 'Reject card request (Admin only)'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _currentuserdecorator.CurrentUser)()),
    _ts_param(2, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], CardsController.prototype, "rejectCardRequest", null);
_ts_decorate([
    (0, _common.Get)('admin/all'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('BANK_ADMIN', 'SUPER_ADMIN'),
    (0, _swagger.ApiOperation)({
        summary: 'Get all cards (Admin only)'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], CardsController.prototype, "getAllCards", null);
_ts_decorate([
    (0, _common.Post)('admin/:id/block'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('BANK_ADMIN', 'SUPER_ADMIN'),
    (0, _swagger.ApiOperation)({
        summary: 'Block a card (Admin only)'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _currentuserdecorator.CurrentUser)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], CardsController.prototype, "blockCard", null);
_ts_decorate([
    (0, _common.Post)('admin/:id/unblock'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('BANK_ADMIN', 'SUPER_ADMIN'),
    (0, _swagger.ApiOperation)({
        summary: 'Unblock a card (Admin only)'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _currentuserdecorator.CurrentUser)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], CardsController.prototype, "unblockCard", null);
_ts_decorate([
    (0, _common.Delete)('admin/:id'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('BANK_ADMIN', 'SUPER_ADMIN'),
    (0, _swagger.ApiOperation)({
        summary: 'Delete a card (Admin only)'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _currentuserdecorator.CurrentUser)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], CardsController.prototype, "deleteCard", null);
CardsController = _ts_decorate([
    (0, _swagger.ApiTags)('cards'),
    (0, _common.Controller)('cards'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _swagger.ApiBearerAuth)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _cardsservice.CardsService === "undefined" ? Object : _cardsservice.CardsService
    ])
], CardsController);

//# sourceMappingURL=cards.controller.js.map