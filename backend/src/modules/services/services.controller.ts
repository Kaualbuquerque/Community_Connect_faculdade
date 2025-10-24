import { Body, Controller, Delete, Get, Header, Param, ParseIntPipe, Post, Put, Query, Req, Request, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { ServiceService } from "./services.service";
import { CreateServiceDto } from "./dto/create-service.dto";
import { UpdateServiceDto } from "./dto/update-service.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { OptionalJwtAuthGuard } from "../auth/guards/optional-jwt-auth.guard";
import { FilesInterceptor } from "@nestjs/platform-express";


@Controller("services")
export class ServicesController {
    constructor(private readonly serviceService: ServiceService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    async createService(@Body() body: CreateServiceDto, @Request() req) {
        return this.serviceService.create(body, req.user);
    }


    @Get()
    @UseGuards(OptionalJwtAuthGuard)
    async getAllServices(
        @Req() req,
        @Query('state') state?: string,
        @Query('city') city?: string,
        @Query('category') category?: string,
        @Query('minPrice') minPrice?: string, // vem como string na query
        @Query('maxPrice') maxPrice?: string,
        @Query('search') search?: string, // novo param
    ) {
        const userId = req.user?.id;

        // garante que min/max sejam numbers ou undefined
        const min = minPrice !== undefined && minPrice !== '' ? Number(minPrice) : undefined;
        const max = maxPrice !== undefined && maxPrice !== '' ? Number(maxPrice) : undefined;

        return this.serviceService.findAllWithFavorite(userId, {
            state,
            city,
            category,
            minPrice: min,
            maxPrice: max,
            search,
        });
    }


    @Get('my-services')
    @UseGuards(JwtAuthGuard)
    findAllByUser(@Request() req) {
        const userId = req.user.id;
        return this.serviceService.findAllByUser(userId);
    }

    @Get("states")
    @UseGuards(JwtAuthGuard)
    async getStates() {
        return this.serviceService.getStates();
    }

    @Get("cities")
    @UseGuards(JwtAuthGuard)
    async getCities(@Query('state') state: string) {
        return this.serviceService.getCitiesByState(state);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateServiceDto) {
        return this.serviceService.update(id, dto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.serviceService.remove(id);
    }
}