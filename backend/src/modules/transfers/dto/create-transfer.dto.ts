import { IsEmail, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateTransferDto {
  @IsOptional()
  @IsEmail()
  recipientEmail?: string;

  @IsOptional()
  @IsString()
  recipientAccount?: string;

  @IsNumber()
  @Min(1)
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateInternationalTransferDto {
  @IsString()
  beneficiaryName: string;

  @IsString()
  beneficiaryAccount: string;

  @IsString()
  bankName: string;

  @IsOptional()
  @IsString()
  bankCode?: string;

  @IsOptional()
  @IsString()
  swiftCode?: string;

  @IsNumber()
  @Min(1)
  amount: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  transferCodes?: string[];
}

export class CreateBeneficiaryDto {
  @IsString()
  name: string;

  @IsString()
  accountNumber: string;

  @IsString()
  bankName: string;

  @IsOptional()
  @IsString()
  bankCode?: string;

  @IsString()
  transferType: 'INTERNAL' | 'DOMESTIC' | 'INTERNATIONAL';

  @IsOptional()
  @IsString()
  swiftCode?: string;

  @IsOptional()
  @IsString()
  iban?: string;

  @IsOptional()
  @IsString()
  country?: string;
}
