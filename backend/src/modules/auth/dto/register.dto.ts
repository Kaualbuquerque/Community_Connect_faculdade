import { ApiProperty } from '@nestjs/swagger';
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
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  @IsString({ message: 'O nome deve ser uma string.' })
  @ApiProperty({
    example: 'José Hugo',
    description: 'Nome completo do usuário.',
  })
  name: string;

  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  @IsEmail({}, { message: 'O e-mail deve ser válido.' })
  @ApiProperty({
    example: 'joseHugo@exemplo.com',
    description: 'Endereço de e-mail do usuário.',
  })
  email: string;

  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  @ApiProperty({
    example: '12345678',
    description: 'Senha do usuário (mínimo 6 caracteres).',
  })
  password: string;

  @IsNotEmpty({ message: 'O telefone é obrigatório.' })
  @Matches(/^\(?\d{2}\)?[\s\-]?\d{4,5}[\s\-]?\d{4}$/, {
    message: 'O telefone deve estar em formato brasileiro válido (ex: (81) 91234-5678).',
  })
  @ApiProperty({
    example: '(81) 901234-5678',
    description: 'Número de telefone do usuário no formato brasileiro.',
  })
  phone: string;

  @IsNotEmpty({ message: 'O perfil do usuário é obrigatório.' })
  @IsIn(['consumer', 'provider'], { message: 'O perfil deve ser "consumer" ou "provider".' })
  @ApiProperty({
    example: 'provider',
    description: 'Tipo de usuário: "consumer" para consumidor ou "provider" para prestador de serviço.',
  })
  role: 'consumer' | 'provider';

  // Campos de endereço

  @IsNotEmpty({ message: 'O CEP é obrigatório.' })
  @Matches(/^\d{5}-\d{3}$/, { message: 'O CEP deve estar no formato 12345-678.' })
  @ApiProperty({
    example: '01234-567',
    description: 'CEP do endereço do usuário.',
  })
  cep: string;

  @IsNotEmpty({ message: 'O estado é obrigatório.' })
  @IsString({ message: 'O estado deve ser uma string.' })
  @Length(2, 2, { message: 'O estado deve ter 2 letras (ex: SP).' })
  @ApiProperty({
    example: 'PE',
    description: 'Sigla do estado do endereço do usuário.',
  })
  state: string;

  @IsNotEmpty({ message: 'A cidade é obrigatória.' })
  @IsString({ message: 'A cidade deve ser uma string.' })
  @Length(1, 100, { message: 'A cidade deve ter entre 1 e 100 caracteres.' })
  @ApiProperty({
    example: 'Recife',
    description: 'Cidade do endereço do usuário.',
  })
  city: string;

  @IsNotEmpty({ message: 'O número do endereço é obrigatório.' })
  @IsString({ message: 'O número deve ser uma string.' })
  @Length(1, 20, { message: 'O número deve ter entre 1 e 20 caracteres.' })
  @ApiProperty({
    example: '123',
    description: 'Número do endereço do usuário.',
  })
  number: string;
}
