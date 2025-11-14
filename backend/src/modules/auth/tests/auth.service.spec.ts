import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from '../dto/register.dto';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

interface JwtPayload {
    sub: number;
    role: "consumer" | "provider";
}

describe('AuthService', () => {
    let authService: AuthService;
    let usersService: Partial<UserService>;
    let jwtService: Partial<JwtService>;

    beforeEach(async () => {
        usersService = {
            create: jest.fn(),
            findByEmail: jest.fn(),
            findOne: jest.fn(), // necessário para validateJwtPayload
        };

        jwtService = {
            sign: jest.fn().mockReturnValue('token-mock'),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: UserService, useValue: usersService },
                { provide: JwtService, useValue: jwtService },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
    });

    it('deve estar definido', () => {
        expect(authService).toBeDefined();
    });

    it('deve registrar um novo usuário', async () => {
        const dto: RegisterDto = {
            name: 'Usuário Teste',
            email: 'teste@example.com',
            password: '123456',
            phone: '(81) 99999-9999',
            role: 'consumer',
            cep: '12345-678',
            state: 'PE',
            city: 'Recife',
            number: '10',
        };

        (usersService.create as jest.Mock).mockImplementation(async (data) => ({
            id: 1,
            ...data,
            password: await bcrypt.hash(data.password, 10),
        }));

        const resultado = await authService.register(dto);

        expect(resultado).toHaveProperty('id', 1);
        expect(resultado).toHaveProperty('email', dto.email);
        expect(resultado).not.toHaveProperty('password');
    });

    it('deve retornar um token de acesso ao fazer login', async () => {
        const usuario = { id: 1, email: 'teste@example.com', role: 'consumer', password: 'hashedPassword' };

        jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

        const resultado = await authService.login(usuario as any);

        expect(resultado).toHaveProperty('access_token', 'token-mock');
        expect(resultado).toHaveProperty('user', usuario);
        expect(jwtService.sign).toHaveBeenCalledWith({ sub: usuario.id, role: usuario.role });
    });

    it('deve retornar null ao validar usuário com senha incorreta', async () => {
        jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

        (usersService.findByEmail as jest.Mock).mockResolvedValue({
            id: 1,
            email: 'teste@example.com',
            password: 'hashedPassword',
        });

        const resultado = await authService.validateUser('teste@example.com', 'senhaErrada');

        expect(resultado).toBeNull();
    });

    it('deve validar o payload JWT e retornar o usuário', async () => {
        const usuario = { id: 1, email: 'teste@example.com', role: 'consumer' };

        (usersService.findOne as jest.Mock).mockResolvedValue(usuario);

        const payload: JwtPayload = {
            sub: 1,
            role: "consumer",
        };

        const resultado = await authService.validateJwtPayload(payload);

        expect(usersService.findOne).toHaveBeenCalledWith(1);
        expect(resultado).toEqual(usuario);
    });

    it('deve lançar UnauthorizedException caso o usuário não exista', async () => {
        (usersService.findOne as jest.Mock).mockResolvedValue(null);

        const payload: JwtPayload = {
            sub: 1,
            role: "consumer",
        };

        await expect(authService.validateJwtPayload(payload))
            .rejects
            .toThrow(UnauthorizedException);
    });
});
