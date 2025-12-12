"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "OtpService", {
    enumerable: true,
    get: function() {
        return OtpService;
    }
});
const _common = require("@nestjs/common");
const _prismaservice = require("../../prisma/prisma.service");
const _emailservice = require("../../common/services/email.service");
const _bcrypt = /*#__PURE__*/ _interop_require_wildcard(require("bcrypt"));
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let OtpService = class OtpService {
    generateCode() {
        // 6-digit numeric
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    async start(userId, purpose, metadata) {
        const code = this.generateCode();
        const codeHash = await _bcrypt.hash(code, 10);
        const expiresAt = new Date(Date.now() + this.TTL_SECONDS * 1000);
        let otp;
        try {
            otp = await this.prisma.otpCode.create({
                data: {
                    userId,
                    purpose,
                    codeHash,
                    expiresAt,
                    metadata: metadata
                }
            });
        } catch (error) {
            this.logger.error(`Failed to create OTP code: ${error.message}`, error.stack);
            throw error;
        }
        // Send via email
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    id: userId
                }
            });
            await this.email.sendOtpEmail({
                email: user?.email || metadata?.email || 'user@local',
                firstName: user?.firstName || metadata?.firstName || 'User',
                code,
                purpose: purpose
            });
        } catch (e) {
            // We only log here; in production wire a dedicated template
            this.logger.warn(`Email send failed or stubbed: ${e?.message || e}`);
        }
        return {
            otpId: otp.id,
            code,
            expiresIn: this.TTL_SECONDS
        };
    }
    async verify(userId, otpId, code) {
        const otp = await this.prisma.otpCode.findUnique({
            where: {
                id: otpId
            }
        });
        if (!otp || otp.userId !== userId) {
            throw new _common.NotFoundException('OTP not found');
        }
        if (otp.usedAt) {
            throw new _common.BadRequestException('OTP already used');
        }
        if (otp.expiresAt < new Date()) {
            throw new _common.BadRequestException('OTP expired');
        }
        if (otp.attempts >= 5) {
            throw new _common.BadRequestException('Too many attempts');
        }
        const ok = await _bcrypt.compare(code, otp.codeHash);
        await this.prisma.otpCode.update({
            where: {
                id: otpId
            },
            data: {
                attempts: {
                    increment: 1
                },
                usedAt: ok ? new Date() : null
            }
        });
        if (!ok) throw new _common.BadRequestException('Invalid code');
        return {
            success: true
        };
    }
    constructor(prisma, email){
        this.prisma = prisma;
        this.email = email;
        this.logger = new _common.Logger(OtpService.name);
        this.TTL_SECONDS = 5 * 60; // 5 minutes
    }
};
OtpService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService,
        typeof _emailservice.EmailService === "undefined" ? Object : _emailservice.EmailService
    ])
], OtpService);

//# sourceMappingURL=otp.service.js.map