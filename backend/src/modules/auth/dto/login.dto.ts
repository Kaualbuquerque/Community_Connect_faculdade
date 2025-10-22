import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
    @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
    @IsEmail({}, { message: 'O e-mail deve ser válido.' })
    @ApiProperty({
      example: 'usuario@exemplo.com',
      description: 'Endereço de e-mail do usuário para login.',
    })
    email: string;
  
    @IsNotEmpty({ message: 'A senha é obrigatória.' })
    @IsString({ message: 'A senha deve ser uma string.' })
    @ApiProperty({
      example: '12345678',
      description: 'Senha do usuário para login.',
    })
    password: string;
  }