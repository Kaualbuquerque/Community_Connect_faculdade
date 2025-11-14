import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import CreateFavoriteDto from "./dto/create-favorite.dto";
import { FavoriteService } from "./favorites.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@ApiTags("Favorites")
@ApiBearerAuth()
@Controller("favorites")
export class FavoriteController {
    constructor(private readonly favoriteService: FavoriteService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: "Adiciona um serviço aos favoritos do usuário autenticado" })
    @ApiBody({ type: CreateFavoriteDto })
    @ApiResponse({ status: 201, description: "Serviço adicionado aos favoritos com sucesso" })
    @ApiResponse({ status: 400, description: "Parâmetros inválidos" })
    @ApiResponse({ status: 401, description: "Usuário não autenticado" })
    async addFavorite(@Request() req, @Body() dto: CreateFavoriteDto) {
        return this.favoriteService.addFavorite(req.user.id, dto.serviceId);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: "Lista os serviços favoritos do usuário autenticado com filtros opcionais" })
    @ApiQuery({ name: "category", required: false, type: String })
    @ApiQuery({ name: "minPrice", required: false, type: Number })
    @ApiQuery({ name: "maxPrice", required: false, type: Number })
    @ApiQuery({ name: "state", required: false, type: String })
    @ApiQuery({ name: "city", required: false, type: String })
    @ApiQuery({ name: "search", required: false, type: String })
    @ApiResponse({ status: 200, description: "Lista de serviços favoritos retornada com sucesso" })
    @ApiResponse({ status: 401, description: "Usuário não autenticado" })
    async getFavorites(
        @Request() req,
        @Query('category') category?: string,
        @Query('minPrice') minPrice?: string,
        @Query('maxPrice') maxPrice?: string,
        @Query('state') state?: string,
        @Query('city') city?: string,
        @Query('search') search?: string,
    ) {
        const consumerId = req.user.id;

        // Converte filtros para formato adequado
        const filters = {
            category: category?.trim() || undefined,
            minPrice: minPrice ? Number(minPrice) : undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined,
            state: state?.trim() || undefined,
            city: city?.trim() || undefined,
            search: search?.trim() || undefined,
        };

        // Chama o serviço usando o método correto
        return this.favoriteService.findByUser(consumerId, filters);
    }


    @Delete(":serviceId")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: "Remove um serviço dos favoritos do usuário autenticado" })
    @ApiResponse({ status: 200, description: "Serviço removido dos favoritos com sucesso" })
    @ApiResponse({ status: 401, description: "Usuário não autenticado" })
    @ApiResponse({ status: 404, description: "Serviço não encontrado nos favoritos" })
    async removeFavorite(@Request() req, @Param("serviceId", ParseIntPipe) serviceId: string) {
        return this.favoriteService.removeFavorite(req.user.id, +serviceId);
    }
}
