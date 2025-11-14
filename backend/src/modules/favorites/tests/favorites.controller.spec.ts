import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { FavoriteController } from '../favorites.controller';
import { FavoriteService } from '../favorites.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

describe('FavoriteController', () => {
    let app: INestApplication;
    let favoriteService: FavoriteService;

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
                        addFavorite: jest.fn(),
                        findByUser: jest.fn(),
                        removeFavorite: jest.fn(),
                    },
                },
            ],
        })
            .overrideGuard(JwtAuthGuard)
            .useValue({
                canActivate: (context) => {
                    const req = context.switchToHttp().getRequest();
                    req.user = { id: 1 };
                    return true;
                },
            })
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        favoriteService = moduleFixture.get<FavoriteService>(FavoriteService);
    });

    afterAll(async () => {
        await app.close();
    });

    // -------------------------------------
    // POST /favorites
    // -------------------------------------
    it('deve adicionar um favorito', async () => {
        favoriteService.addFavorite = jest.fn().mockResolvedValue(fakeFavorite);

        const response = await request(app.getHttpServer())
            .post('/favorites')
            .set('Authorization', 'Bearer MOCK_JWT')
            .send({ serviceId: 2 });

        expect(response.status).toBe(201);
        expect(response.body).toEqual(fakeFavorite);
        expect(favoriteService.addFavorite).toHaveBeenCalledWith(1, 2);
    });

    // -------------------------------------
    // GET /favorites - sem filtros
    // -------------------------------------
    it('deve listar favoritos do usuário sem filtros', async () => {
        favoriteService.findByUser = jest.fn().mockResolvedValue(fakeFavorites);

        const response = await request(app.getHttpServer())
            .get('/favorites')
            .set('Authorization', 'Bearer MOCK_JWT');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(fakeFavorites);

        expect(favoriteService.findByUser).toHaveBeenCalledWith(1, {
            category: undefined,
            minPrice: undefined,
            maxPrice: undefined,
            state: undefined,
            city: undefined,
            search: undefined,
        });
    });

    // -------------------------------------
    // GET /favorites - com filtros
    // -------------------------------------
    it('deve listar favoritos do usuário com filtros', async () => {
        favoriteService.findByUser = jest.fn().mockResolvedValue(fakeFavorites);

        const response = await request(app.getHttpServer())
            .get('/favorites?category=tech&minPrice=10&maxPrice=100&state=PE&city=Recife&search=carp')
            .set('Authorization', 'Bearer MOCK_JWT');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(fakeFavorites);

        expect(favoriteService.findByUser).toHaveBeenCalledWith(1, {
            category: 'tech',
            minPrice: 10,
            maxPrice: 100,
            state: 'PE',
            city: 'Recife',
            search: 'carp',
        });
    });

    // -------------------------------------
    // DELETE /favorites/:serviceId
    // -------------------------------------
    it('deve remover um favorito', async () => {
        favoriteService.removeFavorite = jest.fn().mockResolvedValue({ message: 'Removed' });

        const response = await request(app.getHttpServer())
            .delete('/favorites/2')
            .set('Authorization', 'Bearer MOCK_JWT');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Removed' });
        expect(favoriteService.removeFavorite).toHaveBeenCalledWith(1, 2);
    });
});
