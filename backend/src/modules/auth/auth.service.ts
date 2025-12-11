import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/reset.dto';
import { OtpService } from '../otp/otp.service';
import { EmailService } from '../../common/services/email.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private otpService: OtpService,
    private emailService: EmailService,
  ) { }

  async register(registerDto: RegisterDto) {
    // Check if user exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: registerDto.email },
          { phone: registerDto.phone },
        ],
      },
    });

    if (existingUser) {
      if (existingUser.email === registerDto.email) {
        throw new ConflictException('Email already registered');
      }
      throw new ConflictException('Phone number already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create user and wallet in a transaction
    const user = await this.prisma.$transaction(async (tx) => {
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
          accountStatus: 'PENDING', // Requires KYC approval
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
        },
      });

      // Create wallet for user with user's currency
      await tx.wallet.create({
        data: {
          userId: newUser.id,
          balance: 0,
          currency: registerDto.currency || 'NGN',
        },
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
    } catch { }

    return {
      user,
      ...tokens,
    };
  }

  async login(loginDto: LoginDto) {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Only block CLOSED and FROZEN accounts from logging in
    // SUSPENDED accounts can log in but with limited access
    if (user.accountStatus === 'CLOSED' || user.accountStatus === 'FROZEN') {
      throw new UnauthorizedException(`Account is ${user.accountStatus.toLowerCase()}. Please contact support.`);
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
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
        isEmailVerified: user.isEmailVerified,
      },
      ...tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return this.generateTokens(user.id, user.email, user.role);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async validateUser(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
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
            currency: true,
          },
        },
        kyc: {
          select: {
            status: true,
          },
        },
      },
    });
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    // Validate passwords match
    if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
      throw new BadRequestException('New passwords do not match');
    }

    // Get user with password
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Check if new password is same as current
    const isSamePassword = await bcrypt.compare(
      changePasswordDto.newPassword,
      user.password,
    );

    if (isSamePassword) {
      throw new BadRequestException('New password must be different from current password');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);

    // Update password
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Password changed successfully' };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) {
      // Avoid user enumeration
      return { message: 'If that email exists, a reset code has been sent.' };
    }

    try {
      const start = await this.otpService.start(user.id, 'RESET', {
        email: user.email,
        firstName: user.firstName,
      });

      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?email=${encodeURIComponent(user.email)}&otpId=${encodeURIComponent(start.otpId)}`;
      try {
        await this.emailService.sendPasswordResetEmail({ email: user.email, firstName: user.firstName, resetUrl });
      } catch (emailError) {
        console.error('Failed to send password reset email:', emailError);
      }
      return { message: 'If that email exists, a reset code has been sent.', otpId: start.otpId, expiresIn: start.expiresIn };
    } catch (error) {
      console.error('Forgot password error:', error);
      throw new BadRequestException('Failed to process password reset request');
    }
  }

  async resetPassword(dto: ResetPasswordDto) {
    const otp = await (this.prisma as any).otpCode.findUnique({ where: { id: dto.otpId } });
    if (!otp) throw new BadRequestException('Invalid or expired code');
    await this.otpService.verify(otp.userId, dto.otpId, dto.code);

    // Get user's current password to check for reuse
    const user = await this.prisma.user.findUnique({
      where: { id: otp.userId },
      select: { password: true },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Check if new password is same as current password
    const isSamePassword = await bcrypt.compare(dto.newPassword, user.password);
    if (isSamePassword) {
      throw new BadRequestException('New password must be different from your current password');
    }

    const hashed = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({ where: { id: otp.userId }, data: { password: hashed } });
    return { message: 'Password reset successful' };
  }

  async getUserSettings(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        emailTransactions: true,
        emailSecurity: true,
        emailMarketing: true,
        smsTransactions: true,
        smsSecurity: true,
        pushNotifications: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async updateUserSettings(
    userId: string,
    settings: {
      emailTransactions?: boolean;
      emailSecurity?: boolean;
      emailMarketing?: boolean;
      smsTransactions?: boolean;
      smsSecurity?: boolean;
      pushNotifications?: boolean;
    },
  ) {
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: settings,
      select: {
        emailTransactions: true,
        emailSecurity: true,
        emailMarketing: true,
        smsTransactions: true,
        smsSecurity: true,
        pushNotifications: true,
      },
    });

    return {
      message: 'Settings updated successfully',
      settings: updatedUser,
    };
  }

  async sendVerificationEmail(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        isEmailVerified: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    // Generate OTP
    const start = await this.otpService.start(user.id, 'EMAIL_VERIFICATION', {
      email: user.email,
      firstName: user.firstName,
    });

    // Send verification email with OTP
    try {
      await this.emailService.sendGenericNotification({
        email: user.email,
        title: '📧 Verify Your Email Address',
        message: `Hi ${user.firstName},<br><br>Thank you for registering! Please use the verification code below to confirm your email address:<br><br><div style="background:#f8fafc;padding:24px;border-radius:8px;text-align:center;margin:24px 0"><span style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#1e293b">${start.code}</span></div><br>This code will expire in <strong>${Math.floor(start.expiresIn / 60)} minutes</strong>.<br><br>If you didn't request this verification, please ignore this email.`,
        actionLabel: 'Verify Email',
        actionUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/user/profile`,
      });
    } catch (error) {
      console.error('Failed to send verification email:', error);
    }

    return {
      message: 'Verification code sent to your email',
      otpId: start.otpId,
      expiresIn: start.expiresIn,
    };
  }

  async verifyEmail(userId: string, otpId: string, code: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, isEmailVerified: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    // Verify OTP code
    await this.otpService.verify(userId, otpId, code);

    // Update user email verification status
    await this.prisma.user.update({
      where: { id: userId },
      data: { isEmailVerified: true },
    });

    return { message: 'Email verified successfully' };
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET') || 'default-secret',
        expiresIn: '7d',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'default-refresh-secret',
        expiresIn: '30d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
