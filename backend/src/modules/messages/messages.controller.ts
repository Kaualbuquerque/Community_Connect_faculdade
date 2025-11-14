import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { MessageService } from "./messages.service";
import { CreateMessageDto } from "./dto/create-message.dt";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@ApiTags("Messages")
@ApiBearerAuth()
@Controller("messages")
export class MessageController {
    constructor(private readonly messagesService: MessageService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: "Envia uma mensagem em uma conversa" })
    @ApiBody({ type: CreateMessageDto })
    @ApiResponse({ status: 201, description: "Mensagem criada com sucesso" })
    @ApiResponse({ status: 400, description: "Dados inválidos" })
    @ApiResponse({ status: 401, description: "Usuário não autenticado" })
    create(@Body() dto: CreateMessageDto) {
        return this.messagesService.create(dto);
    }

    @Get(":conversationId")
    @ApiOperation({ summary: "Lista mensagens de uma conversa" })
    @ApiParam({ name: "conversationId", example: 1, description: "ID da conversa" })
    @ApiQuery({ name: "page", required: false, example: 1, description: "Número da página" })
    @ApiQuery({ name: "limit", required: false, example: 20, description: "Quantidade de mensagens por página" })
    @ApiResponse({ status: 200, description: "Mensagens retornadas com sucesso" })
    getMessages(
        @Param("conversationId", ParseIntPipe) conversationId: number,
        @Query("page") page = 1,
        @Query("limit") limit = 20
    ) {
        return this.messagesService.findByConversation(conversationId, Number(page), Number(limit));
    }

    @Delete(":id")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: "Remove uma mensagem" })
    @ApiParam({ name: "id", example: 1, description: "ID da mensagem" })
    @ApiResponse({ status: 200, description: "Mensagem removida com sucesso" })
    @ApiResponse({ status: 401, description: "Usuário não autenticado" })
    @ApiResponse({ status: 404, description: "Mensagem não encontrada" })
    remove(@Param("id", ParseIntPipe) id: number) {
        return this.messagesService.remove(id);
    }
}
