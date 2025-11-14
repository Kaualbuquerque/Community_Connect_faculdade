import { Test, TestingModule } from '@nestjs/testing';
import { NoteService } from '../notes.service';
import { Note } from '../note.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { User } from '../../users/user.entity';
import { CreateNoteDto } from '../dto/create-note.dto';
import { UpdateNoteDto } from '../dto/update-note.dto';

describe('NoteService', () => {
    let service: NoteService;
    let noteRepository: jest.Mocked<Repository<Note>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                NoteService,
                {
                    provide: getRepositoryToken(Note),
                    useValue: {
                        create: jest.fn(),
                        save: jest.fn(),
                        findOneBy: jest.fn(),
                        find: jest.fn(),
                        update: jest.fn(),
                        delete: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<NoteService>(NoteService);
        noteRepository = module.get(getRepositoryToken(Note));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const mockUser: User = { id: 1 } as User;
    const mockNote: Note = {
        id: 1,
        content: 'This is a test note.',
        user: mockUser,
    } as Note;

    describe('create', () => {
        it('deve criar e salvar uma nova nota', async () => {
            const dto: CreateNoteDto = { content: 'This is a test note.' };

            noteRepository.create.mockReturnValue(mockNote);
            noteRepository.save.mockResolvedValue(mockNote);

            const result = await service.create(dto, mockUser);

            expect(noteRepository.create).toHaveBeenCalledWith({ ...dto, user: mockUser });
            expect(noteRepository.save).toHaveBeenCalledWith(mockNote);
            expect(result).toEqual(mockNote);
        });
    });

    describe('findOne', () => {
        it('deve retornar uma nota existente', async () => {
            noteRepository.findOneBy.mockResolvedValue(mockNote);

            const result = await service.findOne(1);

            expect(noteRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
            expect(result).toEqual(mockNote);
        });

        it('deve lançar erro se a nota não for encontrada', async () => {
            noteRepository.findOneBy.mockResolvedValue(null);

            await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe('findNotesByUser', () => {
        it('deve retornar todas as notas de um usuário', async () => {
            noteRepository.find.mockResolvedValue([mockNote]);

            const result = await service.findNotesByUser(mockUser);

            expect(noteRepository.find).toHaveBeenCalledWith({
                where: { user: { id: mockUser.id } },
                relations: ['user'],
            });
            expect(result).toEqual([mockNote]);
        });
    });

    describe('update', () => {
        it('deve atualizar uma nota e retorná-la', async () => {
            const dto: UpdateNoteDto = { content: 'Updated Note' };

            noteRepository.update.mockResolvedValue({ affected: 1 } as any);
            noteRepository.findOneBy.mockResolvedValue({ ...mockNote, ...dto });

            const result = await service.update(1, dto);

            expect(noteRepository.update).toHaveBeenCalledWith(1, dto);
            expect(result.content).toBe('Updated Note');
        });

        it('deve lançar erro se a nota não existir ao atualizar', async () => {
            const dto: UpdateNoteDto = { content: 'Updated Note' };

            noteRepository.update.mockResolvedValue({ affected: 1 } as any);
            noteRepository.findOneBy.mockResolvedValue(null);

            await expect(service.update(999, dto)).rejects.toThrow(NotFoundException);
        });
    });

    describe('remove', () => {
        it('deve remover uma nota existente', async () => {
            noteRepository.delete.mockResolvedValue({ affected: 1 } as any);

            await service.remove(1);

            expect(noteRepository.delete).toHaveBeenCalledWith(1);
        });

        it('deve lançar erro se a nota não existir', async () => {
            noteRepository.delete.mockResolvedValue({ affected: 0 } as any);

            await expect(service.remove(999)).rejects.toThrow(NotFoundException);
        });
    });
});
