import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { HistoryService } from "./history.service";
import { CreateHistoryDto } from "./dto/create-service-history.dto";

@ApiTags("History")
@Controller("history")
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Post()
  @ApiOperation({ summary: "Registra um histórico de uso de serviço" })
  @ApiBody({ type: CreateHistoryDto })
  @ApiResponse({ status: 201, description: "Histórico criado com sucesso" })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  create(@Body() dto: CreateHistoryDto) {
    return this.historyService.create(dto);
  }

  @Get(":id")
  @ApiOperation({ summary: "Retorna o histórico de um consumidor específico" })
  @ApiParam({ name: "id", example: 3, description: "ID do consumidor" })
  @ApiResponse({ status: 200, description: "Histórico retornado com sucesso" })
  @ApiResponse({ status: 404, description: "Consumidor não encontrado" })
  findAll(@Param("id", ParseIntPipe) consumerId: number) {
    return this.historyService.findByConsumer(consumerId);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Remove um histórico específico" })
  @ApiParam({ name: "id", example: 1, description: "ID do histórico a ser removido" })
  @ApiResponse({ status: 200, description: "Histórico removido com sucesso" })
  @ApiResponse({ status: 404, description: "Histórico não encontrado" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.historyService.remove(id);
  }
}
