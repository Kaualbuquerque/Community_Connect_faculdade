import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateConversationDto {
  @IsNumber({}, { message: 'O ID do participante deve ser um número.' })
  @ApiProperty({
    example: 3,
    description: 'ID do usuário que será o participante da conversa.',
  })
  participantId: number;
}