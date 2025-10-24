import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as fs from 'fs';
import * as path from 'path';
import { ServiceImageController } from '../serviceImage.controller';
import { ServiceImageService } from '../serviceImage.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

describe('ServiceImageController (integração simulada)', () => {
    let app: INestApplication;
    let mockServiceImageService: Partial<ServiceImageService>;
    const uploadedFiles: string[] = [];

    beforeAll(async () => {
        mockServiceImageService = {
            addImage: jest.fn().mockImplementation((serviceId, url) => {
                uploadedFiles.push(url.replace('http://localhost:4000/', ''));
                return Promise.resolve({ id: 1, service: { id: serviceId.toString() }, url, position: 1 });
            }),
            getImageByService: jest.fn().mockResolvedValue([
                { id: 1, service: { id: '1' }, url: 'img1', position: 1 },
                { id: 2, service: { id: '1' }, url: 'img2', position: 2 },
            ]),
            updateImages: jest.fn().mockImplementation((id, dto, user, files) => {
                files.forEach(file => uploadedFiles.push(`/uploads/${file.filename}`));
                return Promise.resolve({
                    id,
                    title: dto.title || 'Teste',
                    images: files.map((file, idx) => ({
                        url: `/uploads/${file.filename}`,
                        position: idx + 1,
                    })),
                });
            }),
            deleteImage: jest.fn().mockResolvedValue(undefined),
        };

        const moduleRef: TestingModule = await Test.createTestingModule({
            controllers: [ServiceImageController],
            providers: [
                { provide: ServiceImageService, useValue: mockServiceImageService },
            ],
        })
            .overrideGuard(JwtAuthGuard)
            .useValue({ canActivate: () => true })
            .compile();

        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
        await app.init();
    });

    afterAll(async () => {
        // Remove arquivos criados durante os testes
        uploadedFiles.forEach(file => {
            const filePath = path.join(process.cwd(), file);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        });
        await app.close();
    });

    it('POST /service-images/:serviceId - deve adicionar uma nova imagem', async () => {
        const serviceId = 1;

        const res = await request(app.getHttpServer())
            .post(`/service-images/${serviceId}`)
            .attach('file', Buffer.from('dummy file'), 'nova.jpg')
            .expect(201);

        expect(res.body).toEqual({
            id: 1,
            service: { id: serviceId.toString() },
            url: expect.any(String),
            position: 1,
        });
        expect(res.body.url).toContain('uploads/');
        expect(mockServiceImageService.addImage).toHaveBeenCalledWith(
            serviceId,
            expect.any(String),
        );
    });

    it('GET /service-images/:serviceId - deve retornar imagens do serviço', async () => {
        const res = await request(app.getHttpServer())
            .get('/service-images/1')
            .expect(200);

        expect(res.body).toEqual([
            { id: 1, service: { id: '1' }, url: 'img1', position: 1 },
            { id: 2, service: { id: '1' }, url: 'img2', position: 2 },
        ]);
        expect(mockServiceImageService.getImageByService).toHaveBeenCalledWith(1);
    });

    it('DELETE /service-images/:id - deve deletar uma imagem', async () => {
        await request(app.getHttpServer())
            .delete('/service-images/1')
            .expect(200);

        expect(mockServiceImageService.deleteImage).toHaveBeenCalledWith(1);
    });
});
