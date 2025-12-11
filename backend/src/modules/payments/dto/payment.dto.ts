import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsEmail, Min, IsArray, IsEnum } from 'class-validator';
import { PaymentMethod, PaymentProvider } from '@prisma/client';

export class InitiateDepositDto {
  @ApiProperty({ 
    description: 'Amount to deposit in Naira',
    example: 5000,
    minimum: 100
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(100, { message: 'Minimum deposit amount is ₦100' })
  amount: number;

  @ApiProperty({ 
    description: 'Payment method',
    enum: PaymentMethod,
    example: PaymentMethod.CARD
  })
  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @ApiProperty({ 
    description: 'Description for the deposit',
    example: 'Wallet top-up',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    description: 'Callback URL after payment',
    example: 'https://yourapp.com/payment/callback',
    required: false
  })
  @IsOptional()
  @IsString()
  callbackUrl?: string;
}

export class VerifyPaymentDto {
  @ApiProperty({ 
    description: 'Payment reference to verify',
    example: 'RDN_1634567890123_ABC123'
  })
  @IsNotEmpty()
  @IsString()
  reference: string;
}

export class AddBankAccountDto {
  @ApiProperty({ 
    description: 'Account holder name',
    example: 'John Doe'
  })
  @IsNotEmpty()
  @IsString()
  accountName: string;

  @ApiProperty({ 
    description: 'Bank account number',
    example: '0123456789'
  })
  @IsNotEmpty()
  @IsString()
  accountNumber: string;

  @ApiProperty({ 
    description: 'Bank name',
    example: 'Access Bank'
  })
  @IsNotEmpty()
  @IsString()
  bankName: string;

  @ApiProperty({ 
    description: 'Bank code',
    example: '044'
  })
  @IsNotEmpty()
  @IsString()
  bankCode: string;

  @ApiProperty({ 
    description: 'Set as primary account',
    example: false,
    required: false,
    default: false
  })
  @IsOptional()
  isPrimary?: boolean;
}

export class InitiateWithdrawalDto {
  @ApiProperty({ 
    description: 'Amount to withdraw in Naira',
    example: 2000,
    minimum: 500
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(500, { message: 'Minimum withdrawal amount is ₦500' })
  amount: number;

  @ApiProperty({ 
    description: 'Bank account ID to withdraw to',
    example: 'uuid-string'
  })
  @IsNotEmpty()
  @IsString()
  bankAccountId: string;

  @ApiProperty({ 
    description: 'Reason for withdrawal',
    example: 'Personal use',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class BankListResponseDto {
  @ApiProperty({ description: 'Bank name', example: 'Access Bank' })
  name: string;

  @ApiProperty({ description: 'Bank code', example: '044' })
  code: string;

  @ApiProperty({ description: 'Bank slug', example: 'access-bank' })
  slug: string;

  @ApiProperty({ description: 'Supports transfers', example: true })
  supports_transfer: boolean;
}

export class PaymentStatusResponseDto {
  @ApiProperty({ description: 'Payment ID' })
  id: string;

  @ApiProperty({ description: 'Payment reference' })
  reference: string;

  @ApiProperty({ description: 'Payment amount' })
  amount: number;

  @ApiProperty({ description: 'Payment status' })
  status: string;

  @ApiProperty({ description: 'Payment provider' })
  provider: string;

  @ApiProperty({ description: 'Payment method' })
  method: string;

  @ApiProperty({ description: 'Authorization URL', required: false })
  authorizationUrl?: string;

  @ApiProperty({ description: 'Created timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated timestamp' })
  updatedAt: Date;
}

export class BankAccountResponseDto {
  @ApiProperty({ description: 'Bank account ID' })
  id: string;

  @ApiProperty({ description: 'Account name' })
  accountName: string;

  @ApiProperty({ description: 'Account number' })
  accountNumber: string;

  @ApiProperty({ description: 'Bank name' })
  bankName: string;

  @ApiProperty({ description: 'Bank code' })
  bankCode: string;

  @ApiProperty({ description: 'Is verified' })
  isVerified: boolean;

  @ApiProperty({ description: 'Is primary account' })
  isPrimary: boolean;

  @ApiProperty({ description: 'Created timestamp' })
  createdAt: Date;
}

export class WithdrawalResponseDto {
  @ApiProperty({ description: 'Withdrawal ID' })
  id: string;

  @ApiProperty({ description: 'Withdrawal reference' })
  reference: string;

  @ApiProperty({ description: 'Withdrawal amount' })
  amount: number;

  @ApiProperty({ description: 'Processing fee' })
  fee: number;

  @ApiProperty({ description: 'Total amount (amount + fee)' })
  totalAmount: number;

  @ApiProperty({ description: 'Withdrawal status' })
  status: string;

  @ApiProperty({ description: 'Bank account details', nullable: true })
  bankAccount: BankAccountResponseDto | null;

  @ApiProperty({ description: 'Requested timestamp' })
  requestedAt: Date;

  @ApiProperty({ description: 'Processed timestamp', required: false, nullable: true })
  processedAt?: Date | null;
}

export class ResolveAccountDto {
  @ApiProperty({ 
    description: 'Bank account number',
    example: '0123456789'
  })
  @IsNotEmpty()
  @IsString()
  accountNumber: string;

  @ApiProperty({ 
    description: 'Bank code',
    example: '044'
  })
  @IsNotEmpty()
  @IsString()
  bankCode: string;
}

export class ResolveAccountResponseDto {
  @ApiProperty({ description: 'Account number' })
  accountNumber: string;

  @ApiProperty({ description: 'Account name' })
  accountName: string;

  @ApiProperty({ description: 'Bank ID' })
  bankId: number;
}