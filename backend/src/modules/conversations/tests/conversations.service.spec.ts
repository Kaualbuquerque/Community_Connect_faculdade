import { Test, TestingModule } from '@nestjs/testing';
import { ConversationService } from '../conversations.service';
import { Conversation } from '../conversation.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

describe('ConversationService', () => {
    let service: ConversationService;
    let ConversationRepository: Repository<Conversation>;
    let dataSource: DataSource;

    const mockRepository = {
        find: jest.fn(),
        createQueryBuilder: jest.fn(),
        delete: jest.fn(),
    };

    const mockDataSource = {
        transaction: jest.fn().mockImplementation(async (fn) => {
            return fn({
                create: jest.fn((entity, values?) => ({ id: 1, ...values })),
                save: jest.fn(async (entity) => entity),
                getRepository: jest.fn().mockReturnValue({
                    createQueryBuilder: jest.fn(() => ({
                        innerJoin: jest.fn().mockReturnThis(),
                        getOne: jest.fn(),
                    })),
                }),
                findOne: jest.fn(async (entity, options) => ({ id: 1, participants: [] })),
            });
        }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ConversationService,
                { provide: getRepositoryToken(Conversation), useValue: mockRepository },
                { provide: DataSource, useValue: mockDataSource },
            ],
        }).compile();

        service = module.get<ConversationService>(ConversationService);
        ConversationRepository = module.get(getRepositoryToken(Conversation));
        dataSource = module.get(DataSource);
    });

    it('deve estar definido', () => {
        expect(service).toBeDefined();
    });

    it('deve criar uma nova conversa', async () => {
        const dto = { participantId: 2 };
        const userId = 1;

        const resultado = await service.create(dto as any, userId);

        expect(resultado).toHaveProperty('id', 1);
        expect(resultado).toHaveProperty('participants');
    });

    it('deve retornar todas as conversas', async () => {
        const conversasMock = [{ id: 1 }, { id: 2 }];
        mockRepository.find.mockResolvedValue(conversasMock);

        const resultado = await service.findAll();

        expect(resultado).toEqual(conversasMock);
        expect(mockRepository.find).toHaveBeenCalled();
    });

    it('deve buscar conversas de um usuário', async () => {
        // Mock completo do QueryBuilder
        const mockQueryBuilder: any = {
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            getMany: jest.fn().mockResolvedValue([{ id: 1 }]),
        };
        mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

        const resultado = await service.findOne(1);

        expect(resultado).toEqual([{ id: 1 }]);
        expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('conversation');
    });

    it('deve remover uma conversa', async () => {
        mockRepository.delete.mockResolvedValue({ affected: 1 });

        await expect(service.remove(1)).resolves.toBeUndefined();
        expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    it('deve lançar NotFoundException se não encontrar conversa ao remover', async () => {
        mockRepository.delete.mockResolvedValue({ affected: 0 });

        await expect(service.remove(999)).rejects.toThrow('Conversation #999 not found');
    });
});
