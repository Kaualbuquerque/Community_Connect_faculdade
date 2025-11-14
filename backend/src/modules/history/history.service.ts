import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateHistoryDto } from "./dto/create-service-history.dto";
import { History } from "./history.entity";
import { Favorite } from "../favorites/favorite.entity";

@Injectable()
export class HistoryService {
    constructor(
        @InjectRepository(History)
        private historyRepository: Repository<History>,
        @InjectRepository(Favorite)
        private favoriteRepository: Repository<Favorite>,
    ) { }

    async create(dto: CreateHistoryDto): Promise<History> {
        const { consumerId, serviceId, usedAt } = dto;
        const MAX_HISTORY = 5;

        // Verifica se já existe esse serviço no histórico
        const existing = await this.historyRepository.findOne({
            where: {
                consumer: { id: consumerId },
                service: { id: serviceId },
            },
        });

        if (existing) {
            // Remove o existente para reordenar
            await this.historyRepository.delete(existing.id);
        }

        // Conta novamente os registros do usuário
        const count = await this.historyRepository.count({
            where: { consumer: { id: consumerId } },
        });

        if (count >= MAX_HISTORY) {
            const oldest = await this.historyRepository.findOne({
                where: { consumer: { id: consumerId } },
                order: { usedAt: "ASC" },
            });
            if (oldest) {
                await this.historyRepository.delete(oldest.id);
            }
        }

        // Cria o registro novo
        const record = this.historyRepository.create({
            usedAt: usedAt ? new Date(usedAt) : new Date(),
            consumer: { id: consumerId },
            service: { id: serviceId },
        });

        return this.historyRepository.save(record);
    }


    async findByConsumer(consumerId: number): Promise<any[]> {
        const histories = await this.historyRepository
            .createQueryBuilder('history')
            .leftJoinAndSelect('history.consumer', 'consumer')
            .leftJoinAndSelect('history.service', 'service')
            .leftJoinAndSelect('service.images', 'images')
            .leftJoinAndSelect('service.provider', 'provider')
            .where('consumer.id = :consumerId', { consumerId })
            .orderBy('history.usedAt', 'DESC')
            .getMany();

        const favorites = await this.favoriteRepository.find({
            where: { consumer: { id: consumerId } },
            relations: ['service'],
        });

        const favoriteIds = favorites.map(f => f.service.id);

        return histories.map(history => {
            const service = history.service;

            return {
                ...history,
                service: {
                    id: service.id,
                    name: service.name,
                    description: service.description,
                    state: service.state,
                    city: service.city,
                    category: service.category,
                    price: service.price,
                    provider: service.provider,
                    images: service.images?.map(image => image.url) ?? [],
                    isFavorite: favoriteIds.includes(service.id),
                },
            };
        });
    }


    async remove(id: number): Promise<void> {
        const result = await this.historyRepository.delete(id);
        if (result.affected === 0) throw new NotFoundException(`History record #${id} not found`)
    }
}