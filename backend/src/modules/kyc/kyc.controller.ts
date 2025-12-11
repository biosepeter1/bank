import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { KycService } from './kyc.service';
import { SubmitKycDto, ReviewKycDto, GetKycRequirementsDto } from './dto/kyc.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AllowSuspended } from '../../common/decorators/allow-suspended.decorator';
import { UploadService } from '../../common/upload/upload.service';

@ApiTags('kyc')
@Controller('kyc')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class KycController {
  constructor(
    private readonly kycService: KycService,
    private readonly uploadService: UploadService,
  ) {}

  @Get('requirements')
  @AllowSuspended() // Suspended users can view KYC requirements
  @ApiOperation({ summary: 'Get KYC requirements for a country' })
  @ApiQuery({ name: 'countryCode', required: false, example: 'NG' })
  async getRequirements(@Query('countryCode') countryCode?: string, @CurrentUser() user?: any) {
    // Use country code from query, or fall back to user's country
    const code = countryCode || user?.country || 'DEFAULT';
    return this.kycService.getKycRequirementsForCountry(code);
  }

  @Post('upload/id-document')
  @AllowSuspended() // Suspended users can upload KYC documents
  @ApiOperation({ summary: 'Upload ID document' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'file', maxCount: 1 }], {
      storage: require('multer').diskStorage({
        destination: (req, file, cb) => {
          const path = require('path');
          const uploadPath = path.join(process.cwd(), 'uploads', 'kyc', 'id-documents');
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = require('path').extname(file.originalname);
          cb(null, `id-doc-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        const allowedMimeTypes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/webp',
          'application/pdf',
        ];
        if (allowedMimeTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException(
              'Invalid file type. Only JPEG, PNG, WEBP, and PDF files are allowed.',
            ),
            false,
          );
        }
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadIdDocument(
    @UploadedFiles() files: { file?: Express.Multer.File[] },
  ) {
    if (!files?.file?.[0]) {
      throw new BadRequestException('No file uploaded');
    }
    return {
      url: this.uploadService.getFileUrl(`kyc/id-documents/${files.file[0].filename}`),
      filename: files.file[0].filename,
    };
  }

  @Post('upload/proof-of-address')
  @AllowSuspended() // Suspended users can upload KYC documents
  @ApiOperation({ summary: 'Upload proof of address' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'file', maxCount: 1 }], {
      storage: require('multer').diskStorage({
        destination: (req, file, cb) => {
          const path = require('path');
          const uploadPath = path.join(process.cwd(), 'uploads', 'kyc', 'proof-of-address');
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = require('path').extname(file.originalname);
          cb(null, `proof-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        const allowedMimeTypes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/webp',
          'application/pdf',
        ];
        if (allowedMimeTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException(
              'Invalid file type. Only JPEG, PNG, WEBP, and PDF files are allowed.',
            ),
            false,
          );
        }
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadProofOfAddress(
    @UploadedFiles() files: { file?: Express.Multer.File[] },
  ) {
    if (!files?.file?.[0]) {
      throw new BadRequestException('No file uploaded');
    }
    return {
      url: this.uploadService.getFileUrl(`kyc/proof-of-address/${files.file[0].filename}`),
      filename: files.file[0].filename,
    };
  }

  @Post('upload/selfie')
  @AllowSuspended() // Suspended users can upload KYC documents
  @ApiOperation({ summary: 'Upload selfie' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'file', maxCount: 1 }], {
      storage: require('multer').diskStorage({
        destination: (req, file, cb) => {
          const path = require('path');
          const uploadPath = path.join(process.cwd(), 'uploads', 'kyc', 'selfies');
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = require('path').extname(file.originalname);
          cb(null, `selfie-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        const allowedMimeTypes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/webp',
        ];
        if (allowedMimeTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException(
              'Invalid file type. Only JPEG, PNG, and WEBP images are allowed.',
            ),
            false,
          );
        }
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadSelfie(
    @UploadedFiles() files: { file?: Express.Multer.File[] },
  ) {
    if (!files?.file?.[0]) {
      throw new BadRequestException('No file uploaded');
    }
    return {
      url: this.uploadService.getFileUrl(`kyc/selfies/${files.file[0].filename}`),
      filename: files.file[0].filename,
    };
  }

  @Post('submit')
  @AllowSuspended() // Suspended users can submit KYC to get their account unsuspended
  @ApiOperation({ summary: 'Submit KYC documents' })
  async submitKyc(@CurrentUser() user: any, @Body() submitKycDto: SubmitKycDto) {
    return this.kycService.submitKyc(user.id, submitKycDto);
  }

  @Get('status')
  @AllowSuspended() // Suspended users can view their KYC status
  @ApiOperation({ summary: 'Get KYC status' })
  getStatus(@CurrentUser() user: any) {
    return this.kycService.getKycStatus(user.id);
  }

  @Get('all')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'BANK_ADMIN')
  @ApiOperation({ summary: 'Get all KYC documents (Admin only)' })
  getAll() {
    return this.kycService.getAllKyc();
  }

  @Get('pending')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'BANK_ADMIN')
  @ApiOperation({ summary: 'Get all pending KYC (Admin only)' })
  getPending() {
    return this.kycService.getAllPendingKyc();
  }

  @Post('review/:id')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'BANK_ADMIN')
  @ApiOperation({ summary: 'Review KYC (Admin only)' })
  reviewKyc(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() reviewKycDto: ReviewKycDto,
  ) {
    return this.kycService.reviewKyc(id, user.id, reviewKycDto);
  }
}
