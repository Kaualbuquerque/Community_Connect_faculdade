import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { ConversationService } from "./conversations.service";
import { CreateConversationDto } from "./dto/create-conversation.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";

@Controller('conversations')
export class ConversationsController {
    constructor(private readonly convService: ConversationService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Cria uma nova conversa',
        description: 'Cria uma conversa entre o usuário autenticado e outro participante.',
    })
    @ApiResponse({ status: 201, description: 'Conversa criada com sucesso.' })
    @ApiResponse({ status: 401, description: 'Usuário não autenticado.' })
    create(@Body() dto: CreateConversationDto, @Req() req) {
        const userId = req.user.id;
        return this.convService.create(dto, userId);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Lista todas as conversas do usuário',
        description: 'Retorna todas as conversas em que o usuário autenticado está participando.',
    })
    @ApiResponse({ status: 200, description: 'Lista de conversas retornada com sucesso.' })
    @ApiResponse({ status: 401, description: 'Usuário não autenticado.' })
    findAll() {
        return this.convService.findAll();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Busca uma conversa pelo ID',
        description: 'Retorna os detalhes de uma conversa específica pelo seu ID.',
    })
    @ApiParam({ name: 'id', example: 1, description: 'ID da conversa' })
    @ApiResponse({ status: 200, description: 'Conversa retornada com sucesso.' })
    @ApiResponse({ status: 401, description: 'Usuário não autenticado.' })
    @ApiResponse({ status: 404, description: 'Conversa não encontrada.' })
    findOne(@Param('id') id: number) {
        return this.convService.findOne(id);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Remove uma conversa',
        description: 'Remove uma conversa específica pelo seu ID.',
    })
    @ApiParam({ name: 'id', example: 1, description: 'ID da conversa a ser removida' })
    @ApiResponse({ status: 200, description: 'Conversa removida com sucesso.' })
    @ApiResponse({ status: 401, description: 'Usuário não autenticado.' })
    @ApiResponse({ status: 404, description: 'Conversa não encontrada.' })
    remove(@Param('id') id: number) {
        return this.convService.remove(id);
    }
}