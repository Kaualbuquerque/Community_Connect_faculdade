import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Request, UseGuards } from "@nestjs/common";
import { NoteService } from "./notes.service";
import { CreateNoteDto } from "./dto/create-note.dto";
import { UpdateNoteDto } from "./dto/update-note.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("notes")
export class NotesController {
    constructor(private readonly noteService: NoteService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    createNote(@Body() dto: CreateNoteDto, @Request() req) {
        return this.noteService.create(dto, req.user);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    getUserNotes(@Request() req) {
        return this.noteService.findNotesByUser(req.user);
    }

    @Get(":id")
    @UseGuards(JwtAuthGuard)
    findOne(@Param("id", ParseIntPipe) id: number) {
        return this.noteService.findOne(id);
    }

    @Put(":id")
    @UseGuards(JwtAuthGuard)
    update(
        @Param("id", ParseIntPipe) id: number,
        @Body() dto: UpdateNoteDto
    ) {
        return this.noteService.update(id, dto);
    }


    @Delete(":id")
    @UseGuards(JwtAuthGuard)
    remove(@Param("id", ParseIntPipe) id: number) {
        return this.noteService.remove(id);
    }
}