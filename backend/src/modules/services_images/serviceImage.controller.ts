import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { ServiceImageService } from "./serviceImage.service";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { multerConfig } from "../../configs/multer.config";
import { UpdateServiceDto } from "../services/dto/update-service.dto";
import { User } from "../users/user.entity";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Request } from "express";

@Controller("service-images")
export class ServiceImageController {
    constructor(private readonly serviceImageService: ServiceImageService) { }

    @Post(":serviceId")
    @UseInterceptors(FileInterceptor("file", multerConfig))
    async uploadImage(
        @Param("serviceId", ParseIntPipe) serviceId: number,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (!file) throw new BadRequestException("Nenhum arquivo enviado");

        const baseUrl = process.env.BASE_URL || "http://localhost:4000";
        const url = `${baseUrl}/uploads/${file.filename}`;

        return this.serviceImageService.addImage(serviceId, url);
    }

    @Get(":serviceId")
    async getImages(@Param("serviceId", ParseIntPipe) serviceId: number) {
        return this.serviceImageService.getImageByService(serviceId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(":serviceId")
    @UseInterceptors(FilesInterceptor("files", 5, multerConfig))
    async updateImages(
        @Param("serviceId", ParseIntPipe) serviceId: number,
        @UploadedFiles() files: Express.Multer.File[],
        @Body() dto: UpdateServiceDto,
        @Req() req: Request,
    ) {
        const user = req.user as User;
        return this.serviceImageService.updateImages(serviceId, dto, user, files);
    }


    @Delete(":id")
    async delete(@Param("id", ParseIntPipe) id: number) {
        return this.serviceImageService.deleteImage(id);
    }
}