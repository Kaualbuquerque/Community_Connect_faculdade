import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { HistoryService } from "./history.service";
import { CreateHistoryDto } from "./dto/create-service-history.dto";
import { ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";

@Controller("history")
export class HistoryController {
    constructor(private readonly historyService: HistoryService) {}
  
    @Post()
    @ApiOperation({
      summary: 'Cria um registro de histórico',
      description: 'Adiciona um registro de uso de serviço pelo consumidor.',
    })
    @ApiResponse({ status: 201, description: 'Registro de histórico criado com sucesso.' })
    create(@Body() dto: CreateHistoryDto) {
      return this.historyService.create(dto);
    }
  
    @Get(':id')
    @ApiOperation({
      summary: 'Lista o histórico de um consumidor',
      description: 'Retorna todos os registros de histórico de serviços utilizados por um consumidor específico.',
    })
    @ApiParam({ name: 'id', example: 1, description: 'ID do consumidor' })
    @ApiResponse({ status: 200, description: 'Histórico retornado com sucesso.' })
    @ApiResponse({ status: 404, description: 'Consumidor não encontrado.' })
    findAll(@Param('id') consumerId: number) {
      return this.historyService.findByConsumer(consumerId);
    }
  
    @Delete(':id')
    @ApiOperation({
      summary: 'Remove um registro de histórico',
      description: 'Remove um registro de histórico específico pelo seu ID.',
    })
    @ApiParam({ name: 'id', example: 1, description: 'ID do registro de histórico a ser removido' })
    @ApiResponse({ status: 200, description: 'Registro de histórico removido com sucesso.' })
    @ApiResponse({ status: 404, description: 'Registro não encontrado.' })
    remove(@Param('id') id: number) {
      return this.historyService.remove(id);
    }
  }