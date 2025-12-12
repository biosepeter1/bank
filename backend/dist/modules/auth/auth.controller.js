"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthController", {
    enumerable: true,
    get: function() {
        return AuthController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _authservice = require("./auth.service");
const _registerdto = require("./dto/register.dto");
const _logindto = require("./dto/login.dto");
const _changepassworddto = require("./dto/change-password.dto");
const _jwtauthguard = require("../../common/guards/jwt-auth.guard");
const _currentuserdecorator = require("../../common/decorators/current-user.decorator");
const _allowsuspendeddecorator = require("../../common/decorators/allow-suspended.decorator");
const _resetdto = require("./dto/reset.dto");
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
let AuthController = class AuthController {
    async register(registerDto) {
        return this.authService.register(registerDto);
    }
    async login(loginDto) {
        return this.authService.login(loginDto);
    }
    async refresh(refreshToken) {
        return this.authService.refreshToken(refreshToken);
    }
    async getProfile(user) {
        return this.authService.validateUser(user.id);
    }
    async forgot(dto) {
        return this.authService.forgotPassword(dto);
    }
    async reset(dto) {
        return this.authService.resetPassword(dto);
    }
    async changePassword(user, changePasswordDto) {
        return this.authService.changePassword(user.id, changePasswordDto);
    }
    async getSettings(user) {
        return this.authService.getUserSettings(user.id);
    }
    async updateSettings(user, settings) {
        return this.authService.updateUserSettings(user.id, settings);
    }
    async sendVerificationEmail(user) {
        return this.authService.sendVerificationEmail(user.id);
    }
    async verifyEmail(user, body) {
        return this.authService.verifyEmail(user.id, body.otpId, body.code);
    }
    constructor(authService){
        this.authService = authService;
    }
};
_ts_decorate([
    (0, _common.Post)('register'),
    (0, _swagger.ApiOperation)({
        summary: 'Register a new user'
    }),
    (0, _swagger.ApiResponse)({
        status: 201,
        description: 'User successfully registered',
        type: _logindto.LoginResponseDto
    }),
    (0, _swagger.ApiResponse)({
        status: 409,
        description: 'Email or phone already registered'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _registerdto.RegisterDto === "undefined" ? Object : _registerdto.RegisterDto
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
_ts_decorate([
    (0, _common.Post)('login'),
    (0, _common.HttpCode)(_common.HttpStatus.OK),
    (0, _swagger.ApiOperation)({
        summary: 'Login user'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'User successfully logged in',
        type: _logindto.LoginResponseDto
    }),
    (0, _swagger.ApiResponse)({
        status: 401,
        description: 'Invalid credentials'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _logindto.LoginDto === "undefined" ? Object : _logindto.LoginDto
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
_ts_decorate([
    (0, _common.Post)('refresh'),
    (0, _common.HttpCode)(_common.HttpStatus.OK),
    (0, _swagger.ApiOperation)({
        summary: 'Refresh access token'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Token refreshed successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 401,
        description: 'Invalid refresh token'
    }),
    _ts_param(0, (0, _common.Body)('refreshToken')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
_ts_decorate([
    (0, _common.Get)('me'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _allowsuspendeddecorator.AllowSuspended)(),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Get current user profile'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'User profile retrieved'
    }),
    (0, _swagger.ApiResponse)({
        status: 401,
        description: 'Unauthorized'
    }),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
_ts_decorate([
    (0, _common.Post)('forgot-password'),
    (0, _common.HttpCode)(_common.HttpStatus.OK),
    (0, _swagger.ApiOperation)({
        summary: 'Start password reset (email OTP)'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _resetdto.ForgotPasswordDto === "undefined" ? Object : _resetdto.ForgotPasswordDto
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "forgot", null);
_ts_decorate([
    (0, _common.Post)('reset-password'),
    (0, _common.HttpCode)(_common.HttpStatus.OK),
    (0, _swagger.ApiOperation)({
        summary: 'Reset password with OTP'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _resetdto.ResetPasswordDto === "undefined" ? Object : _resetdto.ResetPasswordDto
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "reset", null);
_ts_decorate([
    (0, _common.Patch)('change-password'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _swagger.ApiBearerAuth)(),
    (0, _common.HttpCode)(_common.HttpStatus.OK),
    (0, _swagger.ApiOperation)({
        summary: 'Change user password'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Password changed successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 400,
        description: 'Bad request'
    }),
    (0, _swagger.ApiResponse)({
        status: 401,
        description: 'Unauthorized'
    }),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        typeof _changepassworddto.ChangePasswordDto === "undefined" ? Object : _changepassworddto.ChangePasswordDto
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
_ts_decorate([
    (0, _common.Get)('settings'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _allowsuspendeddecorator.AllowSuspended)(),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Get user notification settings'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'User settings retrieved'
    }),
    (0, _swagger.ApiResponse)({
        status: 401,
        description: 'Unauthorized'
    }),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "getSettings", null);
_ts_decorate([
    (0, _common.Patch)('settings'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _allowsuspendeddecorator.AllowSuspended)(),
    (0, _swagger.ApiBearerAuth)(),
    (0, _common.HttpCode)(_common.HttpStatus.OK),
    (0, _swagger.ApiOperation)({
        summary: 'Update user notification settings'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Settings updated successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 401,
        description: 'Unauthorized'
    }),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "updateSettings", null);
_ts_decorate([
    (0, _common.Post)('send-verification-email'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _allowsuspendeddecorator.AllowSuspended)(),
    (0, _swagger.ApiBearerAuth)(),
    (0, _common.HttpCode)(_common.HttpStatus.OK),
    (0, _swagger.ApiOperation)({
        summary: 'Send email verification code'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Verification email sent'
    }),
    (0, _swagger.ApiResponse)({
        status: 400,
        description: 'Email already verified'
    }),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "sendVerificationEmail", null);
_ts_decorate([
    (0, _common.Post)('verify-email'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _allowsuspendeddecorator.AllowSuspended)(),
    (0, _swagger.ApiBearerAuth)(),
    (0, _common.HttpCode)(_common.HttpStatus.OK),
    (0, _swagger.ApiOperation)({
        summary: 'Verify email with OTP code'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Email verified successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 400,
        description: 'Invalid or expired code'
    }),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "verifyEmail", null);
AuthController = _ts_decorate([
    (0, _swagger.ApiTags)('auth'),
    (0, _common.Controller)('auth'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _authservice.AuthService === "undefined" ? Object : _authservice.AuthService
    ])
], AuthController);

//# sourceMappingURL=auth.controller.js.map