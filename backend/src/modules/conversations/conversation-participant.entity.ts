import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Conversation } from "./conversation.entity";
import { User } from "../users/user.entity";

@Entity('conversation_participants')
export class ConversationParticipant {
  @PrimaryColumn()
  conversationId: number;

  @PrimaryColumn()
  @Index()
  userId: number;

  @ManyToOne(() => Conversation, conv => conv.participants)
  @JoinColumn({ name: "conversationId" })
  conversation: Conversation;

  @ManyToOne(() => User, user => user.conversations)
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({ nullable: true })
  lastReadMessageId?: number;

  @Column({ default: false })
  isDeleted: boolean;
}