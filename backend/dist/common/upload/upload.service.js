"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UploadService", {
    enumerable: true,
    get: function() {
        return UploadService;
    }
});
const _common = require("@nestjs/common");
const _multer = require("multer");
const _path = /*#__PURE__*/ _interop_require_wildcard(require("path"));
const _fs = /*#__PURE__*/ _interop_require_wildcard(require("fs"));
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
let UploadService = class UploadService {
    ensureUploadDir() {
        if (!_fs.existsSync(this.uploadDir)) {
            _fs.mkdirSync(this.uploadDir, {
                recursive: true
            });
        }
        // Create subdirectories for different document types
        const subdirs = [
            'kyc',
            'kyc/id-documents',
            'kyc/proof-of-address',
            'kyc/selfies'
        ];
        subdirs.forEach((subdir)=>{
            const fullPath = _path.join(this.uploadDir, subdir);
            if (!_fs.existsSync(fullPath)) {
                _fs.mkdirSync(fullPath, {
                    recursive: true
                });
            }
        });
    }
    getMulterOptions(folder) {
        return {
            storage: (0, _multer.diskStorage)({
                destination: (req, file, cb)=>{
                    const uploadPath = _path.join(this.uploadDir, folder);
                    cb(null, uploadPath);
                },
                filename: (req, file, cb)=>{
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const ext = (0, _path.extname)(file.originalname);
                    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
                }
            }),
            fileFilter: (req, file, cb)=>{
                // Allow images and PDFs only
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
        };
    }
    deleteFile(filePath) {
        try {
            const fullPath = _path.join(this.uploadDir, filePath);
            if (_fs.existsSync(fullPath)) {
                _fs.unlinkSync(fullPath);
            }
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    }
    getFileUrl(filePath) {
        // Return relative path that can be served by the backend
        return `/uploads/${filePath}`;
    }
    constructor(){
        this.uploadDir = _path.join(process.cwd(), 'uploads');
        // Ensure upload directory exists
        this.ensureUploadDir();
    }
};
UploadService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [])
], UploadService);

//# sourceMappingURL=upload.service.js.map