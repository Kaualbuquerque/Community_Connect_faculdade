import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ServiceImageService } from "./serviceImage.service";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { UpdateServiceDto } from "../services/dto/update-service.dto";
import { User } from "../users/user.entity";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Request } from "express";

@ApiTags("Service Images")
@ApiBearerAuth()
@Controller("service-images")
export class ServiceImageController {
  constructor(private readonly serviceImageService: ServiceImageService) {}

  @Post(":serviceId")
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: "Faz upload de uma imagem para um serviço específico" })
  @ApiParam({ name: "serviceId", example: 1, description: "ID do serviço" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({ schema: { type: "object", properties: { file: { type: "string", format: "binary" } } } })
  @ApiResponse({ status: 201, description: "Imagem enviada com sucesso" })
  @ApiResponse({ status: 400, description: "Nenhum arquivo enviado ou arquivo inválido" })
  async uploadImage(
    @Param("serviceId", ParseIntPipe) serviceId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException("Nenhum arquivo enviado");
    }
    const image = await this.serviceImageService.addImage(serviceId, file);
    return { id: image.id, url: image.url, position: image.position };
  }

  @Get(":serviceId")
  @ApiOperation({ summary: "Lista imagens de um serviço específico" })
  @ApiParam({ name: "serviceId", example: 1, description: "ID do serviço" })
  @ApiResponse({ status: 200, description: "Imagens retornadas com sucesso" })
  async getImages(@Param("serviceId", ParseIntPipe) serviceId: number) {
    const images = await this.serviceImageService.getImageByService(serviceId);
    return images.map(img => ({ id: img.id, url: img.url, position: img.position }));
  }

  @Patch(":serviceId")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files', 5))
  @ApiOperation({ summary: "Atualiza imagens de um serviço (mantendo ou adicionando novas)" })
  @ApiParam({ name: "serviceId", example: 1, description: "ID do serviço" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: UpdateServiceDto })
  @ApiResponse({ status: 200, description: "Imagens atualizadas com sucesso" })
  @ApiResponse({ status: 401, description: "Usuário não autenticado" })
  async updateImages(
    @Param("serviceId", ParseIntPipe) serviceId: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() dto: UpdateServiceDto,
    @Req() req: Request
  ) {
    const user = req.user as User;
    const updatedService = await this.serviceImageService.updateImages(serviceId, dto, user, files);
    return {
      ...updatedService,
      images: updatedService.images.map(img => ({ id: img.id, url: img.url, position: img.position })),
    };
  }

  @Delete(":id")
  @ApiOperation({ summary: "Deleta uma imagem de serviço" })
  @ApiParam({ name: "id", example: 1, description: "ID da imagem" })
  @ApiResponse({ status: 200, description: "Imagem deletada com sucesso" })
  @ApiResponse({ status: 404, description: "Imagem não encontrada" })
  async delete(@Param("id", ParseIntPipe) id: number) {
    await this.serviceImageService.deleteImage(id);
    return { message: "Imagem deletada com sucesso" };
  }
}
