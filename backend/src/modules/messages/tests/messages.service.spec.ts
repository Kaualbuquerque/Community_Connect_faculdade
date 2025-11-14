// tests updated: src/modules/messages/tests/messages.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from '../messages.service';
import { Message } from '../message.entity';
import { User } from '../../users/user.entity';
import { Conversation } from '../../conversations/conversation.entity';
import { Repository, ObjectLiteral } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

type MockRepo<T extends ObjectLiteral = any> = jest.Mocked<Repository<T>>;

function createMockRepo() {
  return {
    findOneBy: jest.fn(),
    findAndCount: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };
}

describe('MessageService (unit)', () => {
  let service: MessageService;
  let messageRepo: MockRepo<Message>;
  let userRepo: MockRepo<User>;
  let conversationRepo: MockRepo<Conversation>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageService,
        { provide: getRepositoryToken(Message), useValue: createMockRepo() },
        { provide: getRepositoryToken(User), useValue: createMockRepo() },
        { provide: getRepositoryToken(Conversation), useValue: createMockRepo() },
      ],
    }).compile();

    service = module.get<MessageService>(MessageService);
    messageRepo = module.get(getRepositoryToken(Message));
    userRepo = module.get(getRepositoryToken(User));
    conversationRepo = module.get(getRepositoryToken(Conversation));
  });

  afterEach(() => jest.clearAllMocks());

  it('cria mensagem', async () => {
    const dto = { senderId: 1, conversationId: 1, content: 'Olá!' };

    const sender = { id: 1 } as User;
    const conversation = { id: 1 } as Conversation;
    const message = { id: 1, content: dto.content, sender, conversation } as Message;

    userRepo.findOneBy.mockResolvedValue(sender);
    conversationRepo.findOneBy.mockResolvedValue(conversation);
    messageRepo.create.mockReturnValue(message);
    messageRepo.save.mockResolvedValue(message);

    const result = await service.create(dto);

    expect(result).toEqual(message);
    expect(userRepo.findOneBy).toHaveBeenCalledWith({ id: dto.senderId });
    expect(conversationRepo.findOneBy).toHaveBeenCalledWith({ id: dto.conversationId });
    expect(messageRepo.save).toHaveBeenCalledWith(message);
  });

  it('erro se sender ou conversa não existem', async () => {
    const dto = { senderId: 1, conversationId: 1, content: 'Olá!' };

    userRepo.findOneBy.mockResolvedValue(null);
    conversationRepo.findOneBy.mockResolvedValue(null);

    await expect(service.create(dto)).rejects.toThrow(NotFoundException);
  });

  it('retorna mensagens paginadas', async () => {
    const msgs = [{ id: 1, content: 'Oi' }] as Message[];

    messageRepo.findAndCount.mockResolvedValue([msgs, 1]);

    const result = await service.findByConversation(1, 1, 10);

    expect(result).toEqual({
      total: 1,
      page: 1,
      limit: 10,
      messages: msgs,
    });
  });

  it('remove mensagem', async () => {
    messageRepo.delete.mockResolvedValue({ affected: 1 } as any);

    await service.remove(1);

    expect(messageRepo.delete).toHaveBeenCalledWith(1);
  });

  it('erro ao remover inexistente', async () => {
    messageRepo.delete.mockResolvedValue({ affected: 0 } as any);

    await expect(service.remove(999)).rejects.toThrow(NotFoundException);
  });
});
