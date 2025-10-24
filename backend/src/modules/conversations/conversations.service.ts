import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Conversation } from "./conversation.entity";
import { ConversationParticipant } from "./conversation-participant.entity";
import { DataSource, Repository } from "typeorm";
import { CreateConversationDto } from "./dto/create-conversation.dto";

@Injectable()
export class ConversationService {
    constructor(
        @InjectRepository(Conversation)
        private conversationRepository: Repository<Conversation>,

        private readonly dataSource: DataSource
    ) { }

    async create(dto: CreateConversationDto, userId: number): Promise<Conversation> {
        return await this.dataSource.transaction(async manager => {
            const existingConversation = await manager
                .getRepository(Conversation)
                .createQueryBuilder("c")
                .innerJoin("c.participants", "p1", "p1.userId = :userId", { userId })
                .innerJoin("c.participants", "p2", "p2.userId = :participantId", { participantId: dto.participantId })
                .getOne();

            if (existingConversation) {
                // Retorna a conversa existente
                return existingConversation;
            }

            const conversation = manager.create(Conversation);
            await manager.save(conversation);

            const participants = [
                manager.create(ConversationParticipant, { conversation, user: { id: userId } }),
                manager.create(ConversationParticipant, { conversation, user: { id: dto.participantId } }),
            ];
            await manager.save(participants);

            const result = await manager.findOne(Conversation, {
                where: { id: conversation.id },
                relations: ['participants'],
            });

            if (!result) throw new Error(`Conversation with id ${conversation.id} not found`);

            return result;
        });
    }


    findAll(): Promise<Conversation[]> {
        return this.conversationRepository.find({
            relations: ['participants', 'participants.user'],
        });
    }

    async findOne(userId: number) {
        return this.conversationRepository
            .createQueryBuilder("conversation")
            .leftJoinAndSelect("conversation.participants", "participant")
            .leftJoinAndSelect("participant.user", "user")
            .leftJoinAndSelect("conversation.lastMessage", "lastMessage")
            .where("participant.userId = :userId", { userId })
            .getMany();
    }


    async remove(id: number): Promise<void> {
        const res = await this.conversationRepository.delete(id);
        if (res.affected === 0) throw new NotFoundException(`Conversation #${id} not found`);
    }
}