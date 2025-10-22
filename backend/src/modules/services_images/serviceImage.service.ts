import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ServiceImage } from "./serviceImage.entity";
import { Repository } from "typeorm";
import { Service } from "../services/service.entity";
import { UpdateServiceDto } from "../services/dto/update-service.dto";
import { User } from "../users/user.entity";

@Injectable()
export class ServiceImageService {
    constructor(
        @InjectRepository(ServiceImage)
        private readonly imageRepository: Repository<ServiceImage>, @InjectRepository(Service)
        private readonly serviceRepository: Repository<Service>,
    ) { }

    async addImage(serviceId: number, url: string): Promise<ServiceImage> {
        const count = await this.imageRepository.count({ where: { service: { id: serviceId } } });

        if (count >= 5) {
            throw new Error('Limit of 5 images per service reached');
        }

        const image = this.imageRepository.create({
            service: { id: serviceId } as any,
            url,
            position: count + 1,
        });

        return this.imageRepository.save(image);
    }

    async getImageByService(serviceId: number): Promise<ServiceImage[]> {
        return this.imageRepository.find({ where: { service: { id: serviceId } }, order: { position: "ASC" } })
    }

    async updateImages(
        id: number,
        dto: UpdateServiceDto,
        user: User,
        files?: Express.Multer.File[],
    ): Promise<Service> {
        console.log("🔧 Iniciando updateImages:", { id, user: user.id, fileCount: files?.length });

        const service = await this.serviceRepository.findOne({
            where: { id, provider: { id: user.id } },
            relations: ["images"],
        });

        if (!service) {
            throw new NotFoundException("Serviço não encontrado ou não pertence a este usuário!");
        }

        Object.assign(service, dto);

        if (files?.length) {
            if (files.length > 5) {
                throw new BadRequestException("Limite máximo de 5 imagens atingido!");
            }

            if (service.images.length > 0) {
                console.log("🧹 Removendo imagens antigas:", service.images.map(i => i.id));
                await this.imageRepository.remove(service.images);
            }

            const newImages = files.map((file, idx) => {
                console.log("📸 Arquivo recebido:", file);
                const filename = file.filename || file.originalname || 'undefined_file';
                return this.imageRepository.create({
                    url: `/uploads/${filename}`,
                    position: idx + 1,
                    service,
                });
            });

            await this.imageRepository.save(newImages);
            service.images = newImages;
        }

        const updated = await this.serviceRepository.save(service);
        console.log("✅ Serviço atualizado com sucesso:", updated.id);
        return updated;
    }



    async deleteImage(id: number) {
        await this.imageRepository.delete(id);
    }
}