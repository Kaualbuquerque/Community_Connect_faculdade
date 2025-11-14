import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Favorite } from "./favorite.entity";
import { Repository } from "typeorm";

interface FavoriteFilters {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    state?: string;
    city?: string;
    search?: string; // 🔹 novo campo
}

@Injectable()
export class FavoriteService {
    constructor(
        @InjectRepository(Favorite)
        private favoriteRepository: Repository<Favorite>
    ) { }

    async addFavorite(consumerId: number, serviceId: number): Promise<Favorite> {
        const existing = await this.favoriteRepository.findOne({
            where: {
                consumer: { id: consumerId },
                service: { id: serviceId },
            },
            relations: ["consumer", "service", "service.provider"],
        });

        if (existing) {
            return existing; // já favoritado, retorna
        }

        const favorite = this.favoriteRepository.create({
            consumer: { id: consumerId },
            service: { id: serviceId },
        });

        return this.favoriteRepository.save(favorite);
    }

    async findByUser(consumerId: number, filters?: any): Promise<Favorite[]> {
        const query = this.favoriteRepository
            .createQueryBuilder('favorite')
            .leftJoinAndSelect('favorite.consumer', 'consumer')
            .leftJoinAndSelect('favorite.service', 'service')
            .leftJoinAndSelect('service.images', 'images')
            .leftJoinAndSelect('service.provider', 'provider')
            .where('consumer.id = :consumerId', { consumerId })

        // Filtros opcionais
        if (filters?.category) query.andWhere('service.category = :category', { category: filters.category });
        if (filters?.state) query.andWhere('service.state ILIKE :state', { state: `%${filters.state}%` });
        if (filters?.city) query.andWhere('service.city ILIKE :city', { city: `%${filters.city}%` });
        if (filters?.minPrice) query.andWhere('service.price >= :minPrice', { minPrice: filters.minPrice });
        if (filters?.maxPrice) query.andWhere('service.price <= :maxPrice', { maxPrice: filters.maxPrice });
        if (filters?.search) {
            query.andWhere(
                '(service.name ILIKE :search OR service.description ILIKE :search)',
                { search: `%${filters.search}%` },
            );
        }

        const favorites = await query.getMany();

        return favorites.map(favorite => ({
            ...favorite,
            service: {
                ...favorite.service,
                images: favorite.service.images ?? [],
                isFavorite: true,
            },
        }));
    }

    async removeFavorite(consumerId: number, serviceId: number): Promise<void> {
        const favorite = await this.favoriteRepository.findOne({
            where: {
                consumer: { id: consumerId },
                service: { id: serviceId },
            },
        });

        if (!favorite) throw new NotFoundException("Favorite not found");

        await this.favoriteRepository.remove(favorite);
    }

}