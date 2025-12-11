import { IsNumber, IsString, IsOptional, Min, Max } from 'class-validator';

export class CreateLoanApplicationDto {
  @IsNumber()
  @Min(1000)
  amount: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsNumber()
  @Min(1)
  @Max(60)
  duration: number; // months

  @IsString()
  purpose: string;
}

export class ApproveLoanDto {
  @IsOptional()
  @IsString()
  approvalNote?: string;
}

export class RejectLoanDto {
  @IsString()
  rejectionReason: string;
}

export class CreateGrantDto {
  @IsString()
  type: 'TAX_REFUND' | 'GOVERNMENT_GRANT' | 'BUSINESS_GRANT' | 'EDUCATIONAL_GRANT';

  @IsNumber()
  @Min(1000)
  amount: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsString()
  purpose: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  documentUrls?: string[];
}
