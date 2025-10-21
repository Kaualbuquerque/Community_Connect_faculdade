import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { HistoryService } from "./history.service";
import { CreateHistoryDto } from "./dto/create-service-history.dto";

@Controller("history")
export class HistoryController {
    constructor(private readonly historyService: HistoryService) { }

    @Post()
    create(@Body() dto: CreateHistoryDto) {
        return this.historyService.create(dto);
    }

    @Get(":id")
    findAll(@Param("id") consumerId: number) {
        return this.historyService.findByConsumer(consumerId);
    }

    @Delete(":id")
    remove(@Param("id") id: number) {
        return this.historyService.remove(id);
    }
}