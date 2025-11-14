import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ServiceImage } from "./serviceImage.entity";
import { DeepPartial, Repository } from "typeorm";
import { Service } from "../services/service.entity";
import { UpdateServiceDto } from "../services/dto/update-service.dto";
import { User } from "../users/user.entity";
import { Readable } from "stream";
import type { UploadApiResponse } from 'cloudinary';

@Injectable()
export class ServiceImageService {
    constructor(
        @InjectRepository(ServiceImage)
        private readonly imageRepository: Repository<ServiceImage>, @InjectRepository(Service)
        private readonly serviceRepository: Repository<Service>,

        @Inject('CLOUDINARY')
        private readonly cloudinary: typeof import('cloudinary').v2,
    ) { }

    async addImage(serviceId: number, file: Express.Multer.File): Promise<ServiceImage> {
        // Verifica se já atingiu o limite de 5 imagens
        const count = await this.imageRepository.count({ where: { service: { id: serviceId } } });
        if (count >= 5) {
            throw new BadRequestException('Limit of 5 images per service reached');
        }

        // Faz upload da imagem para o Cloudinary
        const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
            const uploadStream = this.cloudinary.uploader.upload_stream(
                { folder: 'community_connect/services' },
                (error, result) => {
                    if (error) return reject(error);
                    if (!result) return reject(new Error('No upload result from Cloudinary'));
                    resolve(result);
                },
            );

            const stream = Readable.from(file.buffer);
            stream.pipe(uploadStream);
        });

        // Cria o registro da imagem no banco de dados
        const image = this.imageRepository.create({
            service: { id: serviceId } as any,
            url: uploadResult.secure_url,
            public_id: uploadResult.public_id,
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
        // Busca o serviço com imagens
        const service = await this.serviceRepository.findOne({
            where: { id, provider: { id: user.id } },
            relations: ['images'],
        });

        if (!service) {
            throw new NotFoundException('Service not found or does not belong to this user!');
        }

        // Atualiza dados do serviço
        Object.assign(service, dto);

        if (files?.length) {
            if (files.length > 5) {
                throw new BadRequestException('Maximum limit of 5 images reached!');
            }

            // Deleta imagens antigas do Cloudinary
            if (service.images.length > 0) {
                for (const img of service.images) {
                    if (img.public_id) {
                        await this.cloudinary.uploader.destroy(img.public_id);
                    }
                }
                await this.imageRepository.remove(service.images);
            }

            // Faz upload das novas imagens para o Cloudinary
            const newImages: ServiceImage[] = [];
            for (let idx = 0; idx < files.length; idx++) {
                const file = files[idx];
                const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
                    const uploadStream = this.cloudinary.uploader.upload_stream(
                        { folder: 'community_connect/services' },
                        (error, result) => {
                            if (error) return reject(error);
                            if (!result) return reject(new Error('No upload result from Cloudinary'));
                            resolve(result);
                        },
                    );
                    Readable.from(file.buffer).pipe(uploadStream);
                });

                const image = this.imageRepository.create({
                    url: uploadResult.secure_url,
                    public_id: uploadResult.public_id,
                    position: idx + 1,
                    service,
                } as DeepPartial<ServiceImage>);

                newImages.push(image);
            }

            // Salva novas imagens no banco
            await this.imageRepository.save(newImages);
            service.images = newImages;
        }

        return await this.serviceRepository.save(service);
    }

    async deleteImage(id: number): Promise<void> {
        // Busca a imagem no banco
        const image = await this.imageRepository.findOne({ where: { id } });
        if (!image) {
            throw new NotFoundException('Image not found');
        }

        // Deleta do Cloudinary, se tiver public_id
        if (image.public_id) {
            await this.cloudinary.uploader.destroy(image.public_id);
        }

        // Deleta do banco
        await this.imageRepository.delete(id);
    }

}