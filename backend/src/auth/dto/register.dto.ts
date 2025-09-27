// src/modules/auth/dto/register.dto.ts
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength,
    IsIn,
    Matches,
    Length,
  } from 'class-validator';
  
  export class RegisterDto {
    @IsNotEmpty()
    @IsString()
    name: string;
  
    @IsEmail()
    email: string;
  
    @IsNotEmpty()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;
  
    @IsNotEmpty()
    @Matches(/^\(?\d{2}\)?[\s\-]?\d{4,5}[\s\-]?\d{4}$/, {
      message: 'Phone number must be a valid Brazilian format (e.g. (81) 91234-5678)',
    })
    phone: string;
  
    @IsNotEmpty()
    @IsIn(['consumer', 'provider'])
    role: 'consumer' | 'provider';
  
    // Novos campos de endereço
  
    @IsNotEmpty()
    @Matches(/^\d{5}-\d{3}$/, {
      message: 'CEP must be in the format 12345-678',
    })
    cep: string;
  
    @IsNotEmpty()
    @IsString()
    @Length(2, 2, { message: 'State must be a 2-letter code (e.g. SP)' })
    state: string;
  
    @IsNotEmpty()
    @IsString()
    @Length(1, 100, { message: 'City must be between 1 and 100 characters' })
    city: string;
  
    @IsNotEmpty()
    @IsString()
    @Length(1, 20, { message: 'Number must be between 1 and 20 characters' })
    number: string;
  }
  