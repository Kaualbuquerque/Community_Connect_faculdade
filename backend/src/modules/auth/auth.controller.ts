// src/modules/auth/auth.controller.ts
import { Controller, Post, Body, Request, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('register')
  @ApiOperation({
    summary: 'Registro de usuário',
    description: 'Cria uma nova conta de usuário com os dados fornecidos.',
  })
  @ApiResponse({ status: 201, description: 'Usuário registrado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou usuário já existe.' })
  @ApiBody({ type: RegisterDto })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({
    summary: 'Login de usuário',
    description: 'Autentica o usuário e retorna um token JWT.',
  })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  @ApiBody({ description: 'Email e senha do usuário', type: RegisterDto }) // pode criar um LoginDto específico
  async login(@Request() req) {
    if (!req.user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    return this.authService.login(req.user);
  }
}
