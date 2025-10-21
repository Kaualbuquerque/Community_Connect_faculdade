import { IsNumber } from 'class-validator';

export class CreateConversationDto {
  @IsNumber()
  participantId: number;
}
