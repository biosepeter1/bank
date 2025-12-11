import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EmailService } from '../../common/services/email.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);
  private readonly TTL_SECONDS = 5 * 60; // 5 minutes

  constructor(private prisma: PrismaService, private email: EmailService) { }

  private generateCode(): string {
    // 6-digit numeric
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async start(userId: string, purpose: string, metadata?: Record<string, any>) {
    const code = this.generateCode();
    const codeHash = await bcrypt.hash(code, 10);
    const expiresAt = new Date(Date.now() + this.TTL_SECONDS * 1000);

    let otp;
    try {
      otp = await (this.prisma as any).otpCode.create({
        data: {
          userId,
          purpose,
          codeHash,
          expiresAt,
          metadata: metadata as any,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to create OTP code: ${error.message}`, error.stack);
      throw error;
    }

    // Send via email
    try {
      const user = await (this.prisma as any).user.findUnique({ where: { id: userId } });
      await this.email.sendOtpEmail({
        email: user?.email || metadata?.email || 'user@local',
        firstName: user?.firstName || metadata?.firstName || 'User',
        code,
        purpose: purpose,
      });
    } catch (e) {
      // We only log here; in production wire a dedicated template
      this.logger.warn(`Email send failed or stubbed: ${e?.message || e}`);
    }

    return { otpId: otp.id, code, expiresIn: this.TTL_SECONDS };
  }

  async verify(userId: string, otpId: string, code: string) {
    const otp = await (this.prisma as any).otpCode.findUnique({ where: { id: otpId } });
    if (!otp || otp.userId !== userId) {
      throw new NotFoundException('OTP not found');
    }
    if (otp.usedAt) {
      throw new BadRequestException('OTP already used');
    }
    if (otp.expiresAt < new Date()) {
      throw new BadRequestException('OTP expired');
    }
    if (otp.attempts >= 5) {
      throw new BadRequestException('Too many attempts');
    }

    const ok = await bcrypt.compare(code, otp.codeHash);
    await (this.prisma as any).otpCode.update({
      where: { id: otpId },
      data: { attempts: { increment: 1 }, usedAt: ok ? new Date() : null },
    });

    if (!ok) throw new BadRequestException('Invalid code');

    return { success: true };
  }
}
