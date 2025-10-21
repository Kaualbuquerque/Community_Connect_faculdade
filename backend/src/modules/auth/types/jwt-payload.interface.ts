export interface JwtPayload {
    sub: number;
    role: 'consumer' | 'provider';
  }
  