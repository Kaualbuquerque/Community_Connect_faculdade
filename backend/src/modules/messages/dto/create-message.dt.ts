import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateMessageDto {
    @IsNotEmpty({ message: 'O conteúdo da mensagem não pode estar vazio.' })
    @IsString({ message: 'O conteúdo da mensagem deve ser uma string.' })
    @ApiProperty({
        example: 'Olá, gostaria de saber se você está disponível amanhã.',
        description: 'Conteúdo textual da mensagem enviada pelo usuário.',
    })
    content: string;

    @IsNotEmpty({ message: 'O ID da conversa é obrigatório.' })
    @IsNumber({}, { message: 'O ID da conversa deve ser um número.' })
    @ApiProperty({
        example: 1,
        description: 'ID da conversa à qual a mensagem pertence.',
    })
    conversationId: number;

    @IsNotEmpty({ message: 'O ID do remetente é obrigatório.' })
    @IsNumber({}, { message: 'O ID do remetente deve ser um número.' })
    @ApiProperty({
        example: 3,
        description: 'ID do usuário que está enviando a mensagem.',
    })
    senderId: number;
}