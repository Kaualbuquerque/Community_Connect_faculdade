import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { MessagesModule } from '../messages/messages.module';
import { ConversationsModule } from '../conversations/conversations.module';
import { WsJwtGuard } from '../auth/guards/ws-jwt.guard';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [MessagesModule, ConversationsModule, AuthModule],
    providers: [ChatGateway, WsJwtGuard],
})
export class ChatModule { }
