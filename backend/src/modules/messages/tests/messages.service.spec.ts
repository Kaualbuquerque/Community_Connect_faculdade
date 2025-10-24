import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from '../messages.service';
import { Message } from '../message.entity';
import { User } from '../../users/user.entity';
import { Conversation } from '../../conversations/conversation.entity';
import { Repository, ObjectLiteral } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

// Tipagem auxiliar para mocks
type MockRepo<T extends ObjectLiteral = any> = jest.Mocked<Repository<T>>;

// Função auxiliar que gera um mock de repositório TypeORM
function createMockRepo() {
  return {
    findOneBy: jest.fn(),
    findAndCount: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };
}

describe('MessageService (unitário)', () => {
  let service: MessageService;
  let messageRepository: MockRepo<Message>;
  let userRepository: MockRepo<User>;
  let conversationRepository: MockRepo<Conversation>;

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
    messageRepository = module.get(getRepositoryToken(Message));
    userRepository = module.get(getRepositoryToken(User));
    conversationRepository = module.get(getRepositoryToken(Conversation));
  });

  afterEach(() => {
    jest.clearAllMocks(); //  limpa tudo após cada teste
  });

  it('deve criar uma mensagem com sucesso', async () => {
    const dto = { senderId: 1, conversationId: 1, content: 'Olá!' };

    const sender = { id: 1 } as User;
    const conversation = { id: 1 } as Conversation;
    const message = { id: 1, content: dto.content, sender, conversation } as Message;

    userRepository.findOneBy.mockResolvedValue(sender);
    conversationRepository.findOneBy.mockResolvedValue(conversation);
    messageRepository.create.mockReturnValue(message);
    messageRepository.save.mockResolvedValue(message);

    const result = await service.create(dto);
    expect(result).toEqual(message);
    expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: dto.senderId });
    expect(conversationRepository.findOneBy).toHaveBeenCalledWith({ id: dto.conversationId });
    expect(messageRepository.save).toHaveBeenCalledWith(message);
  });

  it('deve lançar erro se sender ou conversa não forem encontrados', async () => {
    const dto = { senderId: 1, conversationId: 1, content: 'Olá!' };

    // ✅ corrigido: usando as variáveis certas
    userRepository.findOneBy.mockResolvedValue(null);
    conversationRepository.findOneBy.mockResolvedValue(null);

    await expect(service.create(dto)).rejects.toThrow(NotFoundException);
  });

  it('deve retornar mensagens paginadas de uma conversa', async () => {
    const messages = [{ id: 1, content: 'Oi' }] as Message[];
    messageRepository.findAndCount.mockResolvedValue([messages, 1]);

    const result = await service.findByConversation(1, 1, 10);

    expect(result).toEqual({
      total: 1,
      page: 1,
      limit: 10,
      messages,
    });
  });

  it('deve remover uma mensagem existente', async () => {
    messageRepository.delete.mockResolvedValue({ affected: 1 } as any);

    await service.remove(1);

    expect(messageRepository.delete).toHaveBeenCalledWith(1);
  });

  it('deve lançar erro ao tentar remover mensagem inexistente', async () => {
    messageRepository.delete.mockResolvedValue({ affected: 0 } as any);

    await expect(service.remove(999)).rejects.toThrow(NotFoundException);
  });
});
