import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards } from "@nestjs/common";
import { MessageService } from "./messages.service";
import { CreateMessageDto } from "./dto/create-message.dt";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";

@Controller('messages')
export class MessageController {
    constructor(private readonly messagesService: MessageService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Cria uma nova mensagem',
        description: 'Envia uma mensagem em uma conversa existente.',
    })
    @ApiResponse({ status: 201, description: 'Mensagem criada com sucesso.' })
    @ApiResponse({ status: 401, description: 'Usuário não autenticado.' })
    create(@Body() dto: CreateMessageDto) {
        return this.messagesService.create(dto);
    }

    @Get(':conversationId')
    @ApiOperation({
        summary: 'Busca mensagens de uma conversa',
        description: 'Retorna mensagens de uma conversa específica, com paginação opcional.',
    })
    @ApiParam({ name: 'conversationId', example: 1, description: 'ID da conversa' })
    @ApiQuery({ name: 'page', required: false, example: 1, description: 'Número da página para paginação' })
    @ApiQuery({ name: 'limit', required: false, example: 20, description: 'Quantidade de mensagens por página' })
    @ApiResponse({ status: 200, description: 'Mensagens retornadas com sucesso.' })
    getMessages(
        @Param('conversationId', ParseIntPipe) conversationId: number,
        @Query('page') page = 1,
        @Query('limit') limit = 20,
    ) {
        return this.messagesService.findByConversation(conversationId, Number(page), Number(limit));
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Remove uma mensagem',
        description: 'Remove uma mensagem específica pelo seu ID.',
    })
    @ApiParam({ name: 'id', example: 5, description: 'ID da mensagem a ser removida' })
    @ApiResponse({ status: 200, description: 'Mensagem removida com sucesso.' })
    @ApiResponse({ status: 401, description: 'Usuário não autenticado.' })
    @ApiResponse({ status: 404, description: 'Mensagem não encontrada.' })
    remove(@Param('id') id: number) {
        return this.messagesService.remove(id);
    }
}