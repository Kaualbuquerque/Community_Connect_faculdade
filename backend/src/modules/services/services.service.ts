import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Service } from "./service.entity";
import { Repository } from "typeorm";
import { CreateServiceDto } from "./dto/create-service.dto";
import { UpdateServiceDto } from "./dto/update-service.dto";
import { User } from "../users/user.entity";
import { Favorite } from "../favorites/favorite.entity";
import { ServiceImage } from "../services_images/serviceImage.entity";
import { ServiceWithImageUrls } from "./dto/service-with-image-urls.dto";

@Injectable()
export class ServiceService {
    constructor(
        @InjectRepository(Service)
        private serviceRepository: Repository<Service>,
        @InjectRepository(Favorite)
        private favoriteRepository: Repository<Favorite>,
        @InjectRepository(ServiceImage)
        private serviceImageRepository: Repository<ServiceImage>
    ) { }


    async create(dto: CreateServiceDto, user: User, files?: Express.Multer.File[]): Promise<Service> {
        // 1️⃣ Cria o serviço sem as imagens
        const service = this.serviceRepository.create({
            ...dto,
            provider: user,
        });

        await this.serviceRepository.save(service);

        // 2️⃣ Se houver imagens, cria e salva as entidades relacionadas
        if (files?.length) {
            const urls = files.map(file => `/uploads/${file.filename}`);

            const images = urls.map((url, idx) =>
                this.serviceImageRepository.create({
                    url,
                    position: idx + 1,
                    service, // associa diretamente o objeto salvo
                }),
            );

            await this.serviceImageRepository.save(images);

            // 3️⃣ Atualiza o serviço com suas imagens (opcional)
            service.images = images;
        }

        return service;
    }

    async findAllByUser(userId: number): Promise<ServiceWithImageUrls[]> {
        // Busca serviços do provedor e já carrega provider + images
        const services = await this.serviceRepository.find({
            where: { provider: { id: userId } },
            relations: ['provider', 'images'], // ← adiciona imagens
        });

        // Mapeia apenas as URLs das imagens
        return services.map(service => ({
            ...service,
            images: service.images?.map(img => img.url) ?? [],
        }));
    }

    async findOne(id: number): Promise<Service> {
        const service = await this.serviceRepository.findOne({
            where: { id },
            relations: ['provider'],
        });
        if (!service) throw new NotFoundException(`Service with id ${id} not found`);
        return service;
    }

    async findAllWithFavorite(
        userId?: number,
        filters?: {
            state?: string;
            city?: string;
            category?: string;
            minPrice?: number;
            maxPrice?: number;
            search?: string;
        },
    ) {
        const query = this.serviceRepository.createQueryBuilder('service')
            .leftJoinAndSelect('service.provider', 'provider')
            .leftJoinAndSelect('service.images', 'images'); // ← adiciona as imagens

        if (filters?.state) {
            query.andWhere('service.state = :state', { state: filters.state });
        }

        if (filters?.city) {
            query.andWhere('service.city = :city', { city: filters.city });
        }

        if (filters?.category) {
            query.andWhere('service.category = :category', { category: filters.category });
        }

        if (filters?.minPrice !== undefined) {
            query.andWhere('service.price >= :minPrice', { minPrice: filters.minPrice });
        }

        if (filters?.maxPrice !== undefined) {
            query.andWhere('service.price <= :maxPrice', { maxPrice: filters.maxPrice });
        }

        if (filters?.search) {
            query.andWhere(
                '(LOWER(service.name) LIKE LOWER(:search) OR LOWER(service.description) LIKE LOWER(:search))',
                { search: `%${filters.search}%` },
            );
        }

        const services = await query.getMany();

        // Agora o 'images' já vem carregado como array de URLs
        const servicesWithImages = services.map(service => ({
            ...service,
            images: service.images?.map(img => img.url) ?? [],
        }));

        if (!userId) {
            return servicesWithImages.map(service => ({
                ...service,
                isFavorite: false,
            }));
        }

        const favorites = await this.favoriteRepository.find({
            where: { consumer: { id: userId } },
            relations: ['service'],
        });

        const favoriteIds = favorites.map(fav => fav.service.id);

        return servicesWithImages.map(service => ({
            ...service,
            isFavorite: favoriteIds.includes(service.id),
        }));
    }




    async update(id: number, dto: UpdateServiceDto): Promise<Service> {
        // copia dto mas remove 'images'
        const { images, ...serviceData } = dto;

        // atualiza apenas os campos do Service que não são relacionamentos
        await this.serviceRepository.update(id, serviceData);

        // retorna o service atualizado
        return this.findOne(id);
    }



    async remove(id: number): Promise<void> {
        const result = await this.serviceRepository.delete(id);
        if (result.affected === 0) throw new NotFoundException(`Service #${id} not found`);
    }

    async getStates(): Promise<string[]> {
        const result = await this.serviceRepository
            .createQueryBuilder('service')
            .select('DISTINCT service.state', 'state')
            .getRawMany();

        return result.map(s => s.state);
    }

    async getCitiesByState(state: string): Promise<string[]> {
        const result = await this.serviceRepository
            .createQueryBuilder('service')
            .select('DISTINCT service.city', 'city')
            .where('service.state = :state', { state })
            .getRawMany();

        return result.map(c => c.city);
    }
}
