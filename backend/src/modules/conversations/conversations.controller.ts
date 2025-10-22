import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { ConversationService } from "./conversations.service";
import { CreateConversationDto } from "./dto/create-conversation.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller('conversations')
export class ConversationsController {
    constructor(private readonly convService: ConversationService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Body() dto: CreateConversationDto, @Req() req) {
        const userId = req.user.id; // id do usuário logado
        return this.convService.create(dto, userId);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    findAll() {
        return this.convService.findAll();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    findOne(@Param('id') id: number) {
        return this.convService.findOne(id);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id') id: number) {
        return this.convService.remove(id);
    }
}