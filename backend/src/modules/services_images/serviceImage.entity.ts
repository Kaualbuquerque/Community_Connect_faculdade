import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Service } from "../services/service.entity";

@Entity("service_images")
export class ServiceImage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url: string;

    @Column()
    public_id: string;

    @Column()
    position: number;

    @ManyToOne(() => Service, (service) => service.images, { onDelete: 'CASCADE' })
    service: Service;
}