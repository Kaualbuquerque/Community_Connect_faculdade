import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards } from "@nestjs/common";
import { MessageService } from "./messages.service";
import { CreateMessageDto } from "./dto/create-message.dt";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("messages")
export class MessageController {
    constructor(private readonly messagesService: MessageService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() dto: CreateMessageDto) {
        return this.messagesService.create(dto);
    }


    @Get(':conversationId')
    async getMessages(@Param('conversationId', ParseIntPipe) conversationId: number, @Query('page') page = 1, @Query('limit') limit = 20) {
        return this.messagesService.findByConversation(conversationId, Number(page), Number(limit));
    }


    @Delete(":id")
    @UseGuards(JwtAuthGuard)
    remove(@Param("id") id: number) {
        return this.messagesService.remove(id);
    }
}