import { Test, TestingModule } from '@nestjs/testing';
import { HistoryService } from '../history.service';
import { Repository } from 'typeorm';
import { History } from '../history.entity';
import { Favorite } from '../../favorites/favorite.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateHistoryDto } from '../dto/create-service-history.dto';

describe('HistoryService (unitário)', () => {
    let service: HistoryService;
    let HistoryRepository: any;
    let FavoriteRepository: any;

    beforeEach(async () => {
        HistoryRepository = {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
            count: jest.fn(),
            createQueryBuilder: jest.fn(),
        };

        FavoriteRepository = {
            find: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                HistoryService,
                { provide: getRepositoryToken(History), useValue: HistoryRepository },
                { provide: getRepositoryToken(Favorite), useValue: FavoriteRepository },
            ],
        }).compile();

        service = module.get<HistoryService>(HistoryService);
    });

    it('deve criar um histórico novo se não existir', async () => {
        const dto: CreateHistoryDto = {
            consumerId: 1,
            serviceId: 2,
            usedAt: new Date().toISOString(),
        };

        const fakeHistory = { id: 10 };

        HistoryRepository.findOne.mockResolvedValueOnce(undefined);
        HistoryRepository.count.mockResolvedValue(0);
        HistoryRepository.create.mockReturnValue(fakeHistory);
        HistoryRepository.save.mockResolvedValue(fakeHistory);

        const result = await service.create(dto);

        expect(HistoryRepository.create).toHaveBeenCalledWith({
            usedAt: expect.any(Date),
            consumer: { id: dto.consumerId },
            service: { id: dto.serviceId },
        });

        expect(result).toEqual(fakeHistory);
    });

    it('deve remover o histórico mais antigo se exceder MAX_HISTORY', async () => {
        const dto: CreateHistoryDto = {
            consumerId: 1,
            serviceId: 2,
            usedAt: new Date().toISOString(),
        };

        const oldestRecord = { id: 5 };
        const fakeHistory = { id: 10 };

        HistoryRepository.findOne
            .mockResolvedValueOnce(undefined)
            .mockResolvedValueOnce(oldestRecord);

        HistoryRepository.count.mockResolvedValue(5);
        HistoryRepository.delete.mockResolvedValue(undefined);

        HistoryRepository.create.mockReturnValue(fakeHistory);
        HistoryRepository.save.mockResolvedValue(fakeHistory);

        const result = await service.create(dto);

        expect(HistoryRepository.delete).toHaveBeenCalledWith(oldestRecord.id);
        expect(result).toEqual(fakeHistory);
    });

    it('deve remover histórico existente antes de criar um novo', async () => {
        const dto: CreateHistoryDto = {
            consumerId: 1,
            serviceId: 2,
            usedAt: new Date().toISOString(),
        };

        const existing = { id: 7 };
        const fakeHistory = { id: 10 };

        HistoryRepository.findOne
            .mockResolvedValueOnce(existing)
            .mockResolvedValueOnce(undefined);

        HistoryRepository.count.mockResolvedValue(0);
        HistoryRepository.delete.mockResolvedValue(undefined);

        HistoryRepository.create.mockReturnValue(fakeHistory);
        HistoryRepository.save.mockResolvedValue(fakeHistory);

        const result = await service.create(dto);

        expect(HistoryRepository.delete).toHaveBeenCalledWith(existing.id);
        expect(result).toEqual(fakeHistory);
    });

    it('deve remover histórico existente', async () => {
        HistoryRepository.delete.mockResolvedValue({ affected: 1 });

        await expect(service.remove(1)).resolves.toBeUndefined();
        expect(HistoryRepository.delete).toHaveBeenCalledWith(1);
    });

    it('deve lançar NotFoundException ao remover histórico inexistente', async () => {
        HistoryRepository.delete.mockResolvedValue({ affected: 0 });

        await expect(service.remove(99)).rejects.toThrow(NotFoundException);
        expect(HistoryRepository.delete).toHaveBeenCalledWith(99);
    });

    it('deve retornar históricos formatados corretamente em findByConsumer', async () => {
        const consumerId = 1;

        const mockHistories = [
            {
                id: 1,
                usedAt: new Date(),
                service: {
                    id: 10,
                    name: 'Serviço X',
                    description: 'Desc',
                    category: 'Test',
                    state: 'PE',
                    city: 'Recife',
                    price: 100,
                    provider: { id: 5 },
                    images: [{ url: 'img1.jpg' }, { url: 'img2.jpg' }],
                },
            },
        ];

        const qb: any = {
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            getMany: jest.fn().mockResolvedValue(mockHistories),
        };

        HistoryRepository.createQueryBuilder.mockReturnValue(qb);

        FavoriteRepository.find.mockResolvedValue([]);

        const result = await service.findByConsumer(consumerId);

        expect(result).toEqual([
            {
                ...mockHistories[0],
                service: {
                    id: 10,
                    name: 'Serviço X',
                    description: 'Desc',
                    category: 'Test',
                    state: 'PE',
                    city: 'Recife',
                    price: 100,
                    provider: { id: 5 },
                    images: ['img1.jpg', 'img2.jpg'],
                    isFavorite: false,
                },
            },
        ]);
    });
});
