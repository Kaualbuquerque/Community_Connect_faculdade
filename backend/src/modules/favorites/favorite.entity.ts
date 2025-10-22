import { Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/user.entity";
import { Service } from "../services/service.entity";

@Index(["consumer", "service"], { unique: true })
@Entity("favorites")
export class Favorite {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.favorites, { onDelete: 'CASCADE', eager: true })
    consumer: User;

    @ManyToOne(() => Service, service => service.favorites, { onDelete: 'CASCADE', eager: true })
    service: Service;
}