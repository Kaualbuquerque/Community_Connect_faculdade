import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesController } from './services.controller';
import { ServiceService } from './services.service';
import { Service } from './service.entity';
import { Favorite } from '../favorites/favorite.entity';
import { ServiceImage } from '../services_images/serviceImage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Service, Favorite, ServiceImage])],
  controllers: [ServicesController],
  providers: [ServiceService],
})
export class ServicesModule {}