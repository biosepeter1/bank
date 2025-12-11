import { IsEmail, IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AccountStatus, KYCStatus } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '+2348012345678' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'johndoe', required: false })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({ example: 'SecurePass123!' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: '1234', required: false })
  @IsString()
  @IsOptional()
  transactionPin?: string;

  @ApiProperty({ example: 'savings', required: false })
  @IsString()
  @IsOptional()
  accountType?: string;

  @ApiProperty({ example: 1000.00, required: false })
  @IsNumber()
  @IsOptional()
  initialBalance?: number;

  @ApiProperty({ example: 'NG', required: false })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({ example: 'NGN', required: false })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({ enum: AccountStatus, example: AccountStatus.ACTIVE, required: false })
  @IsEnum(AccountStatus)
  @IsOptional()
  accountStatus?: AccountStatus;

  @ApiProperty({ enum: KYCStatus, example: KYCStatus.PENDING, required: false })
  @IsEnum(KYCStatus)
  @IsOptional()
  kycStatus?: KYCStatus;
}

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({ enum: AccountStatus, required: false })
  @IsEnum(AccountStatus)
  @IsOptional()
  accountStatus?: AccountStatus;
}

export class UpdateBalanceDto {
  @ApiProperty({ example: 1000.00 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ example: 'Initial deposit' })
  @IsString()
  @IsNotEmpty()
  reason: string;
}

export class UpdateKycStatusDto {
  @ApiProperty({ enum: KYCStatus, example: KYCStatus.APPROVED })
  @IsEnum(KYCStatus)
  @IsNotEmpty()
  status: KYCStatus;

  @ApiProperty({ example: 'Documents verified', required: false })
  @IsString()
  @IsOptional()
  reason?: string;
}

export class AdminUpdateTransferCodeDto {
  @ApiProperty({ example: 'ABC123456' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 50.00, required: false })
  @IsNumber()
  @IsOptional()
  amount?: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  isVerified?: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
