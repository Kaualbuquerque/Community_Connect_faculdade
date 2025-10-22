import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageController } from './messages.controller';
import { MessageService } from './messages.service';
import { Message } from './message.entity';
import { User } from '../users/user.entity';
import { Conversation } from '../conversations/conversation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, User, Conversation])],
  controllers: [MessageController],
  providers: [MessageService],
  exports:[MessageService]
})
export class MessagesModule {}