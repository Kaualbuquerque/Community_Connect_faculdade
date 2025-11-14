
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MessageController } from '../messages.controller';
import { MessageService } from '../messages.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

describe('MessageController (integração simulada)', () => {
    let app: INestApplication;
    let mockMessageService: any;

    beforeAll(async () => {
        mockMessageService = {
            create: jest.fn().mockImplementation(dto =>
                Promise.resolve({
                    id: 1,
                    content: dto.content,
                    senderId: dto.senderId,
                    conversationId: dto.conversationId,
                    timestamp: new Date(),
                    isDeleted: false,
                })
            ),

            findByConversation: jest.fn().mockResolvedValue({
                total: 2,
                page: 1,
                limit: 10,
                messages: [
                    { id: 1, content: "Hello", senderId: 1, conversationId: 1, timestamp: new Date(), isDeleted: false },
                    { id: 2, content: "World", senderId: 2, conversationId: 1, timestamp: new Date(), isDeleted: false },
                ],
            }),

            remove: jest.fn().mockResolvedValue(undefined),
        };

        const moduleRef: TestingModule = await Test.createTestingModule({
            controllers: [MessageController],
            providers: [
                { provide: MessageService, useValue: mockMessageService },
            ],
        })
            .overrideGuard(JwtAuthGuard)
            .useValue({ canActivate: () => true })
            .compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('deve criar uma mensagem', async () => {
        const dto = { content: 'Hello', senderId: 1, conversationId: 1 };

        const response = await request(app.getHttpServer())
            .post('/messages')
            .send(dto)
            .expect(201);

        expect(response.body).toEqual({
            id: 1,
            content: 'Hello',
            senderId: 1,
            conversationId: 1,
            timestamp: expect.any(String),
            isDeleted: false,
        });

        expect(mockMessageService.create).toHaveBeenCalledWith(dto);
    });

    it('deve listar mensagens de uma conversa', async () => {
        const response = await request(app.getHttpServer())
            .get('/messages/1?page=1&limit=10')
            .expect(200);

        expect(response.body).toEqual({
            total: 2,
            page: 1,
            limit: 10,
            messages: [
                { id: 1, content: "Hello", senderId: 1, conversationId: 1, timestamp: expect.any(String), isDeleted: false },
                { id: 2, content: "World", senderId: 2, conversationId: 1, timestamp: expect.any(String), isDeleted: false },
            ],
        });

        expect(mockMessageService.findByConversation).toHaveBeenCalledWith(1, 1, 10);
    });

    it('deve remover uma mensagem', async () => {
        await request(app.getHttpServer())
            .delete('/messages/1')
            .expect(200);

        expect(mockMessageService.remove).toHaveBeenCalledWith(1);
    });
});
