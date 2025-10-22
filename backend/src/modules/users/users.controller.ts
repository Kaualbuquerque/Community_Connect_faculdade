import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { UserService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";

@Controller("users")
export class UsersController {
    constructor(private readonly userService: UserService) { }

    @Post()
    @ApiOperation({
        summary: "Cria um novo usuário",
        description: "Cria um novo usuário no sistema com base nos dados fornecidos no corpo da requisição"
    })
    @ApiResponse({ status: 201, description: "Usuário criado com sucesso." })
    @ApiResponse({ status: 400, description: "Dados inválidos fornecidos." })
    create(@Body() dto: CreateUserDto) {
        return this.userService.create(dto);
    }

    @Get()
    @ApiOperation({
        summary: "Lista todos os usuário",
        description: "Retorna uma lista com todos os usuários cadastrados no sistemas."
    })
    @ApiResponse({ status: 200, description: "Lista retornada com sucesso." })
    findAll() {
        return this.userService.findAll();
    }

    @Get(":id")
    @ApiOperation({
        summary: "Busca um usuário por ID",
        description: "Retorna as informações de um usuário específico pelo seu ID."
    })
    @ApiParam({ name: "id", example: 1, description: "ID do usuário" })
    @ApiResponse({ status: 200, description: "Usuário encontrado com sucesso." })
    @ApiResponse({ status: 404, description: "Usuário não encontrado" })
    findOne(@Param("id") id: number) {
        return this.userService.findOne(id);
    }

    @Put(":id")
    @ApiBearerAuth()
    @ApiOperation({
        summary: "Atualiza um usuário existente",
        description: "Atualiza os dados de um usuário indentificado pelo ID. Requer autenticação."
    })
    @ApiParam({ name: "id", example: 1, description: "ID do usuário" })
    @ApiResponse({ status: 200, description: "usuário atualizado com sucesso." })
    @ApiResponse({ status: 401, description: "usuário não autenticado." })
    @ApiResponse({ status: 404, description: "usuário não encontrado." })
    update(@Param("id") id: number, @Body() dto: UpdateUserDto) {
        return this.userService.update(id, dto);
    }

    @Delete(":id")
    @ApiBearerAuth()
    @ApiOperation({
        summary: "Remove um usuário",
        description: "Exclui um usuário do sistema com base no ID informado. Requer autorização."
    })
    @ApiParam({ name: "id", example: 1, description: "ID do usuário" })
    @ApiResponse({ status: 200, description: "Usuário removido com sucesso." })
    @ApiResponse({ status: 401, description: "Usuário não autenticado." })
    @ApiResponse({ status: 404, description: "Usuário não encontrado." })
    remove(@Param("id") id: number) {
        return this.userService.remove(id);
    }
}