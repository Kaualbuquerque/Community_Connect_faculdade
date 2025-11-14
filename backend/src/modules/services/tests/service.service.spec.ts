// tests/services/services.controller.int-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ServicesController } from '../services.controller';
import { ServiceService } from '../services.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../../auth/guards/optional-jwt-auth.guard';

describe('ServicesController (integração simulada)', () => {
    let app: INestApplication;
    let mockServiceService: any;

    beforeAll(async () => {
        mockServiceService = {
            create: jest.fn().mockImplementation((dto, user) =>
                Promise.resolve({ id: 1, ...dto, provider: user })
            ),
            findAllWithFavorite: jest.fn().mockResolvedValue([
                { id: 1, name: 'Serviço Teste', description: 'Descrição', price: 100, category: 'Limpeza', images: [], isFavorite: false }
            ]),
            findAllByUser: jest.fn().mockResolvedValue([
                { id: 1, name: 'Serviço do Usuário', images: [] }
            ]),
            update: jest.fn().mockImplementation((id, dto) =>
                Promise.resolve({ id, ...dto })
            ),
            remove: jest.fn().mockResolvedValue(undefined),
            getStates: jest.fn().mockResolvedValue(['SP', 'RJ']),
            getCitiesByState: jest.fn().mockResolvedValue(['São Paulo', 'Campinas']),
        };

        const moduleRef: TestingModule = await Test.createTestingModule({
            controllers: [ServicesController],
            providers: [
                { provide: ServiceService, useValue: mockServiceService },
            ],
        })
            .overrideGuard(JwtAuthGuard)
            .useValue({
                canActivate: (context: any) => {
                    const req = context.switchToHttp().getRequest();
                    req.user = { id: 1, name: 'Test User' };
                    return true;
                },
            })
            .overrideGuard(OptionalJwtAuthGuard)
            .useValue({ canActivate: () => true })
            .compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('POST /services - deve criar um serviço', async () => {
        const dto = { name: 'Serviço Teste', description: 'Descrição', price: 100, category: 'Limpeza' };

        const res = await request(app.getHttpServer())
            .post('/services')
            .send(dto)
            .expect(201);

        expect(res.body).toEqual({
            id: 1,
            ...dto,
            provider: { id: 1, name: 'Test User' }
        });
        expect(mockServiceService.create).toHaveBeenCalledWith(dto, { id: 1, name: 'Test User' });
    });

    it('GET /services - deve listar todos os serviços', async () => {
        const res = await request(app.getHttpServer())
            .get('/services')
            .expect(200);

        expect(Array.isArray(res.body)).toBe(true);
        expect(mockServiceService.findAllWithFavorite).toHaveBeenCalled();
    });

    it('GET /services/my-services - deve listar os serviços do usuário', async () => {
        const res = await request(app.getHttpServer())
            .get('/services/my-services')
            .expect(200);

        expect(Array.isArray(res.body)).toBe(true);
        expect(mockServiceService.findAllByUser).toHaveBeenCalledWith(1);
    });

    it('PUT /services/:id - deve atualizar o serviço', async () => {
        const dto = { name: 'Serviço Atualizado' };

        const res = await request(app.getHttpServer())
            .put('/services/1')
            .send(dto)
            .expect(200);

        expect(res.body).toEqual({ id: 1, ...dto });
        expect(mockServiceService.update).toHaveBeenCalledWith(1, dto);
    });

    it('DELETE /services/:id - deve deletar o serviço', async () => {
        await request(app.getHttpServer())
            .delete('/services/1')
            .expect(200);

        expect(mockServiceService.remove).toHaveBeenCalledWith(1);
    });

    it('GET /services/states - deve retornar os estados', async () => {
        const res = await request(app.getHttpServer())
            .get('/services/states')
            .expect(200);

        expect(res.body).toEqual(['SP', 'RJ']);
        expect(mockServiceService.getStates).toHaveBeenCalled();
    });

    it('GET /services/cities?state=SP - deve retornar as cidades', async () => {
        const res = await request(app.getHttpServer())
            .get('/services/cities')
            .query({ state: 'SP' })
            .expect(200);

        expect(res.body).toEqual(['São Paulo', 'Campinas']);
        expect(mockServiceService.getCitiesByState).toHaveBeenCalledWith('SP');
    });
});
