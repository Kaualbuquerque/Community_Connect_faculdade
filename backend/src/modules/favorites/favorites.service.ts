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

    async findByUser(userId: number, filters?: FavoriteFilters) {
        const query = this.favoriteRepository.createQueryBuilder('favorite')
            .leftJoinAndSelect('favorite.service', 'service')
            .leftJoinAndSelect('service.provider', 'provider')
            .where('favorite.consumerId = :userId', { userId });

        if (filters?.category) query.andWhere('service.category = :category', { category: filters.category });
        if (filters?.minPrice !== undefined) query.andWhere('service.price >= :minPrice', { minPrice: filters.minPrice });
        if (filters?.maxPrice !== undefined) query.andWhere('service.price <= :maxPrice', { maxPrice: filters.maxPrice });
        if (filters?.state) query.andWhere('service.state = :state', { state: filters.state });
        if (filters?.city) query.andWhere('service.city = :city', { city: filters.city });
        if (filters?.search) {
            query.andWhere(
                '(LOWER(service.name) LIKE :search OR LOWER(service.description) LIKE :search)',
                { search: `%${filters.search.toLowerCase()}%` },
            );
        }

        const favorites = await query.getMany();

        // 🔹 Normaliza para devolver apenas os serviços
        return favorites.map(fav => ({
            ...fav.service,
            isFavorite: true,
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