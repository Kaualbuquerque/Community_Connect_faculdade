import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Service } from "../services/service.entity";
import { Favorite } from "../favorites/favorite.entity";
import { Note } from "../notes/note.entity";
import { History } from "../history/history.entity";
import { ConversationParticipant } from "../conversations/conversation-participant.entity";
import { Message } from "../messages/message.entity";

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

    // Relations
    @OneToMany(() => Service, service => service.provider)
    services: Service[];

    @OneToMany(() => Favorite, favorite => favorite.consumer)
    favorites: Favorite[];

    @OneToMany(() => Note, note => note.user)
    notes: Note[];

    @OneToMany(() => History, history => history.consumer)
    history: History[];

    @OneToMany(() => Message, msg => msg.sender)
    messages: Message[];

    @OneToMany(() => ConversationParticipant, cp => cp.user)
    conversations: ConversationParticipant[];
}
