import { IsDateString, IsNotEmpty, IsNumber} from "class-validator";

export class CreateHistoryDto {

    @IsNotEmpty()
    @IsDateString()
    usedAt?: string;

    @IsNotEmpty()
    @IsNumber()
    consumerId: number;

    @IsNotEmpty()
    @IsNumber()
    serviceId: number;
}