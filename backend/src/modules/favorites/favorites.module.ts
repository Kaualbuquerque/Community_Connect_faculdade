// src/modules/favorites/favorites.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './favorite.entity';
import { FavoriteService } from './favorites.service';
import { FavoriteController } from './favorites.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Favorite])],
    providers: [FavoriteService],
    controllers: [FavoriteController],
    exports: [FavoriteService],
})
export class FavoritesModule { }
