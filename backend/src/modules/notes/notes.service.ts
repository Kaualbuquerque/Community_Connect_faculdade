import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Note } from "./note.entity";
import { Repository } from "typeorm";
import { CreateNoteDto } from "./dto/create-note.dto";
import { UpdateNoteDto } from "./dto/update-note.dto";
import { User } from "../users/user.entity";

@Injectable()
export class NoteService {
    constructor(
        @InjectRepository(Note)
        private noteRepository: Repository<Note>
    ) { }

    async create(dto: CreateNoteDto, user: User): Promise<Note> {
        const note = this.noteRepository.create({
            ...dto,
            user,
        });
        return this.noteRepository.save(note);
    }

    async findOne(id: number): Promise<Note> {
        const note = await this.noteRepository.findOneBy({ id });
        if (!note) throw new NotFoundException(`Note with id ${id} not found`);
        return note;
    }

    async findNotesByUser(user: User): Promise<Note[]> {
        return this.noteRepository.find({
            where: { user: { id: user.id } }, // Filtra pelo ID do usuário através do relacionamento
            relations: ['user'] // Carrega automaticamente os dados do usuário relacionado
        });
    }

    async update(id: number, dto: UpdateNoteDto): Promise<Note> {
        await this.noteRepository.update(id, dto);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        const result = await this.noteRepository.delete(id);
        if (result.affected === 0) throw new NotFoundException(`Note #${id} not found`);
    }
}
