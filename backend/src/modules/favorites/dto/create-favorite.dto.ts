import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class CreateFavoriteDto {
  @ApiProperty({
    example: 5,
    description: 'ID do serviço que será adicionado aos favoritos',
  })
  @IsNotEmpty()
  @IsNumber()
  serviceId: number;
}
