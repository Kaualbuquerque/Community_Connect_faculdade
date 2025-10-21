import { Injectable, ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard("jwt") {
    handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
        if (err || info) {
            // Token ausente ou inválido → ignora
            return null;
        }
        return user; // Token válido → req.user = user
    }
}
