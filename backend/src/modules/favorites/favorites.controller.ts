import { Body, Controller, Delete, Get, Param, Post, Query, Request, UseGuards } from "@nestjs/common";
import { FavoriteService } from "./favorites.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CreateFavoriteDto } from "./dto/create-favorite.dto";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse } from "@nestjs/swagger";

@Controller("favorites")
@Controller('favorites')
export class FavoriteController {
    constructor(private readonly favoriteService: FavoriteService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Adiciona um serviço aos favoritos',
        description: 'Adiciona um serviço à lista de favoritos do usuário autenticado.',
    })
    @ApiResponse({ status: 201, description: 'Serviço adicionado aos favoritos com sucesso.' })
    @ApiResponse({ status: 401, description: 'Usuário não autenticado.' })
    addFavorite(@Request() req, @Body() dto: CreateFavoriteDto) {
        return this.favoriteService.addFavorite(req.user.id, dto.serviceId);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Lista os serviços favoritos do usuário',
        description: 'Retorna todos os serviços favoritos do usuário, com filtros opcionais.',
    })
    @ApiQuery({ name: 'category', required: false, description: 'Filtra por categoria' })
    @ApiQuery({ name: 'minPrice', required: false, description: 'Preço mínimo' })
    @ApiQuery({ name: 'maxPrice', required: false, description: 'Preço máximo' })
    @ApiQuery({ name: 'state', required: false, description: 'Filtra por estado' })
    @ApiQuery({ name: 'city', required: false, description: 'Filtra por cidade' })
    @ApiQuery({ name: 'search', required: false, description: 'Filtra por termo de busca' })
    @ApiResponse({ status: 200, description: 'Lista de favoritos retornada com sucesso.' })
    getFavorites(
        @Request() req,
        @Query('category') category?: string,
        @Query('minPrice') minPrice?: string,
        @Query('maxPrice') maxPrice?: string,
        @Query('state') state?: string,
        @Query('city') city?: string,
        @Query('search') search?: string,
    ) {
        const userId = req.user.id;
        const filters = {
            category,
            minPrice: minPrice ? Number(minPrice) : undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined,
            state,
            city,
            search,
        };
        return this.favoriteService.findByUser(userId, filters);
    }

    @Delete(':serviceId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Remove um serviço dos favoritos',
        description: 'Remove um serviço específico da lista de favoritos do usuário autenticado.',
    })
    @ApiParam({ name: 'serviceId', example: 1, description: 'ID do serviço a ser removido' })
    @ApiResponse({ status: 200, description: 'Serviço removido dos favoritos com sucesso.' })
    @ApiResponse({ status: 401, description: 'Usuário não autenticado.' })
    removeFavorite(@Request() req, @Param('serviceId') serviceId: string) {
        return this.favoriteService.removeFavorite(req.user.id, +serviceId);
    }
}