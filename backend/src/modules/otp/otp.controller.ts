import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OtpService } from './otp.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

import { IsIn, IsObject, IsOptional, IsString } from 'class-validator';

class StartOtpDto {
  @IsOptional()
  @IsString()
  @IsIn(['TRANSFER', 'LOGIN', 'WITHDRAWAL'])
  purpose?: 'TRANSFER' | 'LOGIN' | 'WITHDRAWAL';

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

class VerifyOtpDto {
  @IsString()
  otpId: string;

  @IsString()
  code: string; // 6 digits
}

@ApiTags('otp')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('start')
  @ApiOperation({ summary: 'Start an OTP flow (email-based)' })
  async start(@CurrentUser() user: any, @Body() dto: StartOtpDto) {
    const result = await this.otpService.start(user.id, dto.purpose || 'TRANSFER', dto.metadata);
    return result; // { otpId, expiresIn }
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify an OTP code' })
  async verify(@CurrentUser() user: any, @Body() dto: VerifyOtpDto) {
    return this.otpService.verify(user.id, dto.otpId, dto.code);
  }
}
