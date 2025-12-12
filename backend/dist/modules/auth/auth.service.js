"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthService", {
    enumerable: true,
    get: function() {
        return AuthService;
    }
});
const _common = require("@nestjs/common");
const _jwt = require("@nestjs/jwt");
const _config = require("@nestjs/config");
const _bcrypt = /*#__PURE__*/ _interop_require_wildcard(require("bcrypt"));
const _prismaservice = require("../../prisma/prisma.service");
const _otpservice = require("../otp/otp.service");
const _emailservice = require("../../common/services/email.service");
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
let AuthService = class AuthService {
    async register(registerDto) {
        // Check if user exists
        const existingUser = await this.prisma.user.findFirst({
            where: {
                OR: [
                    {
                        email: registerDto.email
                    },
                    {
                        phone: registerDto.phone
                    }
                ]
            }
        });
        if (existingUser) {
            if (existingUser.email === registerDto.email) {
                throw new _common.ConflictException('Email already registered');
            }
            throw new _common.ConflictException('Phone number already registered');
        }
        // Hash password
        const hashedPassword = await _bcrypt.hash(registerDto.password, 10);
        // Create user and wallet in a transaction
        const user = await this.prisma.$transaction(async (tx)=>{
            const newUser = await tx.user.create({
                data: {
                    email: registerDto.email,
                    phone: registerDto.phone,
                    firstName: registerDto.firstName,
                    lastName: registerDto.lastName,
                    username: registerDto.username,
                    accountType: registerDto.accountType || 'savings',
                    transactionPin: registerDto.transactionPin,
                    password: hashedPassword,
                    country: registerDto.country || 'NG',
                    currency: registerDto.currency || 'NGN',
                    role: 'USER',
                    accountStatus: 'PENDING'
                },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    phone: true,
                    country: true,
                    currency: true,
                    role: true,
                    accountStatus: true,
                    isEmailVerified: true
                }
            });
            // Create wallet for user with user's currency
            await tx.wallet.create({
                data: {
                    userId: newUser.id,
                    balance: 0,
                    currency: registerDto.currency || 'NGN'
                }
            });
            return newUser;
        });
        // Generate tokens
        const tokens = await this.generateTokens(user.id, user.email, user.role);
        // Send welcome email (non-blocking)
        try {
            await this.emailService.sendWelcomeEmail({
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                accountNumber: '****' // replace with real if available
            });
        } catch  {}
        return {
            user,
            ...tokens
        };
    }
    async login(loginDto) {
        // Find user
        const user = await this.prisma.user.findUnique({
            where: {
                email: loginDto.email
            }
        });
        if (!user) {
            throw new _common.UnauthorizedException('Invalid credentials');
        }
        // Verify password
        const isPasswordValid = await _bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new _common.UnauthorizedException('Invalid credentials');
        }
        // Only block CLOSED and FROZEN accounts from logging in
        // SUSPENDED accounts can log in but with limited access
        if (user.accountStatus === 'CLOSED' || user.accountStatus === 'FROZEN') {
            throw new _common.UnauthorizedException(`Account is ${user.accountStatus.toLowerCase()}. Please contact support.`);
        }
        // Update last login
        await this.prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                lastLoginAt: new Date()
            }
        });
        // Generate tokens
        const tokens = await this.generateTokens(user.id, user.email, user.role);
        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                country: user.country,
                currency: user.currency,
                role: user.role,
                accountStatus: user.accountStatus,
                isEmailVerified: user.isEmailVerified
            },
            ...tokens
        };
    }
    async refreshToken(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get('JWT_REFRESH_SECRET')
            });
            const user = await this.prisma.user.findUnique({
                where: {
                    id: payload.sub
                }
            });
            if (!user) {
                throw new _common.UnauthorizedException('User not found');
            }
            return this.generateTokens(user.id, user.email, user.role);
        } catch (error) {
            throw new _common.UnauthorizedException('Invalid refresh token');
        }
    }
    async validateUser(userId) {
        return this.prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                country: true,
                currency: true,
                role: true,
                accountStatus: true,
                isEmailVerified: true,
                wallet: {
                    select: {
                        balance: true,
                        currency: true
                    }
                },
                kyc: {
                    select: {
                        status: true
                    }
                }
            }
        });
    }
    async changePassword(userId, changePasswordDto) {
        // Validate passwords match
        if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
            throw new _common.BadRequestException('New passwords do not match');
        }
        // Get user with password
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            throw new _common.UnauthorizedException('User not found');
        }
        // Verify current password
        const isPasswordValid = await _bcrypt.compare(changePasswordDto.currentPassword, user.password);
        if (!isPasswordValid) {
            throw new _common.UnauthorizedException('Current password is incorrect');
        }
        // Check if new password is same as current
        const isSamePassword = await _bcrypt.compare(changePasswordDto.newPassword, user.password);
        if (isSamePassword) {
            throw new _common.BadRequestException('New password must be different from current password');
        }
        // Hash new password
        const hashedPassword = await _bcrypt.hash(changePasswordDto.newPassword, 10);
        // Update password
        await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                password: hashedPassword
            }
        });
        return {
            message: 'Password changed successfully'
        };
    }
    async forgotPassword(dto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        });
        if (!user) {
            // Avoid user enumeration
            return {
                message: 'If that email exists, a reset code has been sent.'
            };
        }
        try {
            const start = await this.otpService.start(user.id, 'RESET', {
                email: user.email,
                firstName: user.firstName
            });
            const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?email=${encodeURIComponent(user.email)}&otpId=${encodeURIComponent(start.otpId)}`;
            try {
                await this.emailService.sendPasswordResetEmail({
                    email: user.email,
                    firstName: user.firstName,
                    resetUrl
                });
            } catch (emailError) {
                console.error('Failed to send password reset email:', emailError);
            }
            return {
                message: 'If that email exists, a reset code has been sent.',
                otpId: start.otpId,
                expiresIn: start.expiresIn
            };
        } catch (error) {
            console.error('Forgot password error:', error);
            throw new _common.BadRequestException('Failed to process password reset request');
        }
    }
    async resetPassword(dto) {
        const otp = await this.prisma.otpCode.findUnique({
            where: {
                id: dto.otpId
            }
        });
        if (!otp) throw new _common.BadRequestException('Invalid or expired code');
        await this.otpService.verify(otp.userId, dto.otpId, dto.code);
        // Get user's current password to check for reuse
        const user = await this.prisma.user.findUnique({
            where: {
                id: otp.userId
            },
            select: {
                password: true
            }
        });
        if (!user) {
            throw new _common.BadRequestException('User not found');
        }
        // Check if new password is same as current password
        const isSamePassword = await _bcrypt.compare(dto.newPassword, user.password);
        if (isSamePassword) {
            throw new _common.BadRequestException('New password must be different from your current password');
        }
        const hashed = await _bcrypt.hash(dto.newPassword, 10);
        await this.prisma.user.update({
            where: {
                id: otp.userId
            },
            data: {
                password: hashed
            }
        });
        return {
            message: 'Password reset successful'
        };
    }
    async getUserSettings(userId) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                emailTransactions: true,
                emailSecurity: true,
                emailMarketing: true,
                smsTransactions: true,
                smsSecurity: true,
                pushNotifications: true
            }
        });
        if (!user) {
            throw new _common.UnauthorizedException('User not found');
        }
        return user;
    }
    async updateUserSettings(userId, settings) {
        const updatedUser = await this.prisma.user.update({
            where: {
                id: userId
            },
            data: settings,
            select: {
                emailTransactions: true,
                emailSecurity: true,
                emailMarketing: true,
                smsTransactions: true,
                smsSecurity: true,
                pushNotifications: true
            }
        });
        return {
            message: 'Settings updated successfully',
            settings: updatedUser
        };
    }
    async sendVerificationEmail(userId) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                isEmailVerified: true
            }
        });
        if (!user) {
            throw new _common.UnauthorizedException('User not found');
        }
        if (user.isEmailVerified) {
            throw new _common.BadRequestException('Email is already verified');
        }
        // Generate OTP
        const start = await this.otpService.start(user.id, 'EMAIL_VERIFICATION', {
            email: user.email,
            firstName: user.firstName
        });
        // Send verification email with OTP
        try {
            await this.emailService.sendGenericNotification({
                email: user.email,
                title: '📧 Verify Your Email Address',
                message: `Hi ${user.firstName},<br><br>Thank you for registering! Please use the verification code below to confirm your email address:<br><br><div style="background:#f8fafc;padding:24px;border-radius:8px;text-align:center;margin:24px 0"><span style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#1e293b">${start.code}</span></div><br>This code will expire in <strong>${Math.floor(start.expiresIn / 60)} minutes</strong>.<br><br>If you didn't request this verification, please ignore this email.`,
                actionLabel: 'Verify Email',
                actionUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/user/profile`
            });
        } catch (error) {
            console.error('Failed to send verification email:', error);
        }
        return {
            message: 'Verification code sent to your email',
            otpId: start.otpId,
            expiresIn: start.expiresIn
        };
    }
    async verifyEmail(userId, otpId, code) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                id: true,
                isEmailVerified: true
            }
        });
        if (!user) {
            throw new _common.UnauthorizedException('User not found');
        }
        if (user.isEmailVerified) {
            throw new _common.BadRequestException('Email is already verified');
        }
        // Verify OTP code
        await this.otpService.verify(userId, otpId, code);
        // Update user email verification status
        await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                isEmailVerified: true
            }
        });
        return {
            message: 'Email verified successfully'
        };
    }
    async generateTokens(userId, email, role) {
        const payload = {
            sub: userId,
            email,
            role
        };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_SECRET') || 'default-secret',
                expiresIn: '7d'
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_REFRESH_SECRET') || 'default-refresh-secret',
                expiresIn: '30d'
            })
        ]);
        return {
            accessToken,
            refreshToken
        };
    }
    constructor(prisma, jwtService, configService, otpService, emailService){
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
        this.otpService = otpService;
        this.emailService = emailService;
    }
};
AuthService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService,
        typeof _jwt.JwtService === "undefined" ? Object : _jwt.JwtService,
        typeof _config.ConfigService === "undefined" ? Object : _config.ConfigService,
        typeof _otpservice.OtpService === "undefined" ? Object : _otpservice.OtpService,
        typeof _emailservice.EmailService === "undefined" ? Object : _emailservice.EmailService
    ])
], AuthService);

//# sourceMappingURL=auth.service.js.map