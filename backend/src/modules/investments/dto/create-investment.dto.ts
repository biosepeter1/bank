import { IsNumber, IsString, Min } from 'class-validator';

export class CreateInvestmentDto {
  @IsNumber()
  @Min(1000)
  amount: number;

  @IsString()
  planType: 'BASIC' | 'STANDARD' | 'PREMIUM' | 'VIP';
}

export class LiquidateInvestmentDto {
  @IsString()
  investmentId: string;
}
