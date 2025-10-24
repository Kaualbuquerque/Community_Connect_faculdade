import { Test, TestingModule } from '@nestjs/testing';
import { Repository, UpdateResult } from 'typeorm';
import { Service } from '../service.entity';
import { Favorite } from '../../favorites/favorite.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ServiceService } from '../services.service';
import { ServiceImage } from '../../services_images/serviceImage.entity';

describe('ServiceService (unit)', () => {
    let service: ServiceService;
    let serviceRepo: jest.Mocked<Repository<Service>>;
    let favoriteRepo: jest.Mocked<Repository<Favorite>>;
    let serviceImageRepo: jest.Mocked<Repository<ServiceImage>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ServiceService,
                { provide: getRepositoryToken(Service), useValue: { create: jest.fn(), save: jest.fn(), find: jest.fn(), findOne: jest.fn(), update: jest.fn(), delete: jest.fn(), createQueryBuilder: jest.fn() } },
                { provide: getRepositoryToken(Favorite), useValue: { find: jest.fn() } },
                { provide: getRepositoryToken(ServiceImage), useValue: { create: jest.fn(), save: jest.fn() } },
            ],
        }).compile();

        service = module.get(ServiceService);
        serviceRepo = module.get(getRepositoryToken(Service));
        favoriteRepo = module.get(getRepositoryToken(Favorite));
        serviceImageRepo = module.get(getRepositoryToken(ServiceImage));
    });

    describe('create', () => {
        it('deve criar um serviço sem imagens', async () => {
            const dto = { name: 'Serviço A', description: 'Descrição', price: 100 };
            const user = { id: 1 };

            const savedService = { id: 1, ...dto, provider: user };
            serviceRepo.create.mockReturnValue(savedService as any);
            serviceRepo.save.mockResolvedValue(savedService as any);

            const result = await service.create(dto as any, user as any);

            expect(serviceRepo.create).toHaveBeenCalledWith({ ...dto, provider: user });
            expect(serviceRepo.save).toHaveBeenCalledWith(savedService);
            expect(result).toEqual(savedService);
        });

        it('deve criar um serviço com imagens', async () => {
            const dto = { name: 'Serviço B', description: 'Descrição', price: 150 };
            const user = { id: 2 };
            const files = [{ filename: 'img1.jpg' }, { filename: 'img2.jpg' }];

            const savedService = { id: 2, ...dto, provider: user, images: [] };
            serviceRepo.create.mockReturnValue(savedService as any);
            serviceRepo.save.mockResolvedValue(savedService as any);

            const savedImages = [
                { position: 1, url: "/uploads/img1.jpg", service: expect.any(Object) },
                { position: 2, url: "/uploads/img2.jpg", service: expect.any(Object) },
            ];

            serviceImageRepo.create
                .mockImplementation((img) => img as any);
            serviceImageRepo.save.mockResolvedValue(savedImages as any);

            const result = await service.create(dto as any, user as any, files as any);

            expect(serviceRepo.create).toHaveBeenCalledWith({ ...dto, provider: user });
            expect(serviceImageRepo.create).toHaveBeenCalledTimes(2);
            expect(serviceImageRepo.save).toHaveBeenCalledWith(savedImages);
            expect(result.images).toEqual(savedImages);
        });
    });

    describe('findOne', () => {
        it('deve retornar um serviço existente', async () => {
            const svc = { id: 1, name: 'Serviço', provider: { id: 1 } };
            serviceRepo.findOne.mockResolvedValue(svc as any);
            const result = await service.findOne(1);
            expect(serviceRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['provider'] });
            expect(result).toEqual(svc);
        });

        it('deve lançar NotFoundException se não existir', async () => {
            serviceRepo.findOne.mockResolvedValue(null);
            await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('deve atualizar um serviço', async () => {
            const dto = { name: 'Atualizado', images: [] };
            const updated = { id: 1, name: 'Atualizado', provider: { id: 1 } };
            serviceRepo.update.mockResolvedValue({
                raw: [],
                affected: 1,
            } as UpdateResult);
            serviceRepo.findOne.mockResolvedValue(updated as any);

            const result = await service.update(1, dto as any);

            expect(serviceRepo.update).toHaveBeenCalledWith(1, { name: 'Atualizado' });
            expect(result).toEqual(updated);
        });
    });

    describe('remove', () => {
        it('deve remover um serviço existente', async () => {
            serviceRepo.delete.mockResolvedValue({ affected: 1 } as any);
            await service.remove(1);
            expect(serviceRepo.delete).toHaveBeenCalledWith(1);
        });

        it('deve lançar NotFoundException se não existir', async () => {
            serviceRepo.delete.mockResolvedValue({ affected: 0 } as any);
            await expect(service.remove(1)).rejects.toThrow(NotFoundException);
        });
    });

    describe('getStates', () => {
        it('deve retornar lista de estados', async () => {
            const mockQB: any = {
                select: jest.fn().mockReturnThis(),
                getRawMany: jest.fn().mockResolvedValue([{ state: 'SP' }, { state: 'RJ' }]),
            };
            serviceRepo.createQueryBuilder.mockReturnValue(mockQB);
            const result = await service.getStates();
            expect(result).toEqual(['SP', 'RJ']);
        });
    });

    describe('getCitiesByState', () => {
        it('deve retornar cidades de um estado', async () => {
            const mockQB: any = {
                select: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                getRawMany: jest.fn().mockResolvedValue([{ city: 'São Paulo' }, { city: 'Campinas' }]),
            };
            serviceRepo.createQueryBuilder.mockReturnValue(mockQB);
            const result = await service.getCitiesByState('SP');
            expect(result).toEqual(['São Paulo', 'Campinas']);
        });
    });
});
