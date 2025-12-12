"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "KycController", {
    enumerable: true,
    get: function() {
        return KycController;
    }
});
const _common = require("@nestjs/common");
const _platformexpress = require("@nestjs/platform-express");
const _swagger = require("@nestjs/swagger");
const _kycservice = require("./kyc.service");
const _kycdto = require("./dto/kyc.dto");
const _jwtauthguard = require("../../common/guards/jwt-auth.guard");
const _rolesguard = require("../../common/guards/roles.guard");
const _rolesdecorator = require("../../common/decorators/roles.decorator");
const _currentuserdecorator = require("../../common/decorators/current-user.decorator");
const _allowsuspendeddecorator = require("../../common/decorators/allow-suspended.decorator");
const _uploadservice = require("../../common/upload/upload.service");
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
let KycController = class KycController {
    async getRequirements(countryCode, user) {
        // Use country code from query, or fall back to user's country
        const code = countryCode || user?.country || 'DEFAULT';
        return this.kycService.getKycRequirementsForCountry(code);
    }
    async uploadIdDocument(files) {
        if (!files?.file?.[0]) {
            throw new _common.BadRequestException('No file uploaded');
        }
        return {
            url: this.uploadService.getFileUrl(`kyc/id-documents/${files.file[0].filename}`),
            filename: files.file[0].filename
        };
    }
    async uploadProofOfAddress(files) {
        if (!files?.file?.[0]) {
            throw new _common.BadRequestException('No file uploaded');
        }
        return {
            url: this.uploadService.getFileUrl(`kyc/proof-of-address/${files.file[0].filename}`),
            filename: files.file[0].filename
        };
    }
    async uploadSelfie(files) {
        if (!files?.file?.[0]) {
            throw new _common.BadRequestException('No file uploaded');
        }
        return {
            url: this.uploadService.getFileUrl(`kyc/selfies/${files.file[0].filename}`),
            filename: files.file[0].filename
        };
    }
    async submitKyc(user, submitKycDto) {
        return this.kycService.submitKyc(user.id, submitKycDto);
    }
    getStatus(user) {
        return this.kycService.getKycStatus(user.id);
    }
    getAll() {
        return this.kycService.getAllKyc();
    }
    getPending() {
        return this.kycService.getAllPendingKyc();
    }
    reviewKyc(id, user, reviewKycDto) {
        return this.kycService.reviewKyc(id, user.id, reviewKycDto);
    }
    constructor(kycService, uploadService){
        this.kycService = kycService;
        this.uploadService = uploadService;
    }
};
_ts_decorate([
    (0, _common.Get)('requirements'),
    (0, _allowsuspendeddecorator.AllowSuspended)(),
    (0, _swagger.ApiOperation)({
        summary: 'Get KYC requirements for a country'
    }),
    (0, _swagger.ApiQuery)({
        name: 'countryCode',
        required: false,
        example: 'NG'
    }),
    _ts_param(0, (0, _common.Query)('countryCode')),
    _ts_param(1, (0, _currentuserdecorator.CurrentUser)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], KycController.prototype, "getRequirements", null);
_ts_decorate([
    (0, _common.Post)('upload/id-document'),
    (0, _allowsuspendeddecorator.AllowSuspended)(),
    (0, _swagger.ApiOperation)({
        summary: 'Upload ID document'
    }),
    (0, _swagger.ApiConsumes)('multipart/form-data'),
    (0, _common.UseInterceptors)((0, _platformexpress.FileFieldsInterceptor)([
        {
            name: 'file',
            maxCount: 1
        }
    ], {
        storage: require('multer').diskStorage({
            destination: (req, file, cb)=>{
                const path = require('path');
                const uploadPath = path.join(process.cwd(), 'uploads', 'kyc', 'id-documents');
                cb(null, uploadPath);
            },
            filename: (req, file, cb)=>{
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = require('path').extname(file.originalname);
                cb(null, `id-doc-${uniqueSuffix}${ext}`);
            }
        }),
        fileFilter: (req, file, callback)=>{
            const allowedMimeTypes = [
                'image/jpeg',
                'image/jpg',
                'image/png',
                'image/webp',
                'application/pdf'
            ];
            if (allowedMimeTypes.includes(file.mimetype)) {
                callback(null, true);
            } else {
                callback(new _common.BadRequestException('Invalid file type. Only JPEG, PNG, WEBP, and PDF files are allowed.'), false);
            }
        },
        limits: {
            fileSize: 5 * 1024 * 1024
        }
    })),
    _ts_param(0, (0, _common.UploadedFiles)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], KycController.prototype, "uploadIdDocument", null);
_ts_decorate([
    (0, _common.Post)('upload/proof-of-address'),
    (0, _allowsuspendeddecorator.AllowSuspended)(),
    (0, _swagger.ApiOperation)({
        summary: 'Upload proof of address'
    }),
    (0, _swagger.ApiConsumes)('multipart/form-data'),
    (0, _common.UseInterceptors)((0, _platformexpress.FileFieldsInterceptor)([
        {
            name: 'file',
            maxCount: 1
        }
    ], {
        storage: require('multer').diskStorage({
            destination: (req, file, cb)=>{
                const path = require('path');
                const uploadPath = path.join(process.cwd(), 'uploads', 'kyc', 'proof-of-address');
                cb(null, uploadPath);
            },
            filename: (req, file, cb)=>{
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = require('path').extname(file.originalname);
                cb(null, `proof-${uniqueSuffix}${ext}`);
            }
        }),
        fileFilter: (req, file, callback)=>{
            const allowedMimeTypes = [
                'image/jpeg',
                'image/jpg',
                'image/png',
                'image/webp',
                'application/pdf'
            ];
            if (allowedMimeTypes.includes(file.mimetype)) {
                callback(null, true);
            } else {
                callback(new _common.BadRequestException('Invalid file type. Only JPEG, PNG, WEBP, and PDF files are allowed.'), false);
            }
        },
        limits: {
            fileSize: 5 * 1024 * 1024
        }
    })),
    _ts_param(0, (0, _common.UploadedFiles)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], KycController.prototype, "uploadProofOfAddress", null);
_ts_decorate([
    (0, _common.Post)('upload/selfie'),
    (0, _allowsuspendeddecorator.AllowSuspended)(),
    (0, _swagger.ApiOperation)({
        summary: 'Upload selfie'
    }),
    (0, _swagger.ApiConsumes)('multipart/form-data'),
    (0, _common.UseInterceptors)((0, _platformexpress.FileFieldsInterceptor)([
        {
            name: 'file',
            maxCount: 1
        }
    ], {
        storage: require('multer').diskStorage({
            destination: (req, file, cb)=>{
                const path = require('path');
                const uploadPath = path.join(process.cwd(), 'uploads', 'kyc', 'selfies');
                cb(null, uploadPath);
            },
            filename: (req, file, cb)=>{
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = require('path').extname(file.originalname);
                cb(null, `selfie-${uniqueSuffix}${ext}`);
            }
        }),
        fileFilter: (req, file, callback)=>{
            const allowedMimeTypes = [
                'image/jpeg',
                'image/jpg',
                'image/png',
                'image/webp'
            ];
            if (allowedMimeTypes.includes(file.mimetype)) {
                callback(null, true);
            } else {
                callback(new _common.BadRequestException('Invalid file type. Only JPEG, PNG, and WEBP images are allowed.'), false);
            }
        },
        limits: {
            fileSize: 5 * 1024 * 1024
        }
    })),
    _ts_param(0, (0, _common.UploadedFiles)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], KycController.prototype, "uploadSelfie", null);
_ts_decorate([
    (0, _common.Post)('submit'),
    (0, _allowsuspendeddecorator.AllowSuspended)(),
    (0, _swagger.ApiOperation)({
        summary: 'Submit KYC documents'
    }),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        typeof _kycdto.SubmitKycDto === "undefined" ? Object : _kycdto.SubmitKycDto
    ]),
    _ts_metadata("design:returntype", Promise)
], KycController.prototype, "submitKyc", null);
_ts_decorate([
    (0, _common.Get)('status'),
    (0, _allowsuspendeddecorator.AllowSuspended)(),
    (0, _swagger.ApiOperation)({
        summary: 'Get KYC status'
    }),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], KycController.prototype, "getStatus", null);
_ts_decorate([
    (0, _common.Get)('all'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('SUPER_ADMIN', 'BANK_ADMIN'),
    (0, _swagger.ApiOperation)({
        summary: 'Get all KYC documents (Admin only)'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], KycController.prototype, "getAll", null);
_ts_decorate([
    (0, _common.Get)('pending'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('SUPER_ADMIN', 'BANK_ADMIN'),
    (0, _swagger.ApiOperation)({
        summary: 'Get all pending KYC (Admin only)'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], KycController.prototype, "getPending", null);
_ts_decorate([
    (0, _common.Post)('review/:id'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('SUPER_ADMIN', 'BANK_ADMIN'),
    (0, _swagger.ApiOperation)({
        summary: 'Review KYC (Admin only)'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _currentuserdecorator.CurrentUser)()),
    _ts_param(2, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object,
        typeof _kycdto.ReviewKycDto === "undefined" ? Object : _kycdto.ReviewKycDto
    ]),
    _ts_metadata("design:returntype", void 0)
], KycController.prototype, "reviewKyc", null);
KycController = _ts_decorate([
    (0, _swagger.ApiTags)('kyc'),
    (0, _common.Controller)('kyc'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _swagger.ApiBearerAuth)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _kycservice.KycService === "undefined" ? Object : _kycservice.KycService,
        typeof _uploadservice.UploadService === "undefined" ? Object : _uploadservice.UploadService
    ])
], KycController);

//# sourceMappingURL=kyc.controller.js.map