import { PartialType } from "@nestjs/mapped-types";
import { CreateServiceDto } from "./create-service.dto";
import { IsArray, IsOptional, IsString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateServiceDto extends PartialType(CreateServiceDto) {
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @ApiPropertyOptional({
        type: [String],
        description:
            'Lista de URLs ou identificadores das imagens existentes que devem ser mantidas ao atualizar o serviço. Imagens não incluídas nesta lista poderão ser removidas.',
        example: ['http://localhost:4000/uploads/img1.jpg']
    })
    existingImages?: string[];
};