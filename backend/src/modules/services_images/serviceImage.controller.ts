import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { ServiceImageService } from "./serviceImage.service";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { multerConfig } from "src/configs/multer.config";
import { UpdateServiceDto } from "../services/dto/update-service.dto";
import { User } from "../users/user.entity";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Request } from "express";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";

@Controller("service-images")
export class ServiceImageController {
    constructor(private readonly serviceImageService: ServiceImageService) { }

    @Post(":serviceId")
    @UseInterceptors(FileInterceptor("file", multerConfig))
    @ApiOperation({
        summary: 'Faz upload de uma imagem para um serviço',
        description: 'Faz upload de uma imagem vinculada a um serviço específico pelo seu ID.',
    })
    @ApiParam({ name: 'serviceId', example: 1, description: 'ID do serviço' })
    @ApiResponse({ status: 200, description: 'Imagem salva com sucesso.' })
    @ApiResponse({ status: 400, description: 'Nenhum arquivo enviado ou arquivo inválido.' })
    @ApiResponse({ status: 404, description: 'Serviço não encontrado.' })
    async uploadImage(
        @Param("serviceId") serviceId: number,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (!file) throw new BadRequestException("Nenhum arquivo enviado");

        const baseUrl = process.env.BASE_URL || "http://localhost:4000";
        const url = `${baseUrl}/uploads/${file.filename}`;

        return this.serviceImageService.addImage(serviceId, url);
    }

    @Get(":serviceId")
    @ApiOperation({
        summary: 'Busca todas as imagens de um serviço',
        description: 'Retorna todas as imagens associadas a um serviço pelo seu ID.',
    })
    @ApiParam({ name: 'serviceId', example: 1, description: 'ID do serviço' })
    @ApiResponse({ status: 200, description: 'Imagens retornadas com sucesso.' })
    @ApiResponse({ status: 404, description: 'Serviço não encontrado.' })
    async getImages(@Param("serviceId") serviceId: number) {
        return this.serviceImageService.getImageByService(serviceId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(":serviceId")
    @UseInterceptors(FilesInterceptor("files", 5, multerConfig))
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Atualiza as imagens de um serviço',
        description: 'Substitui as imagens existentes de um serviço pelo seu ID. Até 5 imagens podem ser enviadas por vez.',
    })
    @ApiParam({ name: 'serviceId', example: 1, description: 'ID do serviço' })
    @ApiResponse({ status: 200, description: 'Imagens atualizadas com sucesso.' })
    @ApiResponse({ status: 400, description: 'Arquivos inválidos ou nenhum arquivo enviado.' })
    @ApiResponse({ status: 401, description: 'Usuário não autenticado.' })
    @ApiResponse({ status: 404, description: 'Serviço não encontrado.' })
    async updateImages(
        @Param("serviceId") serviceId: number,
        @UploadedFiles() files: Express.Multer.File[],
        @Body() dto: UpdateServiceDto,
        @Req() req: Request,
    ) {
        const user = req.user as User;
        return this.serviceImageService.updateImages(serviceId, dto, user, files);
    }


    @Delete(":id")
    @UseInterceptors(FilesInterceptor("files", 5, multerConfig))
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Remove uma imagem de um serviço',
        description: 'Remove uma imagem específica de um serviço pelo seu ID.',
    })
    @ApiParam({ name: 'id', example: 1, description: 'ID da imagem' })
    @ApiResponse({ status: 200, description: 'Imagem removida com sucesso.' })
    @ApiResponse({ status: 401, description: 'Usuário não autenticado.' })
    @ApiResponse({ status: 404, description: 'Imagem não encontrada.' })
    async delete(@Param("id") id: number) {
        return this.serviceImageService.deleteImage(id);
    }
}