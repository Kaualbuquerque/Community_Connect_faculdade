import { PartialType } from "@nestjs/mapped-types";
import { CreateServiceDto } from "./create-service.dto";
import { IsArray, IsOptional, IsString } from "class-validator";

export class UpdateServiceDto extends PartialType(CreateServiceDto) {
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    existingImages?: string[];
};