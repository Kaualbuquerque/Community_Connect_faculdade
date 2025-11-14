import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { NoteService } from "./notes.service";
import { CreateNoteDto } from "./dto/create-note.dto";
import { UpdateNoteDto } from "./dto/update-note.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@ApiTags("Notes")
@ApiBearerAuth()
@Controller("notes")
export class NotesController {
    constructor(private readonly noteService: NoteService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: "Cria uma nova nota do usuário" })
    @ApiBody({ type: CreateNoteDto })
    @ApiResponse({ status: 201, description: "Nota criada com sucesso" })
    @ApiResponse({ status: 400, description: "Dados inválidos" })
    @ApiResponse({ status: 401, description: "Usuário não autenticado" })
    createNote(@Body() dto: CreateNoteDto, @Request() req) {
        return this.noteService.create(dto, req.user);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: "Lista todas as notas do usuário autenticado" })
    @ApiResponse({ status: 200, description: "Notas retornadas com sucesso" })
    @ApiResponse({ status: 401, description: "Usuário não autenticado" })
    getUserNotes(@Request() req) {
        return this.noteService.findNotesByUser(req.user);
    }

    @Get(":id")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: "Busca uma nota específica pelo ID" })
    @ApiParam({ name: "id", example: 1, description: "ID da nota" })
    @ApiResponse({ status: 200, description: "Nota encontrada com sucesso" })
    @ApiResponse({ status: 404, description: "Nota não encontrada" })
    @ApiResponse({ status: 401, description: "Usuário não autenticado" })
    findOne(@Param("id", ParseIntPipe) id: number) {
        return this.noteService.findOne(id);
    }

    @Put(":id")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: "Atualiza uma nota existente" })
    @ApiParam({ name: "id", example: 1, description: "ID da nota a ser atualizada" })
    @ApiBody({ type: UpdateNoteDto })
    @ApiResponse({ status: 200, description: "Nota atualizada com sucesso" })
    @ApiResponse({ status: 400, description: "Dados inválidos" })
    @ApiResponse({ status: 404, description: "Nota não encontrada" })
    @ApiResponse({ status: 401, description: "Usuário não autenticado" })
    update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateNoteDto) {
        return this.noteService.update(id, dto);
    }

    @Delete(":id")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: "Remove uma nota" })
    @ApiParam({ name: "id", example: 1, description: "ID da nota a ser removida" })
    @ApiResponse({ status: 200, description: "Nota removida com sucesso" })
    @ApiResponse({ status: 404, description: "Nota não encontrada" })
    @ApiResponse({ status: 401, description: "Usuário não autenticado" })
    remove(@Param("id", ParseIntPipe) id: number) {
        return this.noteService.remove(id);
    }
}
