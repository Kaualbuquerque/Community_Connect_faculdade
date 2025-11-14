import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HistoryController } from '../history.controller';
import { HistoryService } from '../history.service';
import { History } from '../history.entity';
import { Favorite } from '../../favorites/favorite.entity';

describe('HistoryController (integração simulada)', () => {
  let app: INestApplication;

  const mockHistoryRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
    findOne: jest.fn(),
  };

  const mockFavoriteRepo = {
    find: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [HistoryController],
      providers: [
        HistoryService,
        { provide: getRepositoryToken(History), useValue: mockHistoryRepo },
        { provide: getRepositoryToken(Favorite), useValue: mockFavoriteRepo },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('deve criar um histórico de serviço', async () => {
    const dto = { consumerId: 1, serviceId: 1, usedAt: new Date().toISOString() };

    const fakeHistory = {
      id: 1,
      consumer: { id: 1 },
      service: { id: 1 },
      usedAt: dto.usedAt,
    };

    mockHistoryRepo.findOne.mockResolvedValueOnce(null);
    mockHistoryRepo.count.mockResolvedValueOnce(0);
    mockHistoryRepo.create.mockReturnValue(fakeHistory);
    mockHistoryRepo.save.mockResolvedValue(fakeHistory);

    const response = await request(app.getHttpServer())
      .post('/history')
      .send(dto)
      .expect(201);

    expect(response.body).toEqual(fakeHistory);
  });

  it('deve remover um histórico', async () => {
    mockHistoryRepo.delete.mockResolvedValue({ affected: 1 });

    await request(app.getHttpServer()).delete('/history/1').expect(200);

    expect(mockHistoryRepo.delete).toHaveBeenCalledWith(1);
  });
});
