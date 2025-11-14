// TESTE ATUALIZADO ─ ALINHADO AO SERVICE ATUAL

import { Test, TestingModule } from '@nestjs/testing';
import { ConversationService } from '../conversations.service';
import { Conversation } from '../conversation.entity';
import { ConversationParticipant } from '../conversation-participant.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('ConversationService', () => {
    let service: ConversationService;

    const mockConversationRepo = {
        find: jest.fn(),
        createQueryBuilder: jest.fn(),
        delete: jest.fn(),
        findOne: jest.fn(),
    };

    const mockParticipantRepo = {
        findOne: jest.fn(),
        save: jest.fn(),
        count: jest.fn(),
    };

    const mockDataSource = {
        transaction: jest.fn().mockImplementation(async (fn) => {
            return fn({
                getRepository: jest.fn().mockImplementation((entity) => {
                    if (entity === Conversation) {
                        return {
                            create: jest.fn().mockReturnValue({ id: 1 }),
                            save: jest.fn().mockResolvedValue({ id: 1 }),
                            createQueryBuilder: jest.fn().mockReturnValue({
                                innerJoin: jest.fn().mockReturnThis(),
                                leftJoinAndSelect: jest.fn().mockReturnThis(),
                                getOne: jest.fn().mockResolvedValue(null),
                            }),
                            findOne: jest.fn().mockResolvedValue({
                                id: 1,
                                participants: [],
                            }),
                        };
                    }
                    if (entity === ConversationParticipant) {
                        return {
                            findOne: jest.fn(),
                            save: jest.fn(),
                            create: jest.fn().mockImplementation((data) => data),
                        };
                    }
                    return null;
                }),
            });
        }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ConversationService,
                { provide: getRepositoryToken(Conversation), useValue: mockConversationRepo },
                { provide: getRepositoryToken(ConversationParticipant), useValue: mockParticipantRepo },
                { provide: DataSource, useValue: mockDataSource },
            ],
        }).compile();

        service = module.get<ConversationService>(ConversationService);
    });

    it('deve estar definido', () => {
        expect(service).toBeDefined();
    });

    // --- CREATE ---
    it('deve criar uma nova conversa se não existir anteriormente', async () => {
        const dto = { participantId: 2 };
        const userId = 1;

        const result = await service.create(dto as any, userId);

        expect(result).toHaveProperty('id', 1);
        expect(result).toHaveProperty('participants');
    });

    // --- FIND ALL ---
    it('deve retornar todas as conversas', async () => {
        const mock = [{ id: 1 }, { id: 2 }];
        mockConversationRepo.find.mockResolvedValue(mock);

        const result = await service.findAll();

        expect(result).toEqual(mock);
        expect(mockConversationRepo.find).toHaveBeenCalled();
    });

    // --- FIND ONE (DO USUÁRIO) ---
    it('deve buscar conversas do usuário', async () => {
        const query = {
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            getMany: jest.fn().mockResolvedValue([{ id: 1 }]),
        };

        mockConversationRepo.createQueryBuilder.mockReturnValue(query);

        const result = await service.findOne(1);

        expect(result).toEqual([{ id: 1 }]);
    });

    // --- REMOVE ---
    it('deve remover conversa quando usuário existe no registro', async () => {
        mockParticipantRepo.findOne.mockResolvedValue({
            id: 1,
            deleted: false,
        });

        mockParticipantRepo.save.mockResolvedValue({});
        mockParticipantRepo.count.mockResolvedValue(1);

        const result = await service.remove(1, 1);

        expect(result).toEqual({ message: 'Conversa deletada com sucesso.' });
    });

    it('deve lançar NotFoundException ao tentar remover conversa inexistente', async () => {
        mockParticipantRepo.findOne.mockResolvedValue(null);

        await expect(service.remove(99, 1)).rejects.toThrow(NotFoundException);
    });
});
