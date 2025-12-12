"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EmailVerifiedGuard", {
    enumerable: true,
    get: function() {
        return EmailVerifiedGuard;
    }
});
const _common = require("@nestjs/common");
const _core = require("@nestjs/core");
const _prismaservice = require("../../prisma/prisma.service");
const _emailverifieddecorator = require("../decorators/email-verified.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let EmailVerifiedGuard = class EmailVerifiedGuard {
    async canActivate(context) {
        const requireEmailVerified = this.reflector.getAllAndOverride(_emailverifieddecorator.REQUIRE_EMAIL_VERIFIED_KEY, [
            context.getHandler(),
            context.getClass()
        ]);
        if (!requireEmailVerified) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new _common.ForbiddenException('User not authenticated');
        }
        // Fetch fresh user data to check email verification status
        const dbUser = await this.prisma.user.findUnique({
            where: {
                id: user.id
            },
            select: {
                isEmailVerified: true
            }
        });
        if (!dbUser || !dbUser.isEmailVerified) {
            throw new _common.ForbiddenException('Please verify your email address before performing this action');
        }
        return true;
    }
    constructor(reflector, prisma){
        this.reflector = reflector;
        this.prisma = prisma;
    }
};
EmailVerifiedGuard = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _core.Reflector === "undefined" ? Object : _core.Reflector,
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], EmailVerifiedGuard);

//# sourceMappingURL=email-verified.guard.js.map