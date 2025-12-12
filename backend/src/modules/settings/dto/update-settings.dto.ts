import { IsOptional, IsString, IsBoolean, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

class GeneralSettingsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  siteName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  siteDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  favicon?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  supportEmail?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  supportPhone?: string;

  @ApiPropertyOptional({ description: 'Bank name (e.g., First Bank of Nigeria, UBA, Zenith Bank)' })
  @IsOptional()
  @IsString()
  bankName?: string;

  @ApiPropertyOptional({ description: 'Bank code (e.g., 011 for First Bank, 033 for UBA)' })
  @IsOptional()
  @IsString()
  bankCode?: string;

  @ApiPropertyOptional({ description: 'Primary brand color (hex code e.g., #4F46E5)' })
  @IsOptional()
  @IsString()
  brandPrimaryColor?: string;

  @ApiPropertyOptional({ description: 'Secondary brand color (hex code e.g., #7C3AED)' })
  @IsOptional()
  @IsString()
  brandSecondaryColor?: string;
}

class PaymentSettingsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  usdtWalletAddress?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  btcWalletAddress?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bankName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  accountNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  accountName?: string;
}

class SecuritySettingsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  enableTransferCodes?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  enableTwoFactor?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  maxLoginAttempts?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  sessionTimeout?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  requireKycForTransactions?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  requireKycForCards?: boolean;
}

class NotificationSettingsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  smsNotifications?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  pushNotifications?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  transactionAlerts?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  securityAlerts?: boolean;
}

class LimitSettingsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  minDeposit?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  maxDeposit?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  minWithdrawal?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  maxWithdrawal?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  minTransfer?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  maxTransfer?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  dailyTransferLimit?: number;
}

class EmailSettingsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  provider?: string; // SMTP, SES, SENDGRID, etc.

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  smtpHost?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  smtpPort?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  smtpUser?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  smtpPass?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fromAddress?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fromName?: string;
}

export class UpdateSettingsDto {
  @ApiPropertyOptional({ type: GeneralSettingsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => GeneralSettingsDto)
  general?: GeneralSettingsDto;

  @ApiPropertyOptional({ type: PaymentSettingsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => PaymentSettingsDto)
  payment?: PaymentSettingsDto;

  @ApiPropertyOptional({ type: SecuritySettingsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => SecuritySettingsDto)
  security?: SecuritySettingsDto;

  @ApiPropertyOptional({ type: NotificationSettingsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => NotificationSettingsDto)
  notifications?: NotificationSettingsDto;

  @ApiPropertyOptional({ type: LimitSettingsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => LimitSettingsDto)
  limits?: LimitSettingsDto;

  @ApiPropertyOptional({ type: EmailSettingsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => EmailSettingsDto)
  email?: EmailSettingsDto;
}
