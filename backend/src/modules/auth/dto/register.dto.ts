import { IsEmail, IsString, MinLength, MaxLength, Matches, IsPhoneNumber, IsOptional, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+2348012345678' })
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @ApiProperty({ example: 'johndoe', required: false })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(30)
  username?: string;

  @ApiProperty({ example: 'savings', required: false, enum: ['savings', 'checking'] })
  @IsString()
  @IsOptional()
  accountType?: string;

  @ApiProperty({ example: '1234', required: false })
  @IsString()
  @IsOptional()
  @Length(4, 4)
  transactionPin?: string;

  @ApiProperty({
    example: 'Password@123',
    description: 'Password must contain uppercase, lowercase, number and special character'
  })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    { message: 'Password must contain uppercase, lowercase, number and special character' }
  )
  password: string;

  @ApiProperty({ 
    example: 'NG',
    description: 'ISO country code (NG, US, GB, etc.)'
  })
  @IsString()
  @IsOptional()
  @Length(2, 2)
  country?: string;

  @ApiProperty({ 
    example: 'NGN',
    description: 'Currency code (NGN, USD, GBP, etc.)'
  })
  @IsString()
  @IsOptional()
  @Length(3, 3)
  currency?: string;
}
