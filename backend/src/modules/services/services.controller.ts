import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags, ApiBody } from "@nestjs/swagger";
import { ServiceService } from "./services.service";
import { CreateServiceDto } from "./dto/create-service.dto";
import { UpdateServiceDto } from "./dto/update-service.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { OptionalJwtAuthGuard } from "../auth/guards/optional-jwt-auth.guard";

@ApiTags("Services")
@ApiBearerAuth()
@Controller("services")
export class ServicesController {
    constructor(private readonly serviceService: ServiceService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: "Cria um novo serviço" })
    @ApiBody({ type: CreateServiceDto })
    @ApiResponse({ status: 201, description: "Serviço criado com sucesso" })
    @ApiResponse({ status: 400, description: "Dados inválidos" })
    @ApiResponse({ status: 401, description: "Usuário não autenticado" })
    createService(@Body() body: CreateServiceDto, @Request() req) {
        return this.serviceService.create(body, req.user);
    }

    @Get()
    @UseGuards(OptionalJwtAuthGuard)
    @ApiOperation({ summary: "Lista todos os serviços com filtros opcionais" })
    @ApiQuery({ name: "state", required: false, type: String })
    @ApiQuery({ name: "city", required: false, type: String })
    @ApiQuery({ name: "category", required: false, type: String })
    @ApiQuery({ name: "minPrice", required: false, type: Number })
    @ApiQuery({ name: "maxPrice", required: false, type: Number })
    @ApiQuery({ name: "search", required: false, type: String })
    @ApiResponse({ status: 200, description: "Serviços retornados com sucesso" })
    getAllServices(
        @Req() req,
        @Query('state') state?: string,
        @Query('city') city?: string,
        @Query('category') category?: string,
        @Query('minPrice') minPrice?: string,
        @Query('maxPrice') maxPrice?: string,
        @Query('search') search?: string,
    ) {
        const userId = req.user?.id;
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
    @ApiOperation({ summary: "Lista todos os serviços do usuário autenticado" })
    @ApiResponse({ status: 200, description: "Serviços do usuário retornados com sucesso" })
    @ApiResponse({ status: 401, description: "Usuário não autenticado" })
    findAllByUser(@Request() req) {
        const userId = req.user.id;
        return this.serviceService.findAllByUser(userId);
    }

    @Get("states")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: "Lista todos os estados que possuem serviços cadastrados" })
    @ApiResponse({ status: 200, description: "Lista de estados retornada com sucesso" })
    @ApiResponse({ status: 401, description: "Usuário não autenticado" })
    async getStates() {
        return this.serviceService.getStates();
    }

    @Get("cities")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: "Lista todas as cidades de um estado com serviços" })
    @ApiQuery({ name: "state", required: true, type: String, description: "Sigla do estado" })
    @ApiResponse({ status: 200, description: "Lista de cidades retornada com sucesso" })
    @ApiResponse({ status: 401, description: "Usuário não autenticado" })
    async getCities(@Query('state') state: string) {
        return this.serviceService.getCitiesByState(state);
    }

    @Put(":id")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: "Atualiza um serviço existente" })
    @ApiParam({ name: "id", example: 1, description: "ID do serviço a ser atualizado" })
    @ApiBody({ type: UpdateServiceDto })
    @ApiResponse({ status: 200, description: "Serviço atualizado com sucesso" })
    @ApiResponse({ status: 400, description: "Dados inválidos" })
    @ApiResponse({ status: 401, description: "Usuário não autenticado" })
    @ApiResponse({ status: 404, description: "Serviço não encontrado" })
    update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateServiceDto) {
        return this.serviceService.update(id, dto);
    }

    @Delete(":id")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: "Remove um serviço" })
    @ApiParam({ name: "id", example: 1, description: "ID do serviço a ser removido" })
    @ApiResponse({ status: 200, description: "Serviço removido com sucesso" })
    @ApiResponse({ status: 401, description: "Usuário não autenticado" })
    @ApiResponse({ status: 404, description: "Serviço não encontrado" })
    remove(@Param("id", ParseIntPipe) id: number) {
        return this.serviceService.remove(id);
    }
}
