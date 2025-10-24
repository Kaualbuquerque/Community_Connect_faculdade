import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ServiceImage } from '../serviceImage.entity';
import { Service } from '../../services/service.entity';
import { ServiceImageService } from '../serviceImage.service';

describe('ServiceImageService', () => {
    let service: ServiceImageService;
    let imageRepo: Partial<Repository<ServiceImage>>;
    let serviceRepo: Partial<Repository<Service>>;

    beforeEach(async () => {
        imageRepo = {
            count: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            remove: jest.fn(),
            delete: jest.fn(),
        };

        serviceRepo = {
            findOne: jest.fn(),
            save: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ServiceImageService,
                { provide: getRepositoryToken(ServiceImage), useValue: imageRepo },
                { provide: getRepositoryToken(Service), useValue: serviceRepo },
            ],
        }).compile();

        service = module.get<ServiceImageService>(ServiceImageService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('deve adicionar uma nova imagem se estiver abaixo do limite', async () => {
        (imageRepo.count as jest.Mock).mockResolvedValue(2);
        const mockImage = { id: 1, url: 'test.jpg', position: 3 };
        (imageRepo.create as jest.Mock).mockReturnValue(mockImage);
        (imageRepo.save as jest.Mock).mockResolvedValue(mockImage);

        const result = await service.addImage(1, 'test.jpg');

        expect(imageRepo.count).toHaveBeenCalledWith({ where: { service: { id: 1 } } });
        expect(imageRepo.create).toHaveBeenCalledWith({ service: { id: 1 }, url: 'test.jpg', position: 3 });
        expect(imageRepo.save).toHaveBeenCalledWith(mockImage);
        expect(result).toEqual(mockImage);
    });

    it('deve lançar erro se o limite de 5 imagens for atingido', async () => {
        (imageRepo.count as jest.Mock).mockResolvedValue(5);

        await expect(service.addImage(1, 'test.jpg')).rejects.toThrow('Limit of 5 images per service reached');
    });

    it('deve retornar as imagens de um serviço', async () => {
        const images = [{ id: 1, url: 'img1' }, { id: 2, url: 'img2' }];
        (imageRepo.find as jest.Mock).mockResolvedValue(images);

        const result = await service.getImageByService(1);

        expect(imageRepo.find).toHaveBeenCalledWith({ where: { service: { id: 1 } }, order: { position: 'ASC' } });
        expect(result).toEqual(images);
    });

    it('deve atualizar imagens, removendo as antigas e adicionando novas', async () => {
        const user = { id: 1 } as any;
        const dto = { title: 'Atualizado' } as any;

        const serviceEntity: any = {
            id: 1,
            provider: user,
            images: [{ id: 10, url: 'old.jpg', position: 1 }],
        };

        const oldImages = [...serviceEntity.images];

        (serviceRepo.findOne as jest.Mock).mockResolvedValue(serviceEntity);
        (imageRepo.create as jest.Mock).mockImplementation(img => img);
        const newImages = [{ url: '/uploads/new.jpg', position: 1, service: serviceEntity }];
        (imageRepo.save as jest.Mock).mockResolvedValue(newImages);
        (imageRepo.remove as jest.Mock).mockResolvedValue(undefined);
        (serviceRepo.save as jest.Mock).mockResolvedValue({ ...serviceEntity, title: 'Atualizado', images: newImages });

        const files = [{ filename: 'new.jpg' }] as any;

        const result = await service.updateImages(1, dto, user, files);

        expect(serviceRepo.findOne).toHaveBeenCalledWith({
            where: { id: 1, provider: { id: user.id } },
            relations: ['images'],
        });

        expect(imageRepo.remove).toHaveBeenCalledWith(oldImages);

        expect(imageRepo.create).toHaveBeenCalledWith({
            url: '/uploads/new.jpg',
            position: 1,
            service: serviceEntity,
        });

        expect(imageRepo.save).toHaveBeenCalledWith(newImages);
        expect(serviceRepo.save).toHaveBeenCalledWith({ ...serviceEntity, title: 'Atualizado', images: newImages });
        expect(result.images).toEqual(newImages);
    });

    it('deve lançar NotFoundException se o serviço não existir', async () => {
        const user = { id: 1 } as any;
        (serviceRepo.findOne as jest.Mock).mockResolvedValue(null);

        await expect(service.updateImages(1, {}, user, [])).rejects.toThrow(NotFoundException);
    });

    it('deve lançar BadRequestException se houver mais de 5 arquivos', async () => {
        const user = { id: 1 } as any;
        const serviceEntity: any = { id: 1, provider: user, images: [] };
        (serviceRepo.findOne as jest.Mock).mockResolvedValue(serviceEntity);

        const files = Array(6).fill({ filename: 'img.jpg' }) as any;

        await expect(service.updateImages(1, {}, user, files)).rejects.toThrow(BadRequestException);
    });

    it('deve deletar uma imagem', async () => {
        (imageRepo.delete as jest.Mock).mockResolvedValue(undefined);

        await service.deleteImage(1);

        expect(imageRepo.delete).toHaveBeenCalledWith(1);
    });
});
