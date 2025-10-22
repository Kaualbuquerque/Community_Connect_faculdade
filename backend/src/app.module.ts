// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ServicesModule } from './modules/services/services.module';
import { NotesModule } from './modules/notes/notes.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { ConversationsModule } from './modules/conversations/conversations.module';
import { MessagesModule } from './modules/messages/messages.module';
import { HistoryModule } from './modules/history/history.module';
import { ChatModule } from './modules/chats/chat.module';
import { ServiceImageModule } from './modules/services_images/serviceImage.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const host = config.get<string>('DB_HOST');
        const port = config.get<number>('DB_PORT');
        const username = config.get<string>('DB_USER');
        const password = config.get<string>('DB_PASS');
        const database = config.get<string>('DB_NAME');

        if (!host || !port || !username || database === undefined) {
          throw new Error('Configuração do banco de dados inválida. Verifique seu .env');
        }

        return {
          type: 'postgres',
          host,
          port,
          username,
          password,
          database,
          entities: [__dirname + '/**/*.entity.{ts,js}'],
          synchronize: true, // ATENÇÃO: usar somente em desenvolvimento para criar as tabelas automaticamente
        };
      },
    }),

    AuthModule,
    UsersModule,
    ServicesModule,
    NotesModule,
    FavoritesModule,
    ConversationsModule,
    MessagesModule,
    HistoryModule,
    ChatModule,
    ServiceImageModule,
  ],
})
export class AppModule {}
