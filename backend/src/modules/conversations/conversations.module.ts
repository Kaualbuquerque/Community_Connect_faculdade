// src/modules/conversations/conversations.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './conversation.entity';
import { ConversationParticipant } from './conversation-participant.entity';
import { ConversationService } from './conversations.service';
import { ConversationsController } from './conversations.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Conversation, ConversationParticipant]),
    ],
    providers: [ConversationService],
    controllers: [ConversationsController],
    exports: [ConversationService],
})
export class ConversationsModule { }
