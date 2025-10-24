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
    let HistoryRepository: Partial<Repository<History>>;
    let FavoriteRepository: Partial<Repository<Favorite>>;

    beforeEach(async () => {
        HistoryRepository = {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
            count: jest.fn(),
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
        const dto: CreateHistoryDto = { consumerId: 1, serviceId: 2 };
        const fakeHistory = { id: 10 };

        (HistoryRepository.findOne as jest.Mock).mockResolvedValueOnce(undefined);
        (HistoryRepository.count as jest.Mock).mockResolvedValue(0);
        (HistoryRepository.create as jest.Mock).mockReturnValue(fakeHistory);
        (HistoryRepository.save as jest.Mock).mockResolvedValue(fakeHistory);

        const result = await service.create(dto);

        expect(HistoryRepository.create).toHaveBeenCalledWith({
            usedAt: expect.any(Date),
            consumer: { id: dto.consumerId },
            service: { id: dto.serviceId },
        });
        expect(HistoryRepository.save).toHaveBeenCalledWith(fakeHistory);
        expect(result).toEqual(fakeHistory);
    });

    it('deve remover o histórico mais antigo se exceder MAX_HISTORY', async () => {
        const dto: CreateHistoryDto = { consumerId: 1, serviceId: 2 };
        const oldestRecord = { id: 5 };

        (HistoryRepository.findOne as jest.Mock)
            .mockResolvedValueOnce(undefined)
            .mockResolvedValueOnce(oldestRecord);
        (HistoryRepository.count as jest.Mock).mockResolvedValue(5); // atinge limite
        (HistoryRepository.delete as jest.Mock).mockResolvedValue(undefined);

        const fakeHistory = { id: 10 };
        (HistoryRepository.create as jest.Mock).mockReturnValue(fakeHistory);
        (HistoryRepository.save as jest.Mock).mockResolvedValue(fakeHistory);

        const result = await service.create(dto);

        expect(HistoryRepository.delete).toHaveBeenCalledWith(oldestRecord.id);
        expect(result).toEqual(fakeHistory);
    });

    it('deve remover histórico existente antes de criar um novo', async () => {
        const dto: CreateHistoryDto = { consumerId: 1, serviceId: 2 };
        const existingRecord = { id: 7 };

        (HistoryRepository.findOne as jest.Mock)
            .mockResolvedValueOnce(existingRecord) 
            .mockResolvedValueOnce(undefined); 
        (HistoryRepository.count as jest.Mock).mockResolvedValue(0);
        (HistoryRepository.delete as jest.Mock).mockResolvedValue(undefined);

        const fakeHistory = { id: 10 };
        (HistoryRepository.create as jest.Mock).mockReturnValue(fakeHistory);
        (HistoryRepository.save as jest.Mock).mockResolvedValue(fakeHistory);

        const result = await service.create(dto);

        expect(HistoryRepository.delete).toHaveBeenCalledWith(existingRecord.id);
        expect(result).toEqual(fakeHistory);
    });


    it('deve remover histórico existente', async () => {
        (HistoryRepository.delete as jest.Mock).mockResolvedValue({ affected: 1 });
        await expect(service.remove(1)).resolves.toBeUndefined();
        expect(HistoryRepository.delete).toHaveBeenCalledWith(1);
    });

    it('deve lançar NotFoundException ao remover histórico inexistente', async () => {
        (HistoryRepository.delete as jest.Mock).mockResolvedValue({ affected: 0 });
        await expect(service.remove(99)).rejects.toThrow(NotFoundException);
        expect(HistoryRepository.delete).toHaveBeenCalledWith(99);
    });
});
