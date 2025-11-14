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
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const databaseUrl = config.get<string>('DATABASE_URL');

        if (!databaseUrl) {
          throw new Error('A variável de ambiente DATABASE_URL não está definida.');
        }

        return {
          type: 'postgres',
          url: databaseUrl,
          entities: [__dirname + '/**/*.entity.{ts,js}'],
          synchronize: true, // usar apenas em dev
          ssl: {
            rejectUnauthorized: false, // necessário para Render/Postgres cloud
          },
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
    CloudinaryModule,
  ],
})
export class AppModule { }
