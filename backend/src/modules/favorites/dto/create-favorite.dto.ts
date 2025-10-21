import { IsNotEmpty, IsNumber } from "class-validator";

export default class CreateFavoriteDto {
    @IsNotEmpty()
    @IsNumber()
    serviceId: number;
}