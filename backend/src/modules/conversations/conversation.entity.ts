import { CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ConversationParticipant } from "./conversation-participant.entity";
import { Message } from "../messages/message.entity";

@Entity('conversations')
export class Conversation {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => Message, msg => msg.conversation)
    messages: Message[];

    @OneToMany(() => ConversationParticipant, cp => cp.conversation)
    participants: ConversationParticipant[];

    @OneToOne(() => Message, { nullable: true })
    @JoinColumn()
    lastMessage?: Message;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}