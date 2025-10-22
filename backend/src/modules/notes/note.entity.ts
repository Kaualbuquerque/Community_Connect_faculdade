import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/user.entity";

@Entity("notes")
export class Note {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @Column({ type: "text"})
    content: string;

    @ManyToOne(() => User, (user) => user.notes, { onDelete: 'CASCADE', eager: true })
    user: User;
}