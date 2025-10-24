import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersController } from '../users.controller';
import { UserService } from '../users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { NotFoundException } from '@nestjs/common';

describe('UsersController (integração simulada)', () => {
    let app: INestApplication;
    let mockUserService: Partial<UserService>;

    beforeAll(async () => {
        mockUserService = {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        };

        const moduleRef: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [{ provide: UserService, useValue: mockUserService }],
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('POST /users - deve criar um usuário', async () => {
        const dto: CreateUserDto = {
            name: 'John',
            email: 'john@example.com',
            password: '123456',
            phone: '(81) 91234-5678',
            role: 'consumer',          // ou 'provider'
            cep: '12345-678',
            state: 'SP',
            city: 'São Paulo',
            number: '123',
        };

        const createdUser = { id: 1, ...dto };

        (mockUserService.create as jest.Mock).mockResolvedValue(createdUser);

        const res = await request(app.getHttpServer())
            .post('/users')
            .send(dto)
            .expect(201);

        expect(res.body).toEqual(createdUser);
        expect(mockUserService.create).toHaveBeenCalledWith(dto);
    });

    it('GET /users - deve retornar todos os usuários', async () => {
        const users = [{ id: 1, name: 'John' }];
        (mockUserService.findAll as jest.Mock).mockResolvedValue(users);

        const res = await request(app.getHttpServer())
            .get('/users')
            .expect(200);

        expect(res.body).toEqual(users);
        expect(mockUserService.findAll).toHaveBeenCalled();
    });

    it('GET /users/:id - deve retornar um usuário pelo ID', async () => {
        const user = { id: 1, name: 'John' };
        (mockUserService.findOne as jest.Mock).mockResolvedValue(user);

        const res = await request(app.getHttpServer())
            .get('/users/1')
            .expect(200);

        expect(res.body).toEqual(user);
        expect(mockUserService.findOne).toHaveBeenCalledWith(1);
    });

    it('PUT /users/:id - deve atualizar um usuário', async () => {
        const dto: UpdateUserDto = { name: 'Jane' };
        const updatedUser = { id: 1, name: 'Jane' };
        (mockUserService.update as jest.Mock).mockResolvedValue(updatedUser);

        const res = await request(app.getHttpServer())
            .put('/users/1')
            .send(dto)
            .expect(200);

        expect(res.body).toEqual(updatedUser);
        expect(mockUserService.update).toHaveBeenCalledWith(1, dto);
    });

    it('DELETE /users/:id - deve deletar um usuário', async () => {
        (mockUserService.remove as jest.Mock).mockResolvedValue(undefined);

        await request(app.getHttpServer())
            .delete('/users/1')
            .expect(200);

        expect(mockUserService.remove).toHaveBeenCalledWith(1);
    });

    it('GET /users/:id - deve retornar 404 se usuário não existir', async () => {
        (mockUserService.findOne as jest.Mock).mockRejectedValue(new NotFoundException());

        await request(app.getHttpServer())
            .get('/users/999')
            .expect(404);
    });
});
