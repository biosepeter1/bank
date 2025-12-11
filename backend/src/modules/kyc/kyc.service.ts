import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SubmitKycDto, ReviewKycDto } from './dto/kyc.dto';
import { EmailService } from '../../common/services/email.service';
import {
  getKycRequirements,
  validateIdNumber,
  calculateAge,
  KycCountryRequirement,
} from './config/kyc-country.config';

@Injectable()
export class KycService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async getKycRequirementsForCountry(countryCode: string): Promise<KycCountryRequirement> {
    return getKycRequirements(countryCode);
  }

  async submitKyc(userId: string, submitKycDto: SubmitKycDto) {
    // Get user to check their country
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get country requirements
    const requirements = getKycRequirements(submitKycDto.country || user.country);

    // Validate age
    const dob = new Date(submitKycDto.dateOfBirth);
    const age = calculateAge(dob);
    if (age < requirements.minAge) {
      throw new BadRequestException(
        `You must be at least ${requirements.minAge} years old to register`,
      );
    }

    // Validate ID number format (if applicable)
    const idValidation = validateIdNumber(
      submitKycDto.country || user.country,
      submitKycDto.idType,
      submitKycDto.idNumber,
    );

    if (!idValidation.valid) {
      throw new BadRequestException(idValidation.error);
    }

    // Validate required fields based on country
    if (requirements.addressFields.state && !submitKycDto.state) {
      throw new BadRequestException('State is required for your country');
    }

    if (requirements.addressFields.postalCode && !submitKycDto.postalCode) {
      throw new BadRequestException('Postal code is required for your country');
    }

    // Validate required documents
    if (requirements.requiredDocuments.idDocument && !submitKycDto.idDocumentUrl) {
      throw new BadRequestException('ID document is required');
    }

    if (requirements.requiredDocuments.proofOfAddress && !submitKycDto.proofOfAddressUrl) {
      throw new BadRequestException('Proof of address is required');
    }

    if (requirements.requiredDocuments.selfie && !submitKycDto.selfieUrl) {
      throw new BadRequestException('Selfie is required');
    }

    // Check if ID type is valid for the country
    const validIdTypes = requirements.idTypes.map((t) => t.value);
    if (!validIdTypes.includes(submitKycDto.idType)) {
      throw new BadRequestException(
        `Invalid ID type for ${requirements.country}. Valid types: ${validIdTypes.join(', ')}`,
      );
    }

    // Check if KYC already exists
    const existing = await this.prisma.kYC.findUnique({
      where: { userId },
    });

    if (existing) {
      // Only allow updates if status is PENDING or RESUBMIT_REQUIRED
      if (!['PENDING', 'RESUBMIT_REQUIRED', 'REJECTED'].includes(existing.status)) {
        throw new BadRequestException(
          'KYC already submitted and is under review or approved',
        );
      }

      // Update existing KYC
      return this.prisma.kYC.update({
        where: { userId },
        data: {
          ...submitKycDto,
          dateOfBirth: dob,
          status: 'PENDING',
          submittedAt: new Date(),
          rejectionReason: null, // Clear previous rejection reason
        },
      });
    }

    // Create new KYC
    return this.prisma.kYC.create({
      data: {
        userId,
        ...submitKycDto,
        dateOfBirth: dob,
        status: 'PENDING',
        submittedAt: new Date(),
      },
    });
  }

  async getKycStatus(userId: string) {
    const kyc = await this.prisma.kYC.findUnique({
      where: { userId },
    });

    if (!kyc) {
      return { status: 'NOT_SUBMITTED', message: 'KYC not submitted yet' };
    }

    return kyc;
  }

  async getAllKyc() {
    return this.prisma.kYC.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
      orderBy: { submittedAt: 'desc' },
    });
  }

  async getAllPendingKyc() {
    return this.prisma.kYC.findMany({
      where: {
        status: 'PENDING',
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
      orderBy: { submittedAt: 'desc' },
    });
  }

  async reviewKyc(kycId: string, reviewerId: string, reviewKycDto: ReviewKycDto) {
    const kyc = await this.prisma.kYC.findUnique({
      where: { id: kycId },
    });

    if (!kyc) {
      throw new NotFoundException('KYC not found');
    }

    // Update KYC status
    const updated = await this.prisma.kYC.update({
      where: { id: kycId },
      data: {
        status: reviewKycDto.status,
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
        rejectionReason: reviewKycDto.rejectionReason,
      },
    });

    // Fetch user details for email
    const user = await this.prisma.user.findUnique({
      where: { id: kyc.userId },
      select: { email: true, firstName: true, accountStatus: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update user account status and send notifications based on KYC review
    if (reviewKycDto.status === 'APPROVED') {
      // Activate user account when KYC is approved
      await this.prisma.user.update({
        where: { id: kyc.userId },
        data: { accountStatus: 'ACTIVE' },
      });

      // Create in-app notification
      await this.prisma.notification.create({
        data: {
          userId: kyc.userId,
          title: 'KYC Approved',
          message: 'Your KYC verification has been approved. Your account is now active!',
          type: 'SUCCESS',
        },
      });

      // Send email notification (non-blocking)
      try {
        await this.emailService.sendKycStatusEmail({
          email: user.email,
          firstName: user.firstName,
          status: 'APPROVED',
        });
      } catch (error) {
        console.error('Failed to send KYC approval email:', error);
      }
    } else if (reviewKycDto.status === 'REJECTED') {
      // Suspend user account when KYC is rejected
      await this.prisma.user.update({
        where: { id: kyc.userId },
        data: { accountStatus: 'SUSPENDED' },
      });

      // Create in-app notification
      await this.prisma.notification.create({
        data: {
          userId: kyc.userId,
          title: 'KYC Rejected',
          message: `Your KYC verification has been rejected. Reason: ${reviewKycDto.rejectionReason || 'Please contact support for more information.'}`,
          type: 'ERROR',
        },
      });

      // Send email notification (non-blocking)
      try {
        await this.emailService.sendKycStatusEmail({
          email: user.email,
          firstName: user.firstName,
          status: 'REJECTED',
          reason: reviewKycDto.rejectionReason,
        });
      } catch (error) {
        console.error('Failed to send KYC rejection email:', error);
      }
    } else if (reviewKycDto.status === 'RESUBMIT_REQUIRED') {
      // Keep account as PENDING when resubmission is required
      await this.prisma.user.update({
        where: { id: kyc.userId },
        data: { accountStatus: 'PENDING' },
      });

      // Create in-app notification
      await this.prisma.notification.create({
        data: {
          userId: kyc.userId,
          title: 'KYC Resubmission Required',
          message: `Please resubmit your KYC documents. ${reviewKycDto.rejectionReason || ''}`,
          type: 'WARNING',
        },
      });

      // Send email notification (non-blocking)
      try {
        await this.emailService.sendKycStatusEmail({
          email: user.email,
          firstName: user.firstName,
          status: 'RESUBMIT_REQUIRED',
          reason: reviewKycDto.rejectionReason,
        });
      } catch (error) {
        console.error('Failed to send KYC resubmission email:', error);
      }
    }

    // Create audit log
    const reviewer = await this.prisma.user.findUnique({ where: { id: reviewerId } });
    if (!reviewer) {
      throw new NotFoundException('Reviewer user not found');
    }
    await this.prisma.auditLog.create({
      data: {
        userId: reviewerId,
        actorEmail: reviewer.email,
        actorRole: reviewer.role,
        action: reviewKycDto.status === 'APPROVED' ? 'KYC_APPROVED' : 'KYC_REJECTED',
        entity: 'KYC',
        entityId: kycId,
        description: `Admin ${reviewKycDto.status.toLowerCase()} KYC for user ${kyc.userId}`,
        metadata: reviewKycDto.rejectionReason ? { rejectionReason: reviewKycDto.rejectionReason } : undefined,
      },
    });

    return updated;
  }
}
