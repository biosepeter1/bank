import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class ContactFormDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsOptional()
    subject?: string;

    @IsString()
    @IsOptional()
    category?: string;

    @IsString()
    @IsNotEmpty()
    message: string;
}
