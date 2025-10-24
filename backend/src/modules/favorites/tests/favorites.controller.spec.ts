import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { FavoriteController } from '../favorites.controller';
import { FavoriteService } from '../favorites.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

describe('FavoriteController', () => {
    let app: INestApplication;
    let favoriteService: FavoriteService;

    // Fake data para os testes
    const fakeFavorite = {
        id: 1,
        consumer: { id: 1 },
        service: { id: 2, name: 'Serviço Teste' },
        isFavorite: true,
    };

    const fakeFavorites = [
        { ...fakeFavorite },
        { id: 2, consumer: { id: 1 }, service: { id: 3, name: 'Outro Serviço' }, isFavorite: true },
    ];

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            controllers: [FavoriteController],
            providers: [
                {
                    provide: FavoriteService,
                    useValue: {
                        addFavorite: jest.fn().mockResolvedValue(fakeFavorite),
                        findByUser: jest.fn().mockResolvedValue(fakeFavorites),
                        removeFavorite: jest.fn().mockResolvedValue(undefined),
                    },
                },
            ],
        })
            // Mock do JWT Guard para permitir acesso sem autenticação real
            .overrideGuard(JwtAuthGuard)
            .useValue({
                canActivate: (context) => {
                    const req = context.switchToHttp().getRequest();
                    req.user = { id: 1 }; // simula o usuário autenticado
                    return true;
                },
            })
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        favoriteService = moduleFixture.get<FavoriteService>(FavoriteService);
    }, 10000);

    afterAll(async () => {
        await app.close();
    });

    it('deve adicionar um favorito', async () => {
        const response = await request(app.getHttpServer())
            .post('/favorites')
            .set('Authorization', 'Bearer MOCK_JWT')
            .send({ serviceId: 2 });

        expect(response.status).toBe(201);
        expect(response.body).toEqual(fakeFavorite);
        expect(favoriteService.addFavorite).toHaveBeenCalledWith(expect.any(Number), 2);
    });

    it('deve listar favoritos do usuário', async () => {
        const response = await request(app.getHttpServer())
            .get('/favorites')
            .set('Authorization', 'Bearer MOCK_JWT');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(fakeFavorites);
        expect(favoriteService.findByUser).toHaveBeenCalledWith(expect.any(Number), {});
    });

    it('deve remover um favorito', async () => {
        const response = await request(app.getHttpServer())
            .delete('/favorites/2')
            .set('Authorization', 'Bearer MOCK_JWT');

        expect(response.status).toBe(200);
        expect(favoriteService.removeFavorite).toHaveBeenCalledWith(expect.any(Number), 2);
    });
});
