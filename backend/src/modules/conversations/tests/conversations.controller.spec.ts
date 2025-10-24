import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ConversationService } from '../conversations.service';
import { ConversationsController } from '../conversations.controller';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

// Mock de service
const mockConversationService = {
  create: jest.fn(),
  findAll: jest.fn(),
};

const mockJwtAuthGuard = {
  canActivate: (context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    req.user = { id: 1 }; // mock do usuário logado
    return true;
  },
};


describe('ConversationsController (integração com mocks)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ConversationsController],
      providers: [
        {
          provide: ConversationService,
          useValue: mockConversationService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('deve criar uma conversa entre dois usuários', async () => {
    const fakeConversation = {
      id: 1,
      participants: [
        { user: { id: 1 } },
        { user: { id: 2 } },
      ],
    };
    mockConversationService.create.mockResolvedValue(fakeConversation);

    const response = await request(app.getHttpServer())
      .post('/conversations')
      .set('Authorization', 'Bearer MOCK_JWT')
      .send({ participantId: 2 });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(fakeConversation);
    expect(mockConversationService.create).toHaveBeenCalledWith({ participantId: 2 }, expect.any(Number));
  });

  it('deve retornar todas as conversas do usuário', async () => {
    const fakeConversations = [
      { id: 1, participants: [{ user: { id: 1 } }, { user: { id: 2 } }] },
    ];
    mockConversationService.findAll.mockResolvedValue(fakeConversations);

    const response = await request(app.getHttpServer())
      .get('/conversations')
      .set('Authorization', 'Bearer MOCK_JWT');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(fakeConversations);
    expect(mockConversationService.findAll).toHaveBeenCalled();
  });
});