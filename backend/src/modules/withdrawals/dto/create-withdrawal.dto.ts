import { IsNumber, IsString, Min, IsOptional } from 'class-validator';

export class CreateWithdrawalDto {
  @IsNumber()
  @Min(100)
  amount: number;

  @IsString()
  withdrawalMethod: 'BANK_TRANSFER' | 'WALLET' | 'CRYPTO';

  @IsString()
  accountNumber: string;

  @IsString()
  bankCode: string;

  @IsString()
  accountName: string;

  @IsOptional()
  @IsString()
  narration?: string;
}

export class ApproveWithdrawalDto {
  @IsString()
  withdrawalId: string;
}

export class RejectWithdrawalDto {
  @IsString()
  withdrawalId: string;

  @IsString()
  reason: string;
}
