// src/modules/auth/auth.controller.ts
import { Controller, Post, Body, Request, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @UseGuards(LocalAuthGuard) // garante que req.user está autenticado
  @Post('login')
  async login(@Request() req) {
    // req.user vem do LocalAuthGuard
    if (!req.user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return this.authService.login(req.user);
  }
}
