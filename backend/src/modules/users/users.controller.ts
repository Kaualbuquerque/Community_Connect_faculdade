import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBody } from "@nestjs/swagger";
import { UserService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@ApiTags("Users")
@Controller("users")
export class UsersController {
    constructor(private readonly userService: UserService) { }

    @Post()
    @ApiOperation({ summary: "Cria um novo usuário" })
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({ status: 201, description: "Usuário criado com sucesso" })
    @ApiResponse({ status: 400, description: "Dados inválidos" })
    create(@Body() dto: CreateUserDto) {
        return this.userService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: "Lista todos os usuários" })
    @ApiResponse({ status: 200, description: "Usuários retornados com sucesso" })
    findAll() {
        return this.userService.findAll();
    }

    @Get(":id")
    @ApiOperation({ summary: "Busca um usuário pelo ID" })
    @ApiParam({ name: "id", example: 1, description: "ID do usuário" })
    @ApiResponse({ status: 200, description: "Usuário encontrado" })
    @ApiResponse({ status: 404, description: "Usuário não encontrado" })
    findOne(@Param("id", ParseIntPipe) id: number) {
        return this.userService.findOne(id);
    }

    @Put(":id")
    @ApiOperation({ summary: "Atualiza um usuário existente" })
    @ApiParam({ name: "id", example: 1, description: "ID do usuário a ser atualizado" })
    @ApiBody({ type: UpdateUserDto })
    @ApiResponse({ status: 200, description: "Usuário atualizado com sucesso" })
    @ApiResponse({ status: 400, description: "Dados inválidos" })
    @ApiResponse({ status: 404, description: "Usuário não encontrado" })
    update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
        return this.userService.update(id, dto);
    }

    @Delete(":id")
    @ApiOperation({ summary: "Remove um usuário" })
    @ApiParam({ name: "id", example: 1, description: "ID do usuário a ser removido" })
    @ApiResponse({ status: 200, description: "Usuário removido com sucesso" })
    @ApiResponse({ status: 404, description: "Usuário não encontrado" })
    remove(@Param("id", ParseIntPipe) id: number) {
        return this.userService.remove(id);
    }
}
