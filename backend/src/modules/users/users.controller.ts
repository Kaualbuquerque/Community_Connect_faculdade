import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put} from "@nestjs/common";
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
    findOne(@Param("id", ParseIntPipe) id: number) {
        return this.userService.findOne(id);
    }

    @Put(":id")
    update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
        return this.userService.update(id, dto);
    }

    @Delete(":id")
    remove(@Param("id", ParseIntPipe) id: number) {
        return this.userService.remove(id);
    }
}