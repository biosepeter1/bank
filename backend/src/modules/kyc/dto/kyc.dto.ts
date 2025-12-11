import { IsString, IsOptional, IsDateString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubmitKycDto {
  @ApiProperty({ example: '1990-01-15', description: 'Date of birth in YYYY-MM-DD format' })
  @IsDateString()
  dateOfBirth: string;

  @ApiProperty({ example: '123 Main Street' })
  @IsString()
  address: string;

  @ApiProperty({ example: 'Lagos' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'Lagos', required: false })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty({ example: 'NG', description: 'ISO 3166-1 alpha-2 country code' })
  @IsString()
  country: string;

  @ApiProperty({ example: '100001', required: false })
  @IsString()
  @IsOptional()
  postalCode?: string;

  @ApiProperty({ 
    example: 'NIN',
    description: 'ID type (e.g., NIN, PASSPORT, DRIVERS_LICENSE, etc.)'
  })
  @IsString()
  idType: string;

  @ApiProperty({ example: '12345678901' })
  @IsString()
  idNumber: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  idDocumentUrl?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  proofOfAddressUrl?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  selfieUrl?: string;
}

export class ReviewKycDto {
  @ApiProperty({ 
    example: 'APPROVED', 
    enum: ['APPROVED', 'REJECTED', 'RESUBMIT_REQUIRED', 'UNDER_REVIEW']
  })
  @IsString()
  @IsIn(['APPROVED', 'REJECTED', 'RESUBMIT_REQUIRED', 'UNDER_REVIEW'])
  status: 'APPROVED' | 'REJECTED' | 'RESUBMIT_REQUIRED' | 'UNDER_REVIEW';

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  rejectionReason?: string;
}

export class GetKycRequirementsDto {
  @ApiProperty({ 
    example: 'NG', 
    description: 'ISO 3166-1 alpha-2 country code',
    required: false
  })
  @IsString()
  @IsOptional()
  countryCode?: string;
}
