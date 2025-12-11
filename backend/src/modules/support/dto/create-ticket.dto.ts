import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';

export enum TicketCategory {
  ACCOUNT = 'Account',
  TRANSACTIONS = 'Transactions',
  CARDS = 'Cards',
  LOANS = 'Loans',
  TECHNICAL = 'Technical',
  OTHER = 'Other',
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsEnum(TicketPriority)
  @IsOptional()
  priority?: TicketPriority;
}

export class UpdateTicketDto {
  @IsEnum(TicketStatus)
  @IsOptional()
  status?: TicketStatus;

  @IsString()
  @IsOptional()
  resolution?: string;

  @IsString()
  @IsOptional()
  assignedTo?: string;
}
