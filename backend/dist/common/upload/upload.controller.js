"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UploadController", {
    enumerable: true,
    get: function() {
        return UploadController;
    }
});
const _common = require("@nestjs/common");
const _platformexpress = require("@nestjs/platform-express");
const _uploadservice = require("./upload.service");
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
let UploadController = class UploadController {
    async uploadFile(file) {
        if (!file) {
            throw new _common.BadRequestException('No file uploaded');
        }
        // Return the relative path for database storage
        const relativePath = `loan-proofs/${file.filename}`;
        const url = this.uploadService.getFileUrl(relativePath);
        return {
            url,
            filename: file.filename,
            originalName: file.originalname,
            size: file.size,
            mimetype: file.mimetype
        };
    }
    constructor(uploadService){
        this.uploadService = uploadService;
    }
};
_ts_decorate([
    (0, _common.Post)(),
    (0, _common.UseInterceptors)((0, _platformexpress.FileInterceptor)('file', {
        storage: require('multer').diskStorage({
            destination: (req, file, cb)=>{
                const path = require('path');
                const fs = require('fs');
                const uploadPath = path.join(process.cwd(), 'uploads', 'loan-proofs');
                // Ensure directory exists
                if (!fs.existsSync(uploadPath)) {
                    fs.mkdirSync(uploadPath, {
                        recursive: true
                    });
                }
                cb(null, uploadPath);
            },
            filename: (req, file, cb)=>{
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = require('path').extname(file.originalname);
                cb(null, `proof-${uniqueSuffix}${ext}`);
            }
        }),
        fileFilter: (req, file, cb)=>{
            const allowedMimeTypes = [
                'image/jpeg',
                'image/jpg',
                'image/png',
                'image/webp',
                'application/pdf'
            ];
            if (allowedMimeTypes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new _common.BadRequestException('Invalid file type. Only JPEG, PNG, WEBP, and PDF files are allowed.'), false);
            }
        },
        limits: {
            fileSize: 5 * 1024 * 1024
        }
    })),
    _ts_param(0, (0, _common.UploadedFile)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Express === "undefined" || typeof Express.Multer === "undefined" || typeof Express.Multer.File === "undefined" ? Object : Express.Multer.File
    ]),
    _ts_metadata("design:returntype", Promise)
], UploadController.prototype, "uploadFile", null);
UploadController = _ts_decorate([
    (0, _common.Controller)('upload'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _uploadservice.UploadService === "undefined" ? Object : _uploadservice.UploadService
    ])
], UploadController);

//# sourceMappingURL=upload.controller.js.map