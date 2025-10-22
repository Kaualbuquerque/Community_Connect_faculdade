import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateNoteDto {
    @IsNotEmpty({ message: 'O conteúdo da nota não pode estar vazio.' })
    @IsString({ message: 'O conteúdo da nota deve ser uma string.' })
    @ApiProperty({
        example: 'Comprar tintas para o projeto de pintura da cozinha.',
        description: 'Conteúdo textual da nota criada pelo usuário.',
    })
    content: string;
}