import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ServiceImage } from "./serviceImage.entity";
import { Service } from "../services/service.entity";
import { ServiceImageController } from "./serviceImage.controller";
import { ServiceImageService } from "./serviceImage.service";

@Module({
    imports: [TypeOrmModule.forFeature([ServiceImage, Service])],
    controllers: [ServiceImageController],
    providers: [ServiceImageService],
    exports: [ServiceImageService], // opcional — se for usado em outro módulo
  })
  export class ServiceImageModule {}