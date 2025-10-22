import { Body, Controller, Delete, Get, Param, Post, Query, Request, UseGuards } from "@nestjs/common";
import CreateFavoriteDto from "./dto/create-favorite.dto";
import { FavoriteService } from "./favorites.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("favorites")
export class FavoriteController {
    constructor(private readonly favoriteService: FavoriteService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    async addFavorite(@Request() req, @Body() dto: CreateFavoriteDto) {
        return this.favoriteService.addFavorite(req.user.id, dto.serviceId);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getFavorites(
        @Request() req,
        @Query('category') category?: string,
        @Query('minPrice') minPrice?: string,
        @Query('maxPrice') maxPrice?: string,
        @Query('state') state?: string,
        @Query('city') city?: string,
        @Query('search') search?: string,
    ) {
        const userId = req.user.id;
        // Converte min/maxPrice para number se existirem
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
    async removeFavorite(@Request() req, @Param('serviceId') serviceId: string) {
        return this.favoriteService.removeFavorite(req.user.id, +serviceId);
    }
}