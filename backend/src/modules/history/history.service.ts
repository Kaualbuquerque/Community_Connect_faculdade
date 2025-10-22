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


    async findByConsumer(consumerId: number): Promise<History[]> {
        // Busca histórico do usuário
        const histories = await this.historyRepository.find({
            where: { consumer: { id: consumerId } },
            relations: ['service', 'consumer', 'service.provider'],
            order: { usedAt: "DESC" },
        });

        // Busca favoritos do usuário
        const favorites = await this.favoriteRepository.find({
            where: { consumer: { id: consumerId } },
            relations: ['service'],
        });

        const favoriteIds = favorites.map(fav => fav.service.id);

        // Mapeia histórico adicionando flag isFavorite e convertendo imagens
        return histories.map(history => {
            const service = history.service;

            const serviceWithFavorite = {
                ...service,
                images: service.images?.map(img => img) ?? [],
                isFavorite: favoriteIds.includes(service.id),
            };

            return {
                ...history,
                service: serviceWithFavorite,
            };
        });
    }


    async remove(id: number): Promise<void> {
        const result = await this.historyRepository.delete(id);
        if (result.affected === 0) throw new NotFoundException(`History record #${id} not found`)
    }
}