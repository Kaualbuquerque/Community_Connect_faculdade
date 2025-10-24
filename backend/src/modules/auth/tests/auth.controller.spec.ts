import { UnauthorizedException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "../auth.controller";
import { AuthService } from "../auth.service";
import { LocalAuthGuard } from "../guards/local-auth.guard";
import { RegisterDto } from "../dto/register.dto";

describe("AuthController", () => {
    let controller: AuthController;
    let authService: Partial<AuthService>;

    beforeEach(async () => {
        authService = {
            register: jest.fn(),
            login: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [{ provide: AuthService, useValue: authService }],
        })
            .overrideGuard(LocalAuthGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .compile();

        controller = module.get<AuthController>(AuthController);
    });

    it('deve estar definido', () => {
        expect(controller).toBeDefined();
    });

    it('deve registrar um novo usuário com sucesso', async () => {
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

        const usuarioMock = { id: 1, ...dto };
        (authService.register as jest.Mock).mockResolvedValue(usuarioMock);

        const resultado = await controller.register(dto);
        expect(resultado).toEqual(usuarioMock);
        expect(authService.register).toHaveBeenCalledWith(dto);
    });

    it('deve realizar o login e retornar o token', async () => {
        const req = { user: { id: 1, email: 'teste@example.com' } };
        (authService.login as jest.Mock).mockResolvedValue({
            access_token: 'token-mock',
        });

        const resultado = await controller.login(req as any);

        expect(resultado).toHaveProperty('access_token', 'token-mock');
        expect(authService.login).toHaveBeenCalledWith(req.user);
    });

    it('deve lançar UnauthorizedException se req.user for inválido', async () => {
        const req = { user: null };
        await expect(controller.login(req as any)).rejects.toThrow(UnauthorizedException);
    });
})