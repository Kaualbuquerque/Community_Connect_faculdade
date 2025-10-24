import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteService } from '../favorites.service';
import { Favorite } from '../favorite.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

describe('FavoriteService', () => {
  let service: FavoriteService;
  let favoriteRepository: jest.Mocked<Repository<Favorite>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoriteService,
        {
          provide: getRepositoryToken(Favorite),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FavoriteService>(FavoriteService);
    favoriteRepository = module.get(getRepositoryToken(Favorite));
  });

  it('deve adicionar um favorito', async () => {
    const consumerId = 1;
    const serviceId = 2;

    const fakeFavorite = { id: 1, consumer: { id: consumerId }, service: { id: serviceId } } as Favorite;

    // Simula que não existe favorito ainda
    favoriteRepository.findOne.mockResolvedValueOnce(null);
    favoriteRepository.create.mockReturnValue(fakeFavorite);
    favoriteRepository.save.mockResolvedValue(fakeFavorite);

    const result = await service.addFavorite(consumerId, serviceId);

    expect(favoriteRepository.findOne).toHaveBeenCalledWith({
      where: { consumer: { id: consumerId }, service: { id: serviceId } },
      relations: ['consumer', 'service', 'service.provider'],
    });
    expect(favoriteRepository.create).toHaveBeenCalledWith({
      consumer: { id: consumerId },
      service: { id: serviceId },
    });
    expect(favoriteRepository.save).toHaveBeenCalledWith(fakeFavorite);
    expect(result).toEqual(fakeFavorite);
  });

  it('deve remover um favorito', async () => {
    const consumerId = 1;
    const serviceId = 2;
    const fakeFavorite = { id: 1 } as Favorite;

    favoriteRepository.findOne.mockResolvedValueOnce(fakeFavorite);
    favoriteRepository.remove.mockResolvedValueOnce(fakeFavorite);

    await service.removeFavorite(consumerId, serviceId);

    expect(favoriteRepository.findOne).toHaveBeenCalledWith({
      where: { consumer: { id: consumerId }, service: { id: serviceId } },
    });
    expect(favoriteRepository.remove).toHaveBeenCalledWith(fakeFavorite);
  });

  it('deve lançar NotFoundException ao remover favorito inexistente', async () => {
    favoriteRepository.findOne.mockResolvedValueOnce(null);

    await expect(service.removeFavorite(1, 2)).rejects.toThrow(NotFoundException);
  });

  it('deve listar favoritos de um usuário', async () => {
    const userId = 1;
    const fakeFavorites = [
      { service: { id: 10, name: 'Serviço X' } },
      { service: { id: 20, name: 'Serviço Y' } },
    ];

    // Mock para query builder encadeado
    const mockQueryBuilder: any = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(fakeFavorites),
    };

    favoriteRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

    const result = await service.findByUser(userId, { category: 'Limpeza' });

    expect(favoriteRepository.createQueryBuilder).toHaveBeenCalledWith('favorite');
    expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledTimes(2);
    expect(mockQueryBuilder.where).toHaveBeenCalledWith('favorite.consumerId = :userId', { userId });
    expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('service.category = :category', { category: 'Limpeza' });

    // Verifica se retornou os serviços com isFavorite true
    expect(result).toEqual([
      { id: 10, name: 'Serviço X', isFavorite: true },
      { id: 20, name: 'Serviço Y', isFavorite: true },
    ]);
  });
});
