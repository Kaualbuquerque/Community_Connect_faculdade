import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateFavoriteDto {
    @IsNotEmpty({ message: 'O ID do serviço é obrigatório.' })
    @IsNumber({}, { message: 'O ID do serviço deve ser um número.' })
    @ApiProperty({
      example: 10,
      description: 'ID do serviço que o usuário deseja adicionar aos favoritos.',
    })
    serviceId: number;
  }