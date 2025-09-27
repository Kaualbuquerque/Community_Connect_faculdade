import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column({ length: 150, unique: true })
    email: string;

    @Column()
    password: string; // sempre hashar antes de salvar

    @Column({ length: 20 })
    phone: string;

    @Column({ type: 'enum', enum: ['consumer', 'provider'], default: 'consumer' })
    role: 'consumer' | 'provider';

    @Column({ length: 9 })
    cep: string;

    @Column({ length: 2 })
    state: string;

    @Column({ length: 100 })
    city: string;

    @Column({ length: 20 })
    number: string;

    @CreateDateColumn()
    createdAt: Date;

}