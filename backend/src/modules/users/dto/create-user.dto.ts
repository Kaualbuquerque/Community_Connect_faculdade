import { ApiProperty } from "@nestjs/swagger";
import {
    IsEmail,
    IsIn,
    IsNotEmpty,
    IsString,
    Matches,
    Length,
} from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        example: "José Hugo",
        description: "Nome completo do usuário que será cadastrado."
    })
    name: string;

    @IsEmail()
    @ApiProperty({
        example: "joseHugo@exemplo.com",
        description: "Endereço de email válido do usuário. Será utilizado no login."
    })
    email: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        example: "00000000",
        description: "Senha de acesso do usuário. Deve conter ao menos 8 caracteres."
    })
    password: string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^\(?\d{2}\)?[\s\-]?\d{4,5}[\s\-]?\d{4}$/, {
        message: "O telefone deve estar no formato brasileiro (e.g. (81) 91234-5678)",
    })
    @ApiProperty({
        example: "(81) 91234-5678",
        description: "Número de telefone do usuário no formato brasileiro."
    })
    phone: string;

    @IsNotEmpty()
    @IsIn(["consumer", "provider"])
    @ApiProperty({
        example: "provider",
        description: "Tipo de usuário. Pode ser 'consumer' (consumidor) ou 'provider' (provedor de serviços)."
    })
    role: "consumer" | "provider";

    // Novos campos de endereço

    @IsNotEmpty()
    @Matches(/^\d{5}-\d{3}$/, {
        message: "O CEP deve estar no formato 00000-000.",
    })
    @ApiProperty({
        example: "00000-000",
        description: "CEP do endereço do usuário, no formato 00000-000."
    })
    cep: string;

    @IsNotEmpty()
    @IsString()
    @Length(2, 2, {
        message: "O estado deve conter exatamente 2 letras (e.g. SP, RJ)",
    })
    @ApiProperty({
        example: "PE",
        description: "Sigla do estado do endereço do usuário, composta por 2 letras."
    })
    state: string;

    @IsNotEmpty()
    @IsString()
    @Length(1, 100, { message: 'A cidade deve ter entre 1 e 100 caracteres.' })
    @ApiProperty({
        example: "Recife",
        description: "Nome da cidade do endereço do usuário."
    })
    city: string;

    @IsNotEmpty()
    @IsString()
    @Length(1, 20, { message: 'O número deve ter entre 1 e 20 caracteres.' })
    @ApiProperty({
        example: "123",
        description: "Número do endereço (residência ou estabelecimento) do usuário."
    })
    number: string;
}
