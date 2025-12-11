import { IsNumber, IsPositive, IsString, IsOptional, IsEnum, IsEmail, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TransferType } from '@prisma/client';

export class DepositDto {
  @ApiProperty({ example: 1000, description: 'Amount to deposit' })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({ example: 'Salary deposit', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}

export class WithdrawDto {
  @ApiProperty({ example: 500, description: 'Amount to withdraw' })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({ example: 'Cash withdrawal', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}

export class TransferDto {
  @ApiProperty({ enum: TransferType, example: 'INTERNAL', description: 'Type of transfer' })
  @IsEnum(TransferType)
  transferType: TransferType;

  // Internal transfer fields
  @ApiProperty({ example: 'user-id-here', description: 'Recipient user ID (for INTERNAL)', required: false })
  @IsString()
  @IsOptional()
  @ValidateIf(o => o.transferType === 'INTERNAL')
  recipientId?: string;

  // External transfer fields
  @ApiProperty({ example: 'John Doe', description: 'Beneficiary name (for DOMESTIC/INTERNATIONAL)', required: false })
  @IsString()
  @IsOptional()
  @ValidateIf(o => o.transferType !== 'INTERNAL')
  beneficiaryName?: string;

  @ApiProperty({ example: '1234567890', description: 'Account number (for DOMESTIC/INTERNATIONAL)', required: false })
  @IsString()
  @IsOptional()
  @ValidateIf(o => o.transferType !== 'INTERNAL')
  beneficiaryAccount?: string;

  @ApiProperty({ example: 'Access Bank', description: 'Bank name (for DOMESTIC/INTERNATIONAL)', required: false })
  @IsString()
  @IsOptional()
  @ValidateIf(o => o.transferType !== 'INTERNAL')
  bankName?: string;

  @ApiProperty({ example: '044', description: 'Bank code (for DOMESTIC)', required: false })
  @IsString()
  @IsOptional()
  @ValidateIf(o => o.transferType === 'DOMESTIC')
  bankCode?: string;

  @ApiProperty({ example: 'ABCDEFGH', description: 'SWIFT/BIC code (for INTERNATIONAL)', required: false })
  @IsString()
  @IsOptional()
  @ValidateIf(o => o.transferType === 'INTERNATIONAL')
  swiftCode?: string;

  @ApiProperty({ example: 'GB29NWBK60161331926819', description: 'IBAN (for INTERNATIONAL)', required: false })
  @IsString()
  @IsOptional()
  @ValidateIf(o => o.transferType === 'INTERNATIONAL')
  iban?: string;

  @ApiProperty({ example: 'NG', description: 'Beneficiary country code (for DOMESTIC/INTERNATIONAL)', required: false })
  @IsString()
  @IsOptional()
  @ValidateIf(o => o.transferType !== 'INTERNAL')
  country?: string;

  // Common fields
  @ApiProperty({ example: 250, description: 'Amount to transfer' })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({ example: 'Payment for services', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
