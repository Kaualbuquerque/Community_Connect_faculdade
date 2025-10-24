import { Body, Controller, Delete, Get, Header, Param, ParseIntPipe, Post, Put, Query, Req, Request, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { ServiceService } from "./services.service";
import { CreateServiceDto } from "./dto/create-service.dto";
import { UpdateServiceDto } from "./dto/update-service.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { OptionalJwtAuthGuard } from "../auth/guards/optional-jwt-auth.guard";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from "@nestjs/swagger";


@Controller("services")
export class ServicesController {
    constructor(private readonly serviceService: ServiceService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Cria um novo serviço',
        description: 'Cria um serviço vinculado ao usuário autenticado (prestador).',
    })
    @ApiResponse({ status: 201, description: 'Serviço criado com sucesso.' })
    @ApiResponse({ status: 401, description: 'Usuário não autenticado.' })
    async createService(@Body() body: CreateServiceDto, @Request() req) {
        return this.serviceService.create(body, req.user);
    }


    @Get()
    @UseGuards(OptionalJwtAuthGuard)
    @ApiOperation({
        summary: 'Busca todos os serviços',
        description: 'Retorna todos os serviços disponíveis, com filtros opcionais por estado, cidade, categoria, preço e termo de busca.',
    })
    @ApiQuery({ name: 'state', required: false, description: 'Filtra serviços por estado (sigla, ex: PE).' })
    @ApiQuery({ name: 'city', required: false, description: 'Filtra serviços por cidade.' })
    @ApiQuery({ name: 'category', required: false, description: 'Filtra serviços por categoria.' })
    @ApiQuery({ name: 'minPrice', required: false, description: 'Preço mínimo do serviço.' })
    @ApiQuery({ name: 'maxPrice', required: false, description: 'Preço máximo do serviço.' })
    @ApiQuery({ name: 'search', required: false, description: 'Termo de busca no nome ou descrição do serviço.' })
    @ApiResponse({ status: 200, description: 'Lista de serviços retornada com sucesso.' })
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
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Busca os serviços do usuário autenticado',
        description: 'Retorna todos os serviços cadastrados pelo usuário logado.',
    })
    @ApiResponse({ status: 200, description: 'Serviços do usuário retornados com sucesso.' })
    @ApiResponse({ status: 401, description: 'Usuário não autenticado.' })
    findAllByUser(@Request() req) {
        const userId = req.user.id;
        return this.serviceService.findAllByUser(userId);
    }

    @Get("states")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Lista todos os estados disponíveis',
        description: 'Retorna uma lista de siglas de estados que possuem serviços cadastrados.',
    })
    @ApiResponse({ status: 200, description: 'Lista de estados retornada com sucesso.' })
    @ApiResponse({ status: 401, description: 'Usuário não autenticado.' })
    async getStates() {
        return this.serviceService.getStates();
    }

    @Get("cities")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Lista as cidades de um estado',
        description: 'Retorna todas as cidades de um estado específico que possuem serviços cadastrados.',
    })
    @ApiQuery({ name: 'state', required: true, description: 'Sigla do estado (ex: PE).' })
    @ApiResponse({ status: 200, description: 'Lista de cidades retornada com sucesso.' })
    @ApiResponse({ status: 401, description: 'Usuário não autenticado.' })
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