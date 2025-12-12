"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UsersController", {
    enumerable: true,
    get: function() {
        return UsersController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _usersservice = require("./users.service");
const _jwtauthguard = require("../../common/guards/jwt-auth.guard");
const _rolesguard = require("../../common/guards/roles.guard");
const _rolesdecorator = require("../../common/decorators/roles.decorator");
const _currentuserdecorator = require("../../common/decorators/current-user.decorator");
const _client = require("@prisma/client");
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
let UsersController = class UsersController {
    findAll(admin) {
        return this.usersService.findAll(admin.role);
    }
    findOne(id) {
        return this.usersService.findOne(id);
    }
    updateUserStatus(id, status) {
        return this.usersService.updateUserStatus(id, status);
    }
    adjustBalance(id, data, admin) {
        return this.usersService.adjustBalance(id, data.type, data.amount, data.reason, admin.id);
    }
    deleteUser(id) {
        return this.usersService.deleteUser(id);
    }
    constructor(usersService){
        this.usersService = usersService;
    }
};
_ts_decorate([
    (0, _common.Get)(),
    (0, _rolesdecorator.Roles)('SUPER_ADMIN', 'BANK_ADMIN'),
    (0, _swagger.ApiOperation)({
        summary: 'Get all users (Admin only)'
    }),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], UsersController.prototype, "findAll", null);
_ts_decorate([
    (0, _common.Get)(':id'),
    (0, _swagger.ApiOperation)({
        summary: 'Get user by ID'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], UsersController.prototype, "findOne", null);
_ts_decorate([
    (0, _common.Patch)(':id/status'),
    (0, _rolesdecorator.Roles)('SUPER_ADMIN', 'BANK_ADMIN'),
    (0, _swagger.ApiOperation)({
        summary: 'Update user account status (Admin only)'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)('status')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _client.AccountStatus === "undefined" ? Object : _client.AccountStatus
    ]),
    _ts_metadata("design:returntype", void 0)
], UsersController.prototype, "updateUserStatus", null);
_ts_decorate([
    (0, _common.Post)(':id/balance'),
    (0, _rolesdecorator.Roles)('SUPER_ADMIN', 'BANK_ADMIN'),
    (0, _swagger.ApiOperation)({
        summary: 'Adjust user balance (Admin only)'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_param(2, (0, _currentuserdecorator.CurrentUser)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], UsersController.prototype, "adjustBalance", null);
_ts_decorate([
    (0, _common.Delete)(':id'),
    (0, _rolesdecorator.Roles)('SUPER_ADMIN'),
    (0, _swagger.ApiOperation)({
        summary: 'Delete user (Super Admin only)'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], UsersController.prototype, "deleteUser", null);
UsersController = _ts_decorate([
    (0, _swagger.ApiTags)('users'),
    (0, _common.Controller)('users'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _swagger.ApiBearerAuth)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _usersservice.UsersService === "undefined" ? Object : _usersservice.UsersService
    ])
], UsersController);

//# sourceMappingURL=users.controller.js.map