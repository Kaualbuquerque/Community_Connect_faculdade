import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from '../dto/register.dto';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
    let authService: AuthService;
    let usersService: Partial<UserService>;
    let jwtService: Partial<JwtService>;

    beforeEach(async () => {
        usersService = {
            create: jest.fn(),
            findByEmail: jest.fn(),
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
        expect(resultado).not.toHaveProperty('password', dto.password);
    });

    it('deve retornar um token de acesso ao fazer login', async () => {
        const usuario = { id: 1, email: 'teste@example.com', role: 'consumer', password: 'hashedPassword' };

        // Mock do bcrypt.compare sempre retorna true
        jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

        const resultado = await authService.login(usuario as any);

        expect(resultado).toHaveProperty('access_token', 'token-mock');
        expect(jwtService.sign).toHaveBeenCalledWith({ sub: usuario.id, role: usuario.role });
    });

    it('deve retornar null ao validar usuário com senha incorreta', async () => {
        const usuario = { id: 1, email: 'teste@example.com', password: 'hashedPassword' };

        // Mock do bcrypt.compare retorna false
        jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

        const resultado = await authService.validateUser(usuario.email, 'senhaErrada');

        expect(resultado).toBeNull();
    });
});
