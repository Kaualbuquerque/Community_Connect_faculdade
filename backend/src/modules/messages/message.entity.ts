import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Conversation } from "../conversations/conversation.entity";
import { User } from "../users/user.entity";

@Index(['conversationId', 'timestamp'])
@Index(['senderId'])
@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  conversationId: number;

  @ManyToOne(() => Conversation, conv => conv.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "conversationId" })
  conversation: Conversation;

  @Column()
  senderId: number;

  @ManyToOne(() => User, user => user.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "senderId" })
  sender: User;

  @CreateDateColumn()
  timestamp: Date;

  @Column('text')
  content: string;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ nullable: true })
  editedAt?: Date;
}