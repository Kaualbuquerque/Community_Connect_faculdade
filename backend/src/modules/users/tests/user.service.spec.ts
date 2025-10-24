import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { UserService } from '../users.service';
import { User } from '../user.entity';

describe('UserService', () => {
    let service: UserService;
    let userRepo: Partial<Repository<User>>;

    beforeEach(async () => {
        userRepo = {
            findOne: jest.fn(),
            findOneBy: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
            update: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                { provide: getRepositoryToken(User), useValue: userRepo },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('deve criar um usuário com hash de senha', async () => {
        const dto = { name: 'John', email: 'john@example.com', password: '123456' };
        const createdUser = { ...dto, id: 1 };
        (userRepo.create as jest.Mock).mockReturnValue(createdUser);
        (userRepo.save as jest.Mock).mockResolvedValue(createdUser);

        const result = await service.create(dto as any);

        expect(userRepo.create).toHaveBeenCalledWith({
            ...dto,
            password: expect.any(String),
        });
        expect(userRepo.save).toHaveBeenCalledWith(createdUser);
        expect(result).toEqual(createdUser);
    });

    it('deve buscar usuário por ID', async () => {
        const user = { id: 1, name: 'John' } as User;
        (userRepo.findOne as jest.Mock).mockResolvedValue(user);

        const result = await service.findById(1);

        expect(userRepo.findOne).toHaveBeenCalledWith({
            where: { id: 1 },
            select: ['id', 'name', 'email', 'role', 'phone', 'cep', 'state', 'city', 'number'],
        });
        expect(result).toEqual(user);
    });


    it('deve lançar NotFoundException se usuário não existir', async () => {
        (userRepo.findOne as jest.Mock).mockResolvedValue(null);

        await expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });

    it('deve atualizar usuário', async () => {
        const user = { id: 1, name: 'John' } as User;
        const dto = { name: 'Jane' };

        // Mock do findOneBy para findOne
        (userRepo.findOneBy as jest.Mock).mockResolvedValue({ ...user, ...dto });

        // Mock do update (não precisa retornar nada)
        (userRepo.update as jest.Mock).mockResolvedValue(undefined);

        const result = await service.update(1, dto as any);

        expect(userRepo.update).toHaveBeenCalledWith(1, dto);
        expect(result.name).toBe('Jane');
    });


    it('deve deletar usuário', async () => {
        (userRepo.delete as jest.Mock).mockResolvedValue({ affected: 1 });

        await service.remove(1);

        expect(userRepo.delete).toHaveBeenCalledWith(1);
    });

    it('deve buscar usuário por email', async () => {
        const user = { id: 1, email: 'john@example.com' } as User;
        (userRepo.findOne as jest.Mock).mockResolvedValue(user);

        const result = await service.findByEmail('john@example.com');

        expect(userRepo.findOne).toHaveBeenCalledWith({
            where: { email: 'john@example.com' },
            select: ['id', 'password', 'email', 'role'],
        });
        expect(result).toEqual(user);
    });
});
