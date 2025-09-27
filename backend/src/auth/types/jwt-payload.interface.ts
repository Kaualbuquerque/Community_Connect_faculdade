// src/modules/auth/types/jwt-payload.interface.ts
export interface JwtPayload {
    sub: number;
    role: 'consumer' | 'provider';
  }
  