// src/modules/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './types/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) { }

  async register(dto: RegisterDto) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(dto.password, salt);

    const user = await this.usersService.create({
      ...dto,
      password: hash,
    });

    const { password, ...rest } = user;
    return rest;
  }

  // retorna user sem password
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const hashed = user.password;
    if (!hashed) return null;

    const match = await bcrypt.compare(pass, hashed);
    if (!match) return null;

    const { password, ...result } = user;
    return result; // objeto seguro para envio
  }

  // login após validação
  async login(user: any) {
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const payload: JwtPayload = { sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async validateJwtPayload(payload: JwtPayload) {
    const user = await this.usersService.findOne(payload.sub);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
