"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AccountStatusGuard", {
    enumerable: true,
    get: function() {
        return AccountStatusGuard;
    }
});
const _common = require("@nestjs/common");
const _core = require("@nestjs/core");
const _prismaservice = require("../../prisma/prisma.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let AccountStatusGuard = class AccountStatusGuard {
    async canActivate(context) {
        // Check if this endpoint allows suspended accounts
        const allowSuspended = this.reflector.get('allowSuspended', context.getHandler());
        // If explicitly allowed, skip check
        if (allowSuspended) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user || !user.id) {
            return true; // Let JWT guard handle authentication
        }
        // Fetch current user status from database
        const dbUser = await this.prisma.user.findUnique({
            where: {
                id: user.id
            },
            select: {
                accountStatus: true
            }
        });
        if (!dbUser) {
            throw new _common.ForbiddenException('User not found');
        }
        // Block suspended accounts from most actions
        if (dbUser.accountStatus === 'SUSPENDED') {
            throw new _common.ForbiddenException('Your account is suspended. You have limited access. Please contact support or check your account status.');
        }
        // Block frozen accounts entirely
        if (dbUser.accountStatus === 'FROZEN') {
            throw new _common.ForbiddenException('Your account is frozen. Please contact support immediately.');
        }
        // Block closed accounts
        if (dbUser.accountStatus === 'CLOSED') {
            throw new _common.ForbiddenException('Your account has been closed. Please contact support if you believe this is an error.');
        }
        return true;
    }
    constructor(reflector, prisma){
        this.reflector = reflector;
        this.prisma = prisma;
    }
};
AccountStatusGuard = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _core.Reflector === "undefined" ? Object : _core.Reflector,
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], AccountStatusGuard);

//# sourceMappingURL=account-status.guard.js.map