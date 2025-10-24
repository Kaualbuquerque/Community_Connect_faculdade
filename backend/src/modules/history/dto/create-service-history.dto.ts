import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsNumber } from "class-validator";

export class CreateHistoryDto {
    @IsNotEmpty({ message: 'A data de utilização é obrigatória.' })
    @IsDateString()
    @ApiProperty({
        example: '2025-10-22T15:00:00Z',
        description: 'Data e hora em que o serviço foi utilizado.',
    })
    usedAt: string;

    @IsNotEmpty({ message: 'O ID do consumidor é obrigatório.' })
    @IsNumber({}, { message: 'O ID do consumidor deve ser um número.' })
    @ApiProperty({
        example: 2,
        description: 'ID do usuário que consumiu o serviço.',
    })
    consumerId: number;

    @IsNotEmpty({ message: 'O ID do serviço é obrigatório.' })
    @IsNumber({}, { message: 'O ID do serviço deve ser um número.' })
    @ApiProperty({
        example: 5,
        description: 'ID do serviço que foi utilizado.',
    })
    serviceId: number;
}