import { IsNumber, IsString, IsOptional, Min } from 'class-validator';

export class CreateDepositDto {
  @IsNumber()
  @Min(100)
  amount: number;

  @IsString()
  method: 'PAYSTACK' | 'USDT' | 'BANK_TRANSFER' | 'PAYPAL';

  @IsOptional()
  @IsString()
  currency?: string;
}

export class ConfirmDepositDto {
  @IsString()
  reference: string;
}

export class UploadDepositProofDto {
  @IsString()
  proofUrl: string;

  @IsOptional()
  @IsString()
  transactionHash?: string;
}
