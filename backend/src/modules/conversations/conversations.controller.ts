import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { ConversationService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Conversations')
@ApiBearerAuth()
@Controller('conversations')
export class ConversationsController {
    constructor(private readonly convService: ConversationService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: 'Cria uma nova conversa',
        description: 'Cria uma conversa entre o usuário autenticado e outro participante.',
    })
    @ApiBody({ type: CreateConversationDto })
    @ApiResponse({ status: 201, description: 'Conversa criada com sucesso.' })
    @ApiResponse({ status: 400, description: 'Dados inválidos.' })
    @ApiResponse({ status: 401, description: 'Usuário não autenticado.' })
    async create(@Body() dto: CreateConversationDto, @Req() req) {
        const userId = req.user.id;
        return this.convService.create(dto, userId);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: 'Lista conversas do usuário autenticado',
        description: 'Retorna todas as conversas associadas ao usuário logado.',
    })
    @ApiResponse({ status: 200, description: 'Lista de conversas retornada com sucesso.' })
    @ApiResponse({ status: 401, description: 'Usuário não autenticado.' })
    async findAll(@Req() req) {
        const userId = req.user.id;
        return this.convService.findOne(userId);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: 'Busca uma conversa específica',
        description: 'Retorna uma conversa pelo seu ID.',
    })
    @ApiParam({ name: 'id', example: 1, description: 'ID da conversa' })
    @ApiResponse({ status: 200, description: 'Conversa encontrada com sucesso.' })
    @ApiResponse({ status: 404, description: 'Conversa não encontrada.' })
    @ApiResponse({ status: 401, description: 'Usuário não autenticado.' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.convService.findOne(id);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: 'Remove uma conversa',
        description: 'Exclui uma conversa associada ao usuário autenticado.',
    })
    @ApiParam({ name: 'id', example: 1, description: 'ID da conversa a ser removida' })
    @ApiResponse({ status: 200, description: 'Conversa removida com sucesso.' })
    @ApiResponse({ status: 404, description: 'Conversa não encontrada.' })
    @ApiResponse({ status: 401, description: 'Usuário não autenticado.' })
    async remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
        const userId = req.user.id;
        return this.convService.remove(id, userId);
    }
}
