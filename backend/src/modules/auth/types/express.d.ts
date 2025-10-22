import { User } from './path/to/user.entity'; // importe o tipo correto do seu usuário

declare module 'express' {
  export interface Request {
    user?: User;  // ou o tipo que você usa para representar o usuário autenticado
  }
}
