import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from "@nestjs/common";
import { NoteService } from "./notes.service";
import { CreateNoteDto } from "./dto/create-note.dto";
import { UpdateNoteDto } from "./dto/update-note.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";

@Controller("notes")
export class NotesController {
    constructor(private readonly noteService: NoteService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Cria uma nova nota',
        description: 'Cria uma nota vinculada ao usuário autenticado.',
    })
    @ApiResponse({ status: 201, description: 'Nota criada com sucesso.' })
    @ApiResponse({ status: 401, description: 'Usuário não autenticado.' })
    createNote(@Body() dto: CreateNoteDto, @Request() req) {
        return this.noteService.create(dto, req.user);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Busca todas as notas do usuário',
        description: 'Retorna todas as notas criadas pelo usuário autenticado.',
    })
    @ApiResponse({ status: 200, description: 'Notas do usuário retornadas com sucesso.' })
    @ApiResponse({ status: 401, description: 'Usuário não autenticado.' })
    getUserNotes(@Request() req) {
        return this.noteService.findNotesByUser(req.user);
    }

    @Get(":id")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Busca uma nota pelo ID',
        description: 'Retorna uma nota específica pelo seu ID.',
    })
    @ApiParam({ name: 'id', example: 1, description: 'ID da nota' })
    @ApiResponse({ status: 200, description: 'Nota retornada com sucesso.' })
    @ApiResponse({ status: 401, description: 'Usuário não autenticado.' })
    @ApiResponse({ status: 404, description: 'Nota não encontrada.' })
    findOne(@Param("id") id: number) {
        return this.noteService.findOne(id);
    }

    @Put(":id")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Atualiza uma nota',
        description: 'Atualiza o conteúdo de uma nota específica pelo seu ID.',
    })
    @ApiParam({ name: 'id', example: 1, description: 'ID da nota a ser atualizada' })
    @ApiResponse({ status: 200, description: 'Nota atualizada com sucesso.' })
    @ApiResponse({ status: 401, description: 'Usuário não autenticado.' })
    @ApiResponse({ status: 404, description: 'Nota não encontrada.' })
    update(@Param("id") id: number, dto: UpdateNoteDto) {
        return this.noteService.update(id, dto);
    }

    @Delete(":id")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Remove uma nota',
        description: 'Remove uma nota específica pelo seu ID.',
    })
    @ApiParam({ name: 'id', example: 1, description: 'ID da nota a ser removida' })
    @ApiResponse({ status: 200, description: 'Nota removida com sucesso.' })
    @ApiResponse({ status: 401, description: 'Usuário não autenticado.' })
    @ApiResponse({ status: 404, description: 'Nota não encontrada.' })
    remove(@Param("id") id: number) {
        return this.noteService.remove(id);
    }
}